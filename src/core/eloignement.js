export const title = 'Éloignements des populations aux équipements ou services publics'

export const dataFile = 'merged-eloignement.csv'

export function _chosenEloignementFacility(eloignementFacilities, Inputs) {
  const entries = eloignementFacilities
  const values = entries.map(d => d.key)
  const getLabel = value => entries.find(d => d.key === value)?.label
  return Inputs.select(values, { label: 'Équipement ou service', value: values[0], format: getLabel })
}

export function _chosenEloignementMetric(eloignementData, Inputs) {
  const options = Object.keys(eloignementData[0]).filter(key => key.endsWith('min'))
  return Inputs.select(options, { label: 'Durée d\'éloignement', value: options[1] })
}

export function _eloignementMap(eloignementData, chosenEloignementFacility, eloignementFacilities, chosenEloignementMetric, renderChoropleth, layerRegistry) {
  const data = eloignementData.filter(d => d.Source === chosenEloignementFacility)

  const chosenFacilityLabel = eloignementFacilities.find(d => d.key === chosenEloignementFacility)?.label

  const title = `Part de la population à moins de ${chosenEloignementMetric} de l'équipement ou service « ${chosenFacilityLabel} »`

  return renderChoropleth({
    plotTitle: title,
    tabularData: data, // colonnes: dep, LIBGEO, 5min..60min
    featureCollection: layerRegistry.departements.featureCollection,
    featureKey: f => f.properties.INSEE_DEP,
    rowKey: r => r.dep,
    valueAccessor: r => r[chosenEloignementMetric] != null ? (+String(r[chosenEloignementMetric]).replace(',', '.')) / 100 : null,
    colorScale: {
      legend: true,
      type: 'quantize',
      scheme: 'Greys',
      percent: true,
      label: `% Population < ${chosenEloignementMetric}`,
    },
    backgroundGeometry: layerRegistry.departements.backgroundGeometry,
    overlayMeshes: layerRegistry.departements.overlayMeshes,
    outlineGeometry: layerRegistry.departements.outlineGeometry,
  })
}

export function _eloignementFacilities() {
  return (
    [
      { label: 'Police', key: 'police' },
      { label: 'Gendarmerie', key: 'gendarmerie' },
      { label: 'Réseau de proximité Pôle emploi', key: 'reseau_de_proximite_pole_emploi' },
      { label: 'Aéroport', key: 'aeroport' },
      { label: 'Gare de voyageurs d’intérêt national', key: 'gare_de_voyageurs_d_interet_nat' },
      { label: 'Gare de voyageurs d’intérêt régional', key: 'gare_de_voyageurs_d_interet_reg' },
      { label: 'Gare de voyageurs d’intérêt local', key: 'gare_de_voyageurs_d_interet_loc' },
      { label: 'Implantations France Services (IFS)', key: 'implantations_france_services_i' },
      { label: 'Bureau de poste', key: 'bureau_de_poste' },
      { label: 'Agence postale', key: 'agence_postale' },
      { label: 'École maternelle', key: 'ecole_maternelle' },
      { label: 'École primaire', key: 'ecole_primaire' },
      { label: 'École élémentaire', key: 'ecole_elementaire' },
      { label: 'Collège', key: 'college' },
      { label: 'Lycée d’enseignement général et/ou technologique', key: 'lycee_d_enseignement_general_et' },
      { label: 'Lycée d’enseignement professionnel', key: 'lycee_d_enseignement_profession' },
      { label: 'Lycée d’enseignement technique et/ou professionnel agricole', key: 'lycee_d_enseignement_technique_' },
      { label: 'Établissement de santé (court séjour)', key: 'etablissement_sante_court_sejou' },
      { label: 'Établissement de santé (moyen séjour)', key: 'etablissement_sante_moyen_sejou' },
      { label: 'Établissement de santé (long séjour)', key: 'etablissement_sante_long_sejour' },
      { label: 'Chirurgien-dentiste', key: 'chirurgien_dentiste' },
      { label: 'Infirmier·ère', key: 'infirmier' },
      { label: 'Laboratoire d’analyses et de biologie médicale', key: 'laboratoire_d_analyses_et_de_bi' },
      { label: 'Ambulance', key: 'ambulance' },
      { label: 'Pharmacie', key: 'pharmacie' },
      { label: 'Cinéma', key: 'cinema' },
      { label: 'Bibliothèque', key: 'bibliotheque' },
      { label: 'Arts du spectacle', key: 'arts_du_spectacle' },
      { label: 'Déchèterie', key: 'decheterie' },
      { label: 'Panier (ensemble)', key: 'panier_ensemble' },
    ]
  )
}
