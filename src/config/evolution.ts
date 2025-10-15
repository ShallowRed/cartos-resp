import type { ServiceConfig } from '@/services/base/service-config'

export const evolutionConfig: ServiceConfig = {
  id: 'evolution',
  title: 'Évolution du maillage des équipements ou services publics entre 2019 et 2024',
  dataFile: '/data/merged-evolution.csv',
  formControls: [
    {
      key: 'metric',
      label: 'Indicateur',
      entries: [
        { label: 'Évolution (%)', key: 'Evolution_pct' },
        { label: 'Évolution (nombre)', key: 'Evolution_nbr' },
      ],
    },
    {
      key: 'facility',
      label: 'Service ou équipement',
      entries: [
        { label: 'Lycée d\'enseignement technique', key: 'lycee_denseignement_technique_' },
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
  ],
  rendering: {
    titleTemplates: {
      Evolution_pct: 'Évolution en pourcentage de l\'équipement ou service "{facility}" entre 2019 et 2024',
      Evolution_nbr: 'Évolution en nombre de l\'équipement ou service "{facility}" entre 2019 et 2024',
    },
    colorSchemes: {
      Evolution_pct: {
        scheme: 'rdbu',
        label: 'Évolution (%)',
        type: 'diverging',
      },
      Evolution_nbr: {
        scheme: 'rdbu',
        label: 'Évolution (nombre)',
        type: 'diverging',
      },
    },
    dataKeys: {
      rowKey: 'DEP',
      featureKey: 'default',
    },
    tooltip: {
      template: 'single-metric',
    },
  },
}
