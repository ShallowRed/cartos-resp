import type { ServiceDataRow } from '../types/service.types'

/**
 * Template string interpolation for dynamic titles
 */
export interface TitleTemplate {
  pattern: string
  variables: Record<string, (service: any) => string>
}

/**
 * Color scheme configuration per metric
 */
export interface MetricColorScheme {
  scheme: string
  label: string
  type?: 'quantize' | 'quantile' | 'threshold'
  domain?: number[]
  percent?: boolean
  legend?: boolean
}

/**
 * Tooltip configuration for maps
 */
export interface TooltipConfig {
  template: string
  formatters?: Record<string, (value: any) => string>
  includeSecondaryMetric?: boolean
}

/**
 * Service-specific rendering configuration
 */
export interface ServiceRenderConfig {
  /** Template for generating plot titles */
  titleTemplates: Record<string, string>

  /** Color schemes per metric */
  colorSchemes: Record<string, MetricColorScheme>

  /** Data key mappings */
  dataKeys: {
    /** Key for extracting department code from tabular data */
    rowKey: string
    /** Key for extracting department code from geographic features */
    featureKey: string
  }

  /** Tooltip configuration */
  tooltip: TooltipConfig

  /** Custom value processing */
  valueProcessor?: (row: ServiceDataRow, metric: string) => any

  /** Custom number normalization */
  numberNormalizer?: (value: any) => number | null
}

/**
 * Complete service configuration combining data and rendering
 */
export interface ServiceConfig {
  /** Service metadata */
  id: string
  title: string
  dataFile: string

  /** Entry definitions for form controls */
  formControls: Record<string, Array<{ label: string, key: string }>>

  /** Rendering configuration */
  rendering: ServiceRenderConfig
}

/**
 * Default number normalizer for comma-decimal conversion
 */
export function defaultNumberNormalizer(v: any): number | null {
  return v == null ? null : +String(v).replace(',', '.')
}

/**
 * Default feature key extractor for French departments
 */
export function defaultFeatureKey(f: any): string {
  const p = f.properties || {}
  return String(p.INSEE_DEP ?? p.insee_dep ?? p.code ?? p.DEP).toUpperCase().padStart(2, '0')
}

/**
 * Interpolate template string with service context
 */
export function interpolateTitle(
  template: string,
  facilityLabel: string,
  metricKey: string,
  metricLabel?: string,
): string {
  return template
    .replace('{facility}', facilityLabel)
    .replace('{metric}', metricLabel || metricKey)
}
