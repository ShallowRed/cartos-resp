import type { GeoData } from '@/types/service.types'
import * as d3 from 'd3'
import * as topojson from '@/core/topojson'

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
  const rawData = await d3.json('/data/departements.json')
  const departementsData = simplifyTopojson(rawData, 0.2)

  const departementsFeatures = topojson.feature(departementsData, departementsData.objects['departements-light'])

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
