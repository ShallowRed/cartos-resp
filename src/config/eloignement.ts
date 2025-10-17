import type { ServiceConfig } from '@/services/service-config'
import { COLOR_SCHEME_OPTIONS } from '@/config/color-schemes'

export const eloignementConfig: ServiceConfig = {
  id: 'eloignement',
  title: 'Éloignements des populations',
  dataFile: `${import.meta.env.BASE_URL}data/eloignement.csv`,
  formControls: [
    {
      key: 'metric',
      label: 'Temps d\'accès',
      entries: [
        { label: '5 minutes', key: '5min' },
        { label: '10 minutes', key: '10min' },
        { label: '15 minutes', key: '15min' },
        { label: '20 minutes', key: '20min' },
        { label: '30 minutes', key: '30min' },
        { label: '45 minutes', key: '45min' },
        { label: '60 minutes', key: '60min' },
      ],
    },
    {
      key: 'facility',
      label: 'Service ou équipement',
      entries: [
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
    {
      key: 'colorScheme',
      label: 'Palette de couleurs',
      entries: COLOR_SCHEME_OPTIONS,
    },
  ],
  rendering: {
    titleTemplates: {
      '5min': 'Part de la population à moins de 5min de l\'équipement ou service "{facility}"',
      '10min': 'Part de la population à moins de 10min de l\'équipement ou service "{facility}"',
      '15min': 'Part de la population à moins de 15min de l\'équipement ou service "{facility}"',
      '20min': 'Part de la population à moins de 20min de l\'équipement ou service "{facility}"',
      '30min': 'Part de la population à moins de 30min de l\'équipement ou service "{facility}"',
      '45min': 'Part de la population à moins de 45min de l\'équipement ou service "{facility}"',
      '60min': 'Part de la population à moins de 60min de l\'équipement ou service "{facility}"',
    },
    colorSchemes: {
      '5min': { scheme: 'greens', label: '% population (5min)', percent: true },
      '10min': { scheme: 'greens', label: '% population (10min)', percent: true },
      '15min': { scheme: 'greens', label: '% population (15min)', percent: true },
      '20min': { scheme: 'greens', label: '% population (20min)', percent: true },
      '30min': { scheme: 'greens', label: '% population (30min)', percent: true },
      '45min': { scheme: 'greens', label: '% population (45min)', percent: true },
      '60min': { scheme: 'greens', label: '% population (60min)', percent: true },
    },
    dataKeys: {
      rowKey: 'dep',
      featureKey: 'INSEE_DEP',
    },
    tooltip: {
      template: 'single-metric',
    },
    valueProcessor: (row, metric) => {
      const value = row[metric]
      return value != null ? (+String(value).replace(',', '.')) / 100 : null
    },
  },
}
