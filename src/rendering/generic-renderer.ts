import type MapService from '@/services/map-service'
import type { ServiceConfig, ServiceRenderConfig } from '@/services/service-config'
import type { GeoData, MapRenderer, ServiceDataRow } from '@/types/service.types'
import { renderChoropleth } from '@/rendering/render-choropleth'
import { defaultFeatureKey, defaultNumberNormalizer, interpolateTitle } from '@/services/service-config'

/**
 * Creates a generic renderer function from service configuration
 */
export function createServiceRenderer(config: ServiceConfig): MapRenderer {
  return (geoData: GeoData, service: MapService) => {
    const renderConfig = config.rendering

    // Get current selections
    const facilityLabel = service.getSelectedEntryLabel('facility') || '-'
    const metricKey = service.getSelectedEntry('metric') || ''
    const metricConfig = renderConfig.colorSchemes[metricKey]

    if (!metricConfig) {
      throw new Error(`No color scheme configured for metric: ${metricKey}`)
    }

    const selectedSchemeKey = service.getSelectedEntry('colorScheme')
    const resolvedScheme = !selectedSchemeKey || selectedSchemeKey === 'auto'
      ? metricConfig.scheme
      : selectedSchemeKey

    // Generate title
    const titleTemplate = renderConfig.titleTemplates[metricKey]
    if (!titleTemplate) {
      throw new Error(`No title template configured for metric: ${metricKey}`)
    }

    const plotTitle = interpolateTitle(titleTemplate, facilityLabel, metricKey, metricConfig.label)

    // Get processed data
    const tabularData = service.filteredData

    // Create value accessor
    const valueAccessor = renderConfig.valueProcessor
      ? (row: ServiceDataRow) => renderConfig.valueProcessor!(row, metricKey)
      : (row: ServiceDataRow) => row[metricKey]

    // Create row key accessor
    const rowKeyAccessor = (row: ServiceDataRow) => {
      const keyValue = row[renderConfig.dataKeys.rowKey]
      return String(keyValue).toUpperCase().padStart(2, '0')
    }

    // Create feature key accessor
    const featureKeyAccessor = renderConfig.dataKeys.featureKey === 'default'
      ? defaultFeatureKey
      : (f: any) => {
          const keyValue = f.properties?.[renderConfig.dataKeys.featureKey]
          return String(keyValue).toUpperCase().padStart(2, '0')
        }

    // Create number normalizer
    const numberNormalizer = renderConfig.numberNormalizer || defaultNumberNormalizer

    // Create color scale config
    const colorScale = {
      legend: metricConfig.legend ?? true,
      type: metricConfig.type || 'quantize',
      scheme: resolvedScheme,
      percent: metricConfig.percent,
      label: metricConfig.label,
      ...(metricConfig.domain && Array.isArray(metricConfig.domain) && metricConfig.domain.length === 2
        ? { domain: metricConfig.domain as [number, number] }
        : {}),
    }

    // Create tooltip builder
    const titleBuilder = createTooltipBuilder(
      renderConfig.tooltip,
      facilityLabel,
      metricKey,
      metricConfig,
      numberNormalizer,
      renderConfig.colorSchemes,
    )

    return renderChoropleth({
      plotTitle,
      tabularData,
      featureCollection: geoData.featureCollection,
      featureKey: featureKeyAccessor,
      rowKey: rowKeyAccessor,
      valueAccessor,
      numberNormalizer,
      colorScale,
      backgroundGeometry: geoData.backgroundGeometry,
      overlayMeshes: geoData.overlayMeshes,
      outlineGeometry: geoData.outlineGeometry,
      titleBuilder,
    })
  }
}

/**
 * Creates a tooltip builder function from configuration
 */
function createTooltipBuilder(
  tooltipConfig: ServiceRenderConfig['tooltip'],
  facilityLabel: string,
  currentMetric: string,
  currentMetricConfig: any,
  numberNormalizer: (value: any) => number | null,
  allMetricConfigs: Record<string, any>,
) {
  return (feature: any, value: number | null, row?: ServiceDataRow) => {
    const name = feature.properties?.NOM ?? feature.properties?.nom ?? row?.DEP ?? '—'

    if (tooltipConfig.template === 'dual-metric') {
      // Special handling for dual-metric tooltips (like couverture)
      const vMain = value == null ? '—' : formatValue(value, currentMetricConfig)

      if (tooltipConfig.includeSecondaryMetric && row) {
        const otherMetricKeys = Object.keys(allMetricConfigs).filter(k => k !== currentMetric)
        const otherMetric = otherMetricKeys[0]

        if (otherMetric && allMetricConfigs[otherMetric]) {
          const otherConfig = allMetricConfigs[otherMetric]
          const vOther = row[otherMetric] != null
            ? formatValue(numberNormalizer(row[otherMetric]) ?? 0, otherConfig)
            : '—'

          return `${name}\n${facilityLabel}\n${currentMetricConfig.label}: ${vMain}\n${otherConfig.label}: ${vOther}`
        }
      }

      return `${name}\n${facilityLabel}\n${currentMetricConfig.label}: ${vMain}`
    }

    // Default single-metric tooltip
    const formattedValue = value == null ? '—' : formatValue(value, currentMetricConfig)
    return `${name}\n${currentMetricConfig.label}: ${formattedValue}`
  }
}

/**
 * Formats a value according to metric configuration
 */
function formatValue(value: number, metricConfig: any): string {
  if (metricConfig.percent) {
    return `${(value * 100).toFixed(1)} %`
  }

  // Check if it looks like duration in minutes
  if (metricConfig.label.toLowerCase().includes('min') || metricConfig.label.toLowerCase().includes('durée')) {
    return `${value.toFixed(1)} min`
  }

  return value.toFixed(1)
}
