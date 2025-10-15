import type { ServiceConfig } from '@/services/base/service-config'
import { createServiceRenderer } from '@/rendering/generic-renderer'
import MapService from '@/services/base/map-service'

export const couvertureConfig: ServiceConfig = {
  id: 'couverture',
  title: 'Couverture des équipements et services',
  dataFile: '/data/couverture.csv',
  formControls: {
    metric: [
      { label: '% de la population couverte', key: 'pct_pop' },
      { label: '% des communes équipées', key: 'pct_communes' },
    ],
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
      { label: 'Gare de voyageurs d\'intérêt local', key: 'gare_de_voyageurs_d_interet_local' },
      { label: 'Gare de voyageurs d\'intérêt national', key: 'gare_de_voyageurs_d_interet_national' },
      { label: 'Gare de voyageurs d\'intérêt régional', key: 'gare_de_voyageurs_d_interet_regional' },
      { label: 'Gendarmerie', key: 'gendarmerie' },
      { label: 'Implantation France Services (IFS)', key: 'implantations_france_services_ifs' },
      { label: 'Infirmier·ère', key: 'infirmier' },
      { label: 'Laboratoire d\'analyses et de biologie médicale', key: 'laboratoire_d_analyses_et_de_biologie_medicale' },
      { label: 'Lycée d\'enseignement général et/ou technologique', key: 'lycee_d_enseignement_general_et_ou_technologique' },
      { label: 'Lycée d\'enseignement professionnel', key: 'lycee_d_enseignement_professionnel' },
      { label: 'Lycée d\'enseignement technique et/ou professionnel agricole', key: 'lycee_d_enseignement_technique_et_ou_professionnel_agricole' },
      { label: 'Maternité', key: 'maternite' },
      { label: 'Médecin généraliste', key: 'medecin_generaliste' },
      { label: 'Pharmacie', key: 'pharmacie' },
      { label: 'Police', key: 'police' },
      { label: 'Réseau de proximité Pôle emploi', key: 'reseau_de_proximite_pole_emploi' },
      { label: 'Sage-femme', key: 'sage_femme' },
      { label: 'Urgences', key: 'urgences' },
    ],
  },
  rendering: {
    titleTemplates: {
      pct_communes: 'Part des communes disposant d\'au moins un équipement ou service "{facility}"',
      pct_pop: 'Part de la population couverte par un équipement ou service : "{facility}"',
    },
    colorSchemes: {
      pct_pop: {
        scheme: 'blues',
        label: '% population couverte',
        percent: true,
      },
      pct_communes: {
        scheme: 'purples',
        label: '% communes équipées',
        percent: true,
      },
    },
    dataKeys: {
      rowKey: 'DEP',
      featureKey: 'default',
    },
    tooltip: {
      template: 'dual-metric',
      includeSecondaryMetric: true,
    },
  },
}

export const couvertureService = new MapService({
  title: couvertureConfig.title,
  dataFile: couvertureConfig.dataFile,
  formControls: couvertureConfig.formControls,
})

export const renderCouvertureMap = createServiceRenderer(couvertureConfig)
