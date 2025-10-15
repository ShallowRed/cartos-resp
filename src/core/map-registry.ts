import type MapService from '@/core/map-service'

export interface MapRenderer {
  (geoData: any, service: MapService): any
}

export interface MapServiceEntry {
  id: string
  service: MapService
  renderer: MapRenderer
}

class MapRegistry {
  private services = new Map<string, MapServiceEntry>()

  register(id: string, service: MapService, renderer: MapRenderer) {
    this.services.set(id, { id, service, renderer })
  }

  get(id: string): MapServiceEntry | undefined {
    return this.services.get(id)
  }

  getAll(): MapServiceEntry[] {
    return Array.from(this.services.values())
  }

  getIds(): string[] {
    return Array.from(this.services.keys())
  }
}

export const mapRegistry = new MapRegistry()
