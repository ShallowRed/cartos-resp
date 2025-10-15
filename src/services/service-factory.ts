import type { ServiceConfig } from '@/services/base/service-config'
import type { MapRenderer } from '@/types/service.types'
import { createServiceRenderer } from '@/rendering/generic-renderer'
import MapService from '@/services/base/map-service'

/**
 * Service factory for creating MapService instances and renderers
 */
export class ServiceFactory {
  /**
   * Create a MapService instance from a ServiceConfig
   */
  static createService(config: ServiceConfig): MapService {
    return new MapService({
      title: config.title,
      dataFile: config.dataFile,
      formControls: config.formControls,
    })
  }

  /**
   * Create a renderer function from a ServiceConfig
   */
  static createRenderer(config: ServiceConfig): MapRenderer {
    return createServiceRenderer(config)
  }

  /**
   * Create both service and renderer from a ServiceConfig
   */
  static create(config: ServiceConfig): { service: MapService; renderer: MapRenderer } {
    return {
      service: this.createService(config),
      renderer: this.createRenderer(config),
    }
  }
}
