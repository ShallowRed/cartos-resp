import MapService from '@/core/map-service'
import { renderChoropleth } from '@/core/render-choropleth'

export const dureeService = new MapService({
  title: 'Durées d\'accès aux équipements ou services publics',
  dataFile: '/data/duree.csv',
  entries: {
    metric: [
      { label: 'valeur médianne', key: 'mediane' },
      { label: 'valeur moyenne', key: 'moyenne' },
    ],
    facility:
      [
        { label: 'Police', key: 'police' },
        { label: 'Gendarmerie', key: 'gendarmerie' },
        { label: 'Réseau de proximité Pôle emploi', key: 'reseau_de_proximite_pole_emploi' },
        { label: 'Aéroport', key: 'aeroport' },
        { label: 'Gare de voyageurs d\'intérêt national', key: 'gare_de_voyageurs_d_interet_national' },
        { label: 'Gare de voyageurs d\'intérêt régional', key: 'gare_de_voyageurs_d_interet_regional' },
        { label: 'Gare de voyageurs d\'intérêt local', key: 'gare_de_voyageurs_d_interet_local' },
        { label: 'Implantations France Services (IFS)', key: 'implantations_france_services_ifs' },
        { label: 'Bureau de poste', key: 'bureau_de_poste' },
        { label: 'Agence postale', key: 'agence_postale' },
        { label: 'École maternelle', key: 'ecole_maternelle' },
        { label: 'École primaire', key: 'ecole_primaire' },
        { label: 'École élémentaire', key: 'ecole_elementaire' },
        { label: 'Collège', key: 'college' },
        { label: 'Lycée d\'enseignement général et/ou technologique', key: 'lycee_d_enseignement_general_et_ou_technologique' },
        { label: 'Lycée d\'enseignement professionnel', key: 'lycee_d_enseignement_professionnel' },
        { label: 'Lycée d\'enseignement technique et/ou professionnel agricole', key: 'lycee_d_enseignement_technique_et_ou_professionnel_agricole' },
        { label: 'Établissement de santé (court séjour)', key: 'etablissement_sante_court_sejour' },
        { label: 'Établissement de santé (moyen séjour)', key: 'etablissement_sante_moyen_sejour' },
        { label: 'Établissement de santé (long séjour)', key: 'etablissement_sante_long_sejour' },
        { label: 'Urgences', key: 'urgences' },
        { label: 'Maternité', key: 'maternite' },
        { label: 'Dialyse', key: 'dialyse' },
        { label: 'Laboratoire d\'analyses et de biologie médicale', key: 'laboratoire_d_analyses_et_de_biologie_medicale' },
        { label: 'Ambulance', key: 'ambulance' },
        { label: 'Pharmacie', key: 'pharmacie' },
        { label: 'Cinéma', key: 'cinema' },
        { label: 'Bibliothèque', key: 'bibliotheque' },
        { label: 'Arts du spectacle', key: 'arts_du_spectacle' },
        { label: 'Déchèterie', key: 'decheterie' },
        { label: 'Panier', key: 'Panier' },
      ],
  },
})

export function renderDureeMap(geoData: any, service: MapService) {
  const tabularData: any[] = service.filteredData

  const chosenDureeLabel = service.getSelectedEntryLabel('facility') || '-'
  const chosenDureeMetric = service.getSelectedEntry('metric') || '-'

  const title = chosenDureeMetric === 'mediane'
    ? `Durée médiane d'accès à l'équipement ou service "${chosenDureeLabel}"`
    : `Durée moyenne d'accès à l'équipement ou service "${chosenDureeLabel}"`

  return renderChoropleth({
    plotTitle: title,
    tabularData,
    featureCollection: geoData.featureCollection,
    featureKey: f => f.properties.INSEE_DEP,
    rowKey: r => r.dep,
    valueAccessor: r => r[chosenDureeMetric],
    numberNormalizer: v => (v == null ? null : +String(v).replace(',', '.')),
    colorScale: {
      legend: true,
      type: 'quantize',
      scheme: chosenDureeMetric === 'moyenne' ? 'reds' : 'oranges',
      // domain: [0, 60],
      label: chosenDureeMetric === 'moyenne' ? 'Durée moyenne (min)' : 'Durée médiane (min)',
    },
    backgroundGeometry: geoData.backgroundGeometry,
    overlayMeshes: geoData.overlayMeshes,
    outlineGeometry: geoData.outlineGeometry,
    titleBuilder: (feat, val, _row) => {
      const name = feat.properties.NOM
      return `${name}\nTemps moyen: ${val == null ? '—' : `${val.toFixed(1)} min`}`
    },
  })
}
