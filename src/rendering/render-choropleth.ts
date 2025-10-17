import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { ChoroplethConfig as BaseChoroplethConfig, OverlayMesh, ServiceDataRow } from '@/types/service.types'
import * as Plot from '@observablehq/plot'
import * as d3 from 'd3'
import * as d3CompositeProjections from 'd3-composite-projections'
import { createFranceProjection } from '@/services/custom-projection'
// Extended color scale config with internal options
interface ColorScaleConfig {
  legend?: boolean
  type?: string
  scheme?: string
  label?: string
  domain?: [number, number]
  tickFormat?: (d: number) => string
  percent?: boolean
  range?: string[]
  _needsDivergingDomain?: boolean
}

// Internal ChoroplethConfig with additional options for internal use
interface ChoroplethConfig extends Omit<BaseChoroplethConfig, 'colorScale' | 'rowKey' | 'plotTitle' | 'featureCollection'> {
  plotTitle: string | null
  featureCollection: FeatureCollection<Geometry>
  rowKey: (row: ServiceDataRow) => string
  colorScale: ColorScaleConfig
  fillUnknown: string
  projection: any
  width: number
  height: number
  inset: number
  showLegend: boolean
  backgroundFill: string
  rowFilter: ((row: ServiceDataRow) => boolean) | null
  outlineStroke: string
  outlineStrokeWidth: number
}

interface DataIndexEntry {
  row: ServiceDataRow
  value: number | null
}

interface CentroidPoint {
  lon: number
  lat: number
  value: number | null
  feature: Feature<Geometry>
  row: ServiceDataRow | null
  name: string
}

