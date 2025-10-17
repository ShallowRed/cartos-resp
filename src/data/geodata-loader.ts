import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { GeoData } from '@/types/service.types'
import * as d3 from 'd3'
import * as topojson from '@/data/topojson'
import { getMissingDepartmentCodes, TERRITORY_TO_DEPARTMENT_CODE } from './territory-mapping'

export type GeoDataResult = GeoData

// Note: These functions may need proper topojson-specific packages for full typing
function simplifyTopojson(data: any, quantile: number = 0.01): any {
  const presimplifiedData = topojson.presimplify(data)
  const simplifiedData = topojson.simplify(presimplifiedData, topojson.quantile(presimplifiedData, quantile))
  return simplifiedData
}

function getAggregatedFeature(
  geometries: any[],
  getGroupId: (geometry: any) => string,
  getGroupFeature: (group: any[]) => any,
): any {
  // Map<string, Feature>
  const featuresByRegion = d3.rollup(geometries, getGroupFeature, getGroupId)

  return {
    type: 'FeatureCollection',
    features: Array.from(featuresByRegion.values()),
  }
}

export async function loadDepartementsData(): Promise<GeoDataResult> {
  // Load the main departements TopoJSON (metropolitan + some overseas)
  const rawData = await d3.json(`${import.meta.env.BASE_URL}data/departements.json`)
  const departementsData = simplifyTopojson(rawData, 0.2)

  const departementsFeatures = topojson.feature(departementsData, departementsData.objects['departements-light']) as unknown as FeatureCollection<Geometry>

  // Check which department codes are missing
  const existingCodes = departementsFeatures.features.map((f: any) => f.properties.INSEE_DEP)
  const missingCodes = getMissingDepartmentCodes(existingCodes)

  // Load Natural Earth territories if we have missing codes
  if (missingCodes.length > 0) {
    console.log(`Loading ${missingCodes.length} missing territories from Natural Earth:`, missingCodes)

    try {
      const naturalEarthData = await d3.json(`${import.meta.env.BASE_URL}data/france-territories-10m.json`) as FeatureCollection<Geometry>

      // Add missing territories to the feature collection
      for (const missingCode of missingCodes) {
        // Find the corresponding territory code
        const territoryCode = Object.entries(TERRITORY_TO_DEPARTMENT_CODE)
          .find(([_, dept]) => dept === missingCode)?.[0]

        if (territoryCode) {
          // Find the feature in Natural Earth data
          const neFeature = naturalEarthData.features.find(
            (f: Feature<Geometry>) => (f.properties as any)?.code === territoryCode,
          )

          if (neFeature) {
            // Create a new feature with INSEE_DEP property
            const newFeature: Feature<Geometry> = {
              ...neFeature,
              properties: {
                ...neFeature.properties,
                INSEE_DEP: missingCode,
                NOM: neFeature.properties?.name || territoryCode,
                // Keep original properties for reference
                _source: 'natural-earth',
                _territoryCode: territoryCode,
              },
            }

            departementsFeatures.features.push(newFeature as any)
            console.log(`✓ Added ${territoryCode} (${missingCode}): ${newFeature.properties?.name}`)
          }
          else {
            console.warn(`✗ Territory ${territoryCode} not found in Natural Earth data for code ${missingCode}`)
          }
        }
        else {
          console.warn(`✗ No territory mapping found for department code ${missingCode}`)
        }
      }
    }
    catch (error) {
      console.error('Failed to load Natural Earth territories:', error)
      console.log('Continuing with existing departements only')
    }
  }

  // const departementsMesh = topojson.mesh(departementsData, departementsData.objects['departements-light'])

  const departementsInnerMesh = topojson.mesh(departementsData, departementsData.objects['departements-light'], (a: any, b: any) => a !== b)

  const departementsOuterMesh = topojson.mesh(departementsData, departementsData.objects['departements-light'], (a: any, b: any) => a === b)

  const regionCodeKey = 'INSEE_REG'
  const getGroupId = (d: any) => d.properties[regionCodeKey]
  const aggregatedRegionsFeatures = getAggregatedFeature(
    departementsData.objects['departements-light'].geometries,
    getGroupId,
    (group: any[]) => ({
      type: 'Feature',
      properties: { regionCode: getGroupId(group[0]) },
      geometry: topojson.merge(departementsData, group),
    }),
  )

  const departementsRegionMesh = topojson.mesh(departementsData, aggregatedRegionsFeatures.features)

  return {
    featureCollection: departementsFeatures as any,
    backgroundGeometry: departementsOuterMesh,
    overlayMeshes: [
      { geo: departementsInnerMesh, stroke: '#bbb', strokeWidth: 1 },
      { geo: departementsRegionMesh, stroke: '#777', strokeWidth: 1 },
    ],
    outlineGeometry: departementsOuterMesh,
  }
}
