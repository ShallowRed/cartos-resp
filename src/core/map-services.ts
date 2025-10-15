import { couvertureService, renderCouvertureMap } from '@/core/couverture'
import { dureeService, renderDureeMap } from '@/core/duree'
import { mapRegistry } from '@/core/map-registry'

// Register all available map services
export function initializeMapServices() {
  mapRegistry.register('couverture', couvertureService, renderCouvertureMap)
  mapRegistry.register('duree', dureeService, renderDureeMap)
}