export function renderChoropleth(options: Partial<ChoroplethConfig> = {}) {
  /**
   * Renders an interactive choropleth (thematic) map using Observable Plot.
   *
   * This function creates a map visualization by:
   * 1. Joining tabular data with GeoJSON features
   * 2. Coloring regions based on data values
   * 3. Adding interactive tooltips on hover
   *
   * @param options - Configuration object
   * @returns Observable Plot chart
   *
   * @example
   * renderChoropleth({
   *   tabularData: unemploymentData,
   *   featureCollection: departmentsGeoJSON,
   *   valueAccessor: d => d.unemployment_rate,
   *   colorScale: { scheme: "reds", domain: [0, 0.15] }
   * })
   */
  // ========== CONFIGURATION ==========
  const config = extractConfiguration(options)

  // ========== DATA PREPARATION ==========
  const dataIndex = buildDataIndex(config)

  // ========== DIVERGING DOMAIN CALCULATION ==========
  // Calculate symmetric domain for diverging scales if needed
  if (config.colorScale._needsDivergingDomain) {
    const values = Array.from(dataIndex.values())
      .map(entry => entry.value)
      .filter(v => v !== null) as number[]

    if (values.length > 0) {
      const maxAbs = Math.max(...values.map(Math.abs))
      config.colorScale.domain = [-maxAbs, maxAbs]
      delete config.colorScale._needsDivergingDomain
    }
  }

  // ========== CHART CONSTRUCTION ==========
  const chart = buildChart(config, dataIndex)

  // ========== POST-PROCESSING ==========
  addCompositionBorders(chart, config.projection)

  return chart

  /**
   * Extracts and validates configuration with sensible defaults.
   * This makes the configuration explicit and easy to understand.
   */
  function extractConfiguration(options: Partial<ChoroplethConfig>): ChoroplethConfig {
    return {
      // === Data & Joining ===
      // Your tabular data (array of objects from CSV/JSON)
      tabularData: options.tabularData || [],

      // Your GeoJSON FeatureCollection (the geographic boundaries)
      featureCollection: options.featureCollection!,

      // Function to extract the join key from a GeoJSON feature
      // Default: looks for INSEE_DEP property (French department code)
      featureKey: options.featureKey ?? (f => f.properties?.INSEE_DEP),

      // Function to extract the join key from a data row
      // Default: looks for DEP property
      rowKey: options.rowKey ? (r: ServiceDataRow) => options.rowKey!(r) || '' : r => r.DEP || '',

      // Function to extract the numeric value to visualize
      // Default: looks for pct_pop property
      valueAccessor: options.valueAccessor ?? (r => r.pct_pop),

      // Optional filter function to select which rows to include
      rowFilter: options.rowFilter ?? null,

      // Function to normalize values (handles strings, commas, nulls)
      numberNormalizer: options.numberNormalizer ?? ((v) => {
        if (v == null || v === '')
          return null
        return typeof v === 'number' ? v : +String(v).replace(',', '.')
      }),

      // === Color Styling ===
      // Color scale configuration for the choropleth
      colorScale: (() => {
        const defaults = {
          legend: true,
          type: 'quantize',
          scheme: 'blues',
          label: '',
        }
        const merged = { ...defaults, ...options.colorScale }

        // Extract percent option (custom option, not a Plot option)
        const { percent, domain, range, ...plotOptions } = merged

        // Create the final config object
        const finalConfig: any = { ...plotOptions }

        // Handle domain calculation for diverging scales
        if (options.colorScale?.domain !== undefined) {
          finalConfig.domain = domain
        }
        else if (plotOptions.type === 'diverging') {
          // For diverging scales without explicit domain, calculate symmetric domain
          // We'll do this after data processing when we have access to all values
          finalConfig._needsDivergingDomain = true
        }

        // Add percentage formatting if percent is true
        if (percent) {
          finalConfig.tickFormat = (d: number) => `${(d * 100).toFixed(0)}%`
        }

        if (range !== undefined) {
          finalConfig.range = range
          delete finalConfig.scheme
        }

        return finalConfig
      })(),

      // Color for regions with no data
      fillUnknown: options.fillUnknown ?? '#eee',

      // === Map Projection & Dimensions ===
      // D3 projection for transforming coordinates
      projection: createFranceProjection,
      // projection: options.projection ?? d3CompositeProjections.geoConicConformalFrance(),
      width: options.width ?? 960,
      height: options.height ?? 500,
      inset: options.inset ?? 8,

      // Kept for backward compatibility (not actively used)
      showLegend: options.showLegend ?? true,

      // === Background & Overlays ===
      // Optional background layer
      backgroundFill: options.backgroundFill ?? '#d8d8d8',
      backgroundGeometry: options.backgroundGeometry ?? undefined,

      // Additional mesh layers (borders, grids, etc.)
      // Format: [{geo: GeoJSON, stroke: "color", strokeWidth: 1}, ...]
      overlayMeshes: options.overlayMeshes ?? [],

      // Optional outline around the entire map
      outlineGeometry: options.outlineGeometry ?? undefined,
      outlineStroke: options.outlineStroke ?? '#222',
      outlineStrokeWidth: options.outlineStrokeWidth ?? 1,

      // === Tooltips ===
      // Function to build tooltip text
      // Receives: (feature, value, row) -> string
      titleBuilder: options.titleBuilder ?? ((feature: Feature<Geometry>, value: number | null, _row: ServiceDataRow | undefined) => {
        const name = getFeatureName(feature)
        const displayValue = formatValue(value)
        return `${name}\n${displayValue}`
      }),

      // === Chart Title ===
      plotTitle: options.plotTitle ?? null,
    }
  }

  /**
   * Builds an efficient lookup index for joining data with features.
   * Maps: geographic key -> { row, value }
   *
   * This enables O(1) lookups when coloring features.
   */
  function buildDataIndex(config: ChoroplethConfig): Map<string, DataIndexEntry> {
    // Apply optional filter
    const filteredData = config.rowFilter
      ? config.tabularData.filter(config.rowFilter)
      : config.tabularData

    const index = new Map()

    for (const row of filteredData) {
      const key = normalizeKey(config.rowKey(row))
      const value = config.numberNormalizer(config.valueAccessor(row))
      index.set(key, { row, value })
    }

    return index
  }

  /**
   * Computes centroid points for interactive tooltips.
   *
   * Observable Plot's pointer transform works best with point data.
   * We create invisible centroid points that enable precise hover detection.
   */
  function buildCentroidPoints(config: ChoroplethConfig, dataIndex: Map<string, DataIndexEntry>): CentroidPoint[] {
    return config.featureCollection.features.map((feature: Feature<Geometry>) => {
      // Compute geographic centroid (lon, lat in degrees)
      const [lon, lat] = d3.geoCentroid(feature)

      // Look up associated data
      const key = normalizeKey(config.featureKey(feature))
      const data = dataIndex.get(key)

      return {
        lon,
        lat,
        value: data?.value ?? null,
        feature,
        row: data?.row ?? null,
        name: getFeatureName(feature, key),
      }
    })
  }

  /**
   * Constructs the main Observable Plot chart.
   * Assembles all layers in the correct order.
   */
  function buildChart(config: ChoroplethConfig, dataIndex: Map<string, DataIndexEntry>) {
    // Build centroid points for tooltips (handles composite projections correctly)
    const centroidPoints = buildCentroidPoints(config, dataIndex)

    return Plot.plot({
      title: config.plotTitle,
      width: config.width,
      height: config.height,
      inset: config.inset,
      projection: config.projection,
      color: config.colorScale as any,
      marks: [
        // Layer 1: Optional background
        ...createBackgroundLayer(config),

        // Layer 2: Colored choropleth polygons (main layer)
        ...createChoroplethLayer(config, dataIndex),

        // Layer 3: Optional overlay meshes (borders, grids)
        ...createOverlayLayers(config),

        // Layer 4: Optional outline
        ...createOutlineLayer(config),

        // Layer 5: Invisible centroid points for tooltips
        ...createTooltipLayer(config, centroidPoints),
      ],
    })
  }

  /**
   * Layer 1: Creates optional background fill.
   */
  function createBackgroundLayer(config: ChoroplethConfig) {
    if (!config.backgroundGeometry)
      return []

    return [
      Plot.geo(config.backgroundGeometry, {
        fill: config.backgroundFill,
        pointerEvents: 'none',
      }),
    ]
  }

  /**
   * Layer 2: Creates the main choropleth layer.
   * Each region is colored based on its data value.
   */
  function createChoroplethLayer(config: ChoroplethConfig, dataIndex: Map<string, DataIndexEntry>) {
    // Helper: Get fill color for a feature
    const getFillColor = (feature: Feature<Geometry>) => {
      const key = normalizeKey(config.featureKey(feature))
      const data = dataIndex.get(key)
      return data?.value ?? null
    }

    // Base layer: colored regions
    return [
      Plot.geo(config.featureCollection, {
        fill: getFillColor,
        stroke: 'white',
        strokeWidth: 0.5,
        strokeOpacity: 0.3,
      }),
    ]
  }

  /**
   * Layer 3: Creates overlay mesh layers.
   * Used for borders, grids, or other decorative elements.
   */
  function createOverlayLayers(config: ChoroplethConfig) {
    return (config.overlayMeshes || []).map(({ geo, ...styleProps }: OverlayMesh) =>
      Plot.geo(geo, {
        pointerEvents: 'none',
        ...styleProps,
      }),
    )
  }

  /**
   * Layer 4: Creates optional outline layer.
   * Typically used for country/region borders.
   */
  function createOutlineLayer(config: ChoroplethConfig) {
    if (!config.outlineGeometry)
      return []

    return [
      Plot.geo(config.outlineGeometry, {
        stroke: config.outlineStroke,
        strokeWidth: config.outlineStrokeWidth,
        pointerEvents: 'none',
      }),
    ]
  }

  /**
   * Layer 5: Creates invisible tooltip layer using centroid points.
   * This approach works correctly with composite projections because
   * centroids are computed in the projected coordinate space.
   */
  function createTooltipLayer(config: ChoroplethConfig, centroidPoints: CentroidPoint[]) {
    return [
      Plot.dot(centroidPoints, {
        x: 'lon',
        y: 'lat',
        r: 15, // Invisible but provides hover area
        fill: 'transparent',
        stroke: 'none',
        title: d => config.titleBuilder(d.feature, d.value, d.row),
        tip: true,
      }),
    ]
  }

  /**
   * Post-processing: Adds composition borders for composite projections.
   *
   * This is specific to d3-composite-projections (e.g., France with overseas regions).
   * These projections provide a getCompositionBorders() method that returns
   * the boundaries between composed projection zones.
   */
  function addCompositionBorders(chart: any, projection: any) {
    // Skip if projection doesn't support composition borders
    if (!projection.getCompositionBorders)
      return

    // Find the SVG element (handle both direct SVG and figure wrapper)
    const svg = d3.select(chart).select('svg').node()
      ? d3.select(chart).select('svg')
      : d3.select(chart)

    // Add border path to the plot group
    svg.select('g[aria-label=\'plot\'], g.plot, g.layer')
      .append('path')
      .attr('d', projection.getCompositionBorders())
      .attr('fill', 'none')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1)
      .attr('pointer-events', 'none')
  }

  // ========== UTILITY FUNCTIONS ==========

  /**
   * Normalizes a geographic key for consistent lookup.
   * Pads single-digit codes with a leading zero.
   *
   * Examples: 4 -> "04", "04" -> "04", "75" -> "75"
   */
  function normalizeKey(key: any): string {
    return String(key).padStart(2, '0')
  }

  /**
   * Extracts a human-readable name from a GeoJSON feature.
   * Tries multiple common property names.
   */
  function getFeatureName(feature: Feature<Geometry>, fallbackKey: string = ''): string {
    return feature.properties?.NOM
      ?? feature.properties?.nom
      ?? feature.properties?.name
      ?? feature.properties?.NAME
      ?? fallbackKey
  }

  /**
   * Formats a numeric value for display in tooltips.
   *
   * - null/undefined -> "—"
   * - 0-1 range -> percentage with 1 decimal
   * - other -> plain number
   */
  function formatValue(value: number | null): string {
    if (value == null)
      return '—'

    // Assume values between 0-1 are proportions/rates
    if (value >= 0 && value <= 1) {
      return `${(value * 100).toFixed(1)} %`
    }

    return `${value}`
  }
}
