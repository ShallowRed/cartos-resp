import type { ServiceConfig } from '@/services/service-config'

export const eloignementConfig: ServiceConfig = {
  id: 'eloignement',
  title: 'Éloignements des populations',
  dataFile: '/data/eloignement.csv',
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
        { label: 'Bureau de poste', key: 'bureau_de_poste' },
      ],
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
