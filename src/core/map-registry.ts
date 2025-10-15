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
  private listeners: (() => void)[] = []

  register(id: string, service: MapService, renderer: MapRenderer) {
    this.services.set(id, { id, service, renderer })
    // Notify listeners of changes
    this.listeners.forEach(listener => listener())
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

  // Subscribe to registry changes
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

export const mapRegistry = new MapRegistry()
