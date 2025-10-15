export const title = 'Évolution du maillage des équipements ou services publics entre 2019 et 2024'

export const dataFile = 'merged-evolution.csv'

export function _chosenEvolutionMetric(Inputs) {
  const entries = [
    { label: 'Évolution (%)', key: 'Evolution_pct' },
    { label: 'Évolution (nombre)', key: 'Evolution_nbr' },
  ]
  const values = entries.map(d => d.key)
  const getLabel = value => entries.find(d => d.key === value)?.label
  return Inputs.radio(values, { label: 'Indicateur', value: values[0], format: getLabel })
}

export function _chosenEvolutionFacility(evolutionFacilities, Inputs) {
  const entries = evolutionFacilities
  const values = entries.map(d => d.key)
  const getLabel = value => entries.find(d => d.key === value)?.label
  return Inputs.select(values, { label: 'Équipement ou service', value: values[0], format: getLabel })
}

export function _eloignementMap(evolutionData, chosenEvolutionFacility, evolutionFacilities, chosenEvolutionMetric, renderChoropleth, layerRegistry) {
  const data = evolutionData.filter(d => (
    d.GEO_OBJECT === 'DEP'
    && d.Source === chosenEvolutionFacility
  ))
  const chosenEvolutionFacilityLabel = evolutionFacilities.find(d => d.key === chosenEvolutionFacility)?.label

  // Helpers
  const toNum = v => v == null ? null : +String(v).replace(',', '.')
  const depKey = v => String(v).trim().toUpperCase().padStart(2, '0')

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
    tabularData: data,
    featureCollection: layerRegistry.departements.featureCollection,
    featureKey: f => depKey(f.properties.INSEE_DEP),
    rowKey: r => depKey(r.GEO),
    valueAccessor: r => r[chosenEvolutionMetric],
    numberNormalizer: toNum,
    colorScale,
    backgroundGeometry: layerRegistry.departements.backgroundGeometry,
    overlayMeshes: layerRegistry.departements.overlayMeshes,
    outlineGeometry: layerRegistry.departements.outlineGeometry,
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

export function _evolutionData(FileAttachment) {
  return (
    FileAttachment('merged-evolution.csv').csv()
  )
}

export function _evolutionFacilities() {
  return (
    [
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
    ]
  )
}
