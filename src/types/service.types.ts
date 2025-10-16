/**
 * Service Type Definitions
 * Comprehensive TypeScript interfaces for map services and renderers
 */

import type * as Plot from '@observablehq/plot'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { Ref } from 'vue'

/**
 * Entry option for select inputs (facilities, metrics, etc.)
 */
export interface InputEntry {
  label: string
  key: string
}

/**
 * Form control definition with grouped entries
 */
export interface FormControl {
  key: string
  label: string
  entries: InputEntry[]
}

/**
 * CSV data row - generic shape for all service data
 */
export interface ServiceDataRow {
  DEP?: string
  [key: string]: string | undefined
}

/**
 * Geographic data structure containing all necessary map geometry
 */
export interface GeoData {
  featureCollection: FeatureCollection<Geometry>
  backgroundGeometry?: Geometry
  overlayMeshes?: OverlayMesh[]
  outlineGeometry?: Geometry
}

/**
 * Color scale configuration for choropleth maps
 */
export interface ColorScaleConfig {
  legend: boolean
  type: 'quantize' | 'threshold' | 'ordinal'
  scheme: string
  percent?: boolean
  label: string
}

/**
 * Overlay mesh configuration for choropleth maps
 */
export interface OverlayMesh {
  geo: Geometry
  stroke?: string
  strokeWidth?: number
  [key: string]: any
}

/**
 * Configuration for rendering choropleth maps
 */
export interface ChoroplethConfig {
  plotTitle?: string | null
  tabularData: ServiceDataRow[]
  featureCollection?: FeatureCollection<Geometry>
  featureKey: (feature: Feature<Geometry>) => string
  rowKey: (row: ServiceDataRow) => string | undefined
  valueAccessor: (row: ServiceDataRow) => any
  numberNormalizer: (value: any) => number | null
  colorScale: ColorScaleConfig
  backgroundGeometry?: Geometry | null
  overlayMeshes?: OverlayMesh[]
  outlineGeometry?: Geometry | null
  titleBuilder: (feature: Feature<Geometry>, value: number | null, row?: ServiceDataRow) => string
}

/**
 * Map renderer function type
 * Returns the rendered plot element (HTML/SVG)
 */
export interface MapRenderer {
  (geoData: GeoData, service: MapService): (HTMLElement | SVGSVGElement) & Plot.Plot
}

/**
 * Map service constructor options
 */
export interface MapServiceOptions {
  title: string
  dataFile: string
  formControls: FormControl[]
}

/**
 * Map service interface
 */
export interface MapService {
  title: string
  dataFile: string
  data: ServiceDataRow[]
  formControls: FormControl[]
  selectedFormControls: Map<string, string>
  version: Ref<number>

  loadData: () => Promise<void>
  getSelectedEntry: (entryKey: string) => string | undefined
  setSelectedEntry: (entryKey: string, selectedKey: string) => void
  getSelectedEntryLabel: (entryKey: string) => string | undefined
  filteredData: ServiceDataRow[]
}
