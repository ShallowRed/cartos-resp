import type { ServiceConfig } from '@/services/service-config'
import { COLOR_SCHEME_OPTIONS } from '@/config/color-schemes'

export const dureeConfig: ServiceConfig = {
  id: 'duree',
  title: 'Durées d\'accès',
  dataFile: `${import.meta.env.BASE_URL}data/duree.csv`,

  // Preprocessor to expand aggregate DOM code "97" to individual DOM territories
  dataPreprocessor: (rows) => {
    const DOM_CODES = ['971', '972', '973', '974', '976']
    const expandedRows: any[] = []

    for (const row of rows) {
      if (row.dep === '97') {
        // Replicate this row for each DOM territory
        for (const code of DOM_CODES) {
          expandedRows.push({ ...row, dep: code })
        }
      }
      else {
        expandedRows.push(row)
      }
    }

    return expandedRows
  },

  formControls: [
    {
      key: 'metric',
      label: 'Indicateur',
      entries: [
        { label: 'valeur médiane', key: 'mediane' },
        { label: 'valeur moyenne', key: 'moyenne' },
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
        { label: 'Gare de voyageurs d\'intérêt national', key: 'gare_de_voyageurs_d_interet_nat' },
        { label: 'Gare de voyageurs d\'intérêt régional', key: 'gare_de_voyageurs_d_interet_reg' },
        { label: 'Gare de voyageurs d\'intérêt local', key: 'gare_de_voyageurs_d_interet_loc' },
        { label: 'Implantations France Services (IFS)', key: 'implantations_france_services_i' },
        { label: 'Bureau de poste', key: 'bureau_de_poste' },
        { label: 'Agence postale', key: 'agence_postale' },
        { label: 'École maternelle', key: 'ecole_maternelle' },
        { label: 'École primaire', key: 'ecole_primaire' },
        { label: 'École élémentaire', key: 'ecole_elementaire' },
        { label: 'Collège', key: 'college' },
        { label: 'Lycée d\'enseignement général et/ou technologique', key: 'lycee_d_enseignement_general_et' },
        { label: 'Lycée d\'enseignement professionnel', key: 'lycee_d_enseignement_profession' },
        { label: 'Lycée d\'enseignement technique et/ou professionnel agricole', key: 'lycee_d_enseignement_technique_' },
        { label: 'Établissement de santé (court séjour)', key: 'etablissement_sante_court_sejou' },
        { label: 'Établissement de santé (moyen séjour)', key: 'etablissement_sante_moyen_sejou' },
        { label: 'Établissement de santé (long séjour)', key: 'etablissement_sante_long_sejour' },
        { label: 'Urgences', key: 'urgences' },
        { label: 'Maternité', key: 'maternite' },
        { label: 'Dialyse', key: 'dialyse' },
        { label: 'Laboratoire d\'analyses et de biologie médicale', key: 'laboratoire_d_analyses_et_de_bi' },
        { label: 'Ambulance', key: 'ambulance' },
        { label: 'Pharmacie', key: 'pharmacie' },
        { label: 'Cinéma', key: 'cinema' },
        { label: 'Bibliothèque', key: 'bibliotheque' },
        { label: 'Arts du spectacle', key: 'arts_du_spectacle' },
        { label: 'Déchèterie', key: 'decheterie' },
        { label: 'Panier', key: 'panier_dep' },
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
      mediane: 'Durée médiane d\'accès à l\'équipement ou service "{facility}"',
      moyenne: 'Durée moyenne d\'accès à l\'équipement ou service "{facility}"',
    },
    colorSchemes: {
      mediane: {
        scheme: 'oranges',
        label: 'Durée médiane (min)',
      },
      moyenne: {
        scheme: 'reds',
        label: 'Durée moyenne (min)',
      },
    },
    dataKeys: {
      rowKey: 'dep',
      featureKey: 'INSEE_DEP',
    },
    tooltip: {
      template: 'single-metric',
    },
  },
}
