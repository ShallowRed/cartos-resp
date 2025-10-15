import MapService from '@/core/map-service'
import { renderChoropleth } from '@/core/render-choropleth'
// label: 'Équipement ou service'
// label: 'Durée d\'éloignement'
export const evolutionService = new MapService({
  title: 'Évolution du maillage des équipements ou services publics entre 2019 et 2024',
  dataFile: '/data/merged-evolution.csv',
  entries: {
    //  { label: 'Indicateur', key: 'metric' },
    metric: [
      { label: 'Évolution (%)', key: 'Evolution_pct' },
      { label: 'Évolution (nombre)', key: 'Evolution_nbr' },
    ],
    // { label: 'Équipement ou service', key: 'facility' },
    facility: [
      { label: 'Lycée d’enseignement technique', key: 'lycee_denseignement_technique_' },
      { label: 'Agence postale', key: 'agence_postale' },
      { label: 'Bureau de poste', key: 'bureau_de_poste' },
      { label: 'Police / Gendarmerie', key: 'police_gendarmerie' },
      { label: 'Urgences', key: 'urgences' },
      { label: 'Maternité', key: 'maternite' },
      { label: 'Centre de santé', key: 'centre_de_sante' },
      { label: 'Panier', key: 'panier' },
      { label: 'Aéroport', key: 'aeroport' },
      { label: 'Gares (voyageurs)', key: 'gares' },
    ],
  },
})

export function renderEvolutionMap(geoData: any, service: MapService) {
  const tabularData = service.filteredData
  // const data = evolutionData.filter(d => (
  //   d.GEO_OBJECT === 'DEP'
  //   && d.Source === chosenEvolutionFacility
  // ))
  // const chosenEvolutionFacilityLabel = evolutionFacilities.find(d => d.key === chosenEvolutionFacility)?.label
  const chosenEvolutionFacilityLabel = service.getSelectedEntryLabel('facility') || '-'
  const chosenEvolutionMetric = service.getSelectedEntry('metric') || '-'
  // Helpers
  const toNum = (v: any) => v == null ? null : +String(v).replace(',', '.')
  const depKey = (v: any) => String(v).trim().toUpperCase().padStart(2, '0')

  // Titre
  const evolutionTitle = chosenEvolutionMetric === 'Evolution_pct'
    ? `Évolution en pourcentage de l'équipement ou service « ${chosenEvolutionFacilityLabel} » entre 2019 et 2024`
    : `Évolution en nombre de l'équipement ou service « ${chosenEvolutionFacilityLabel} » entre 2019 et 2024`

  // Définition palette
  const colorScale
    = chosenEvolutionMetric === 'Evolution_pct'
      ? {
          legend: true,
          type: 'diverging',
          scheme: 'PiYG',
          // percent: true,
          // domain: [-20, 0, 20],
          label: 'Variation (%)',
        }
      : {
          legend: true,
          type: 'diverging',
          scheme: 'RdBu',
          // domain: [-5, 0, 5],
          label: 'Variation (nombre)',
        }

  // Rendu (réutilise ton renderChoropleth générique)
  return renderChoropleth({
    tabularData,
    featureCollection: geoData.featureCollection,
    featureKey: f => depKey(f.properties.INSEE_DEP),
    rowKey: r => depKey(r.GEO),
    valueAccessor: r => r[chosenEvolutionMetric],
    numberNormalizer: toNum,
    colorScale,
    backgroundGeometry: geoData.backgroundGeometry,
    overlayMeshes: geoData.overlayMeshes,
    outlineGeometry: geoData.outlineGeometry,
    plotTitle: evolutionTitle,
    titleBuilder: (feat, val, row) => {
      const name = feat.properties?.NOM ?? depKey(feat.properties?.INSEE_DEP)
      const v = toNum(val)
      const label = chosenEvolutionMetric === 'Evolution_pct'
        ? (v == null ? '—' : `${v.toFixed(1)} %`)
        : (v == null ? '—' : `${v > 0 ? '+' : ''}${v}`)
      const base2019 = row?.['2019'] != null ? toNum(row['2019']) : null
      const base2024 = row?.['2024'] != null ? toNum(row['2024']) : null
      const baseTxt = (base2019 != null && base2024 != null) ? `\n2019: ${base2019} → 2024: ${base2024}` : ''
      return `${name}\nÉvolution: ${label}${baseTxt}`
    },
  })
}
