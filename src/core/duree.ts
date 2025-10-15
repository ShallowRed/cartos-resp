import type { ServiceConfig } from './service-config'
import MapService from '@/core/map-service'
import { createServiceRenderer } from './generic-renderer'

export const dureeConfig: ServiceConfig = {
  id: 'duree',
  title: 'Durées d\'accès aux équipements ou services publics',
  dataFile: '/data/duree.csv',
  formControls: {
    metric: [
      { label: 'valeur médiane', key: 'mediane' },
      { label: 'valeur moyenne', key: 'moyenne' },
    ],
    facility: [
      { label: 'Police', key: 'police' },
      { label: 'Gendarmerie', key: 'gendarmerie' },
    ],
  },
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

export const dureeService = new MapService({
  title: dureeConfig.title,
  dataFile: dureeConfig.dataFile,
  formControls: dureeConfig.formControls,
})

export const renderDureeMap = createServiceRenderer(dureeConfig)
