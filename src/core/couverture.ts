import MapService from '@/core/map-service'
import { renderChoropleth } from '@/core/render-choropleth'

export const couvertureService = new MapService({
  title: 'Couverture des équipements et services',
  dataFile: '/data/couverture.csv',
  entries: {
    facility: [
      { label: 'Aéroport', key: 'aeroport' },
      { label: 'Agence postale', key: 'agence_postale' },
      { label: 'Ambulance', key: 'ambulance' },
      { label: 'Arts du spectacle', key: 'arts_du_spectacle' },
      { label: 'Bibliothèque', key: 'bibliotheque' },
      { label: 'Bureau de poste', key: 'bureau_de_poste' },
      { label: 'Chirurgien-dentiste', key: 'chirurgien_dentiste' },
      { label: 'Cinéma', key: 'cinema' },
      { label: 'Collège', key: 'college' },
      { label: 'Déchèterie', key: 'decheterie' },
      { label: 'Dialyse', key: 'dialyse' },
      { label: 'École élémentaire', key: 'ecole_elementaire' },
      { label: 'École maternelle', key: 'ecole_maternelle' },
      { label: 'École primaire', key: 'ecole_primaire' },
      { label: 'Établissement de santé (court séjour)', key: 'etablissement_sante_court_sejour' },
      { label: 'Établissement de santé (long séjour)', key: 'etablissement_sante_long_sejour' },
      { label: 'Établissement de santé (moyen séjour)', key: 'etablissement_sante_moyen_sejour' },
      { label: 'Gare de voyageurs d’intérêt local', key: 'gare_de_voyageurs_d_interet_local' },
      { label: 'Gare de voyageurs d’intérêt national', key: 'gare_de_voyageurs_d_interet_national' },
      { label: 'Gare de voyageurs d’intérêt régional', key: 'gare_de_voyageurs_d_interet_regional' },
      { label: 'Gendarmerie', key: 'gendarmerie' },
      { label: 'Implantation France Services (IFS)', key: 'implantations_france_services_ifs' },
      { label: 'Infirmier·ère', key: 'infirmier' },
      { label: 'Laboratoire d’analyses et de biologie médicale', key: 'laboratoire_d_analyses_et_de_biologie_medicale' },
      { label: 'Lycée d’enseignement général et/ou technologique', key: 'lycee_d_enseignement_general_et_ou_technologique' },
      { label: 'Lycée d’enseignement professionnel', key: 'lycee_d_enseignement_professionnel' },
      { label: 'Lycée d’enseignement technique et/ou professionnel agricole', key: 'lycee_d_enseignement_technique_et_ou_professionnel_agricole' },
      { label: 'Maternité', key: 'maternite' },
      { label: 'Médecin généraliste', key: 'medecin_generaliste' },
      { label: 'Pharmacie', key: 'pharmacie' },
      { label: 'Police', key: 'police' },
      { label: 'Réseau de proximité Pôle emploi', key: 'reseau_de_proximite_pole_emploi' },
      { label: 'Sage-femme', key: 'sage_femme' },
      { label: 'Urgences', key: 'urgences' },
    ],
    metric: [
      { label: '% de la population couverte', key: 'pct_pop' },
      { label: '% des communes équipées', key: 'pct_communes' },
    ],
  },
})

export function renderCouvertureMap(geoData: any, service: MapService) {
  const tabularData: any[] = service.filteredData

  const chosenCouvertureFacility: string = service.getSelectedEntryLabel('facility') || '-'
  const chosenCouvertureMetric: string = service.getSelectedEntry('metric') || '-'

  const title = chosenCouvertureMetric === 'pct_communes'
    ? `Part des communes disposant d'au moins un équipement ou service "${chosenCouvertureFacility}"`
    : `Part de la population couverte par un équipement ou service : "${chosenCouvertureFacility}"`

  const normalizeNumber = (v: any) => {
    return v == null
      ? null
      : +String(v).replace(',', '.')
  }

  const metricPalette = chosenCouvertureMetric === 'pct_pop'
    ? {
        legend: true,
        type: 'quantize',
        scheme: 'blues',
        percent: true,
        label: '% population couverte',
      }
    : {
        legend: true,
        type: 'quantize',
        scheme: 'purples',
        percent: true,
        label: '% communes équipées',
      }

  return renderChoropleth({
    plotTitle: title,
    tabularData,
    featureCollection: geoData.featureCollection,
    featureKey: (f: any) => {
      const p = f.properties || {}
      return String(p.INSEE_DEP ?? p.insee_dep ?? p.code ?? p.DEP).toUpperCase().padStart(2, '0')
    },
    rowKey: (r: any) => String(r.DEP).toUpperCase().padStart(2, '0'),
    valueAccessor: (r: any) => r[chosenCouvertureMetric],
    numberNormalizer: normalizeNumber,
    colorScale: metricPalette,
    backgroundGeometry: geoData.backgroundGeometry,
    overlayMeshes: geoData.overlayMeshes,
    outlineGeometry: geoData.outlineGeometry,

    // tooltip : affiche la métrique choisie + l’autre en info
    titleBuilder: (feature, value, row) => {
      const name = feature.properties?.NOM ?? feature.properties?.nom ?? row?.DEP ?? '—'
      const vMain = value == null ? '—' : `${(value * 100).toFixed(1)} %`
      const otherMetric = chosenCouvertureMetric === 'pct_pop' ? 'pct_communes' : 'pct_pop'
      const vOther = row && row[otherMetric] != null
        ? `${((normalizeNumber(row[otherMetric]) ?? 0) * 100).toFixed(1)} %`
        : '—'
      const mainLabel = chosenCouvertureMetric === 'pct_pop' ? '% pop couverte' : '% communes équipées'
      const otherLabel = chosenCouvertureMetric === 'pct_pop' ? '% communes équipées' : '% pop couverte'
      return `${name}\n${chosenCouvertureFacility}\n${mainLabel}: ${vMain}\n${otherLabel}: ${vOther}`
    },
  })
}
