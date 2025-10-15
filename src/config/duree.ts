import type { ServiceConfig } from '@/services/service-config'

export const dureeConfig: ServiceConfig = {
  id: 'duree',
  title: 'Durées d\'accès aux équipements ou services publics',
  dataFile: '/data/duree.csv',
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
      ],
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
