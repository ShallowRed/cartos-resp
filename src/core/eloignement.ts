import MapService from '@/core/map-service'
import { renderChoropleth } from '@/core/render-choropleth'
// label: 'Équipement ou service'
// label: 'Durée d\'éloignement'
export const eloignementService = new MapService({
  title: 'Éloignements des populations aux équipements ou services publics',
  dataFile: '/data/eloignement.csv',
  entries: {
    metric: [
      { label: '5 minutes', key: '5min' },
      { label: '10 minutes', key: '10min' },
      { label: '15 minutes', key: '15min' },
      { label: '20 minutes', key: '20min' },
      { label: '30 minutes', key: '30min' },
      { label: '45 minutes', key: '45min' },
      { label: '60 minutes', key: '60min' },
    ],
    facility: [
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
    ],
  },
})

export function renderEloignementMap(geoData: any, service: MapService) {
  const tabularData = service.filteredData

  const chosenFacilityLabel = service.getSelectedEntryLabel('facility') || '-'
  const chosenEloignementMetric = service.getSelectedEntry('facility') || '-'
  const title = `Part de la population à moins de ${chosenEloignementMetric} de l'équipement ou service « ${chosenFacilityLabel} »`

  return renderChoropleth({
    plotTitle: title,
    tabularData, // colonnes: dep, LIBGEO, 5min..60min
    featureCollection: geoData.featureCollection,
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
    backgroundGeometry: geoData.backgroundGeometry,
    overlayMeshes: geoData.overlayMeshes,
    outlineGeometry: geoData.outlineGeometry,
  })
}
