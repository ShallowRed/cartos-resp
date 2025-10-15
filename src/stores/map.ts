import type { MapServiceEntry } from '@/services/base/map-registry'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { loadDepartementsData } from '@/data/geodata-loader'
import { ErrorHandler, ServiceInitializationError } from '@/lib/errors'
import { MapRegistry } from '@/services/base/map-registry'
import { couvertureService, renderCouvertureMap } from '@/services/couverture'
import { dureeService, renderDureeMap } from '@/services/duree'
import { eloignementService, renderEloignementMap } from '@/services/eloignement'
import { evolutionService, renderEvolutionMap } from '@/services/evolution'

export const useMapStore = defineStore('map', () => {
  const mapRegistry = new MapRegistry()
  mapRegistry.register('couverture', couvertureService, renderCouvertureMap)
  mapRegistry.register('duree', dureeService, renderDureeMap)
  mapRegistry.register('eloignement', eloignementService, renderEloignementMap)
  mapRegistry.register('evolution', evolutionService, renderEvolutionMap)

  // State
  const currentMapId = ref<string | null>(null)
  const geoData = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const currentMapEntry = computed<MapServiceEntry | null>(() => {
    return currentMapId.value ? mapRegistry.get(currentMapId.value) || null : null
  })

  const currentService = computed(() => {
    return currentMapEntry.value?.service || null
  })

  const currentRenderer = computed(() => {
    return currentMapEntry.value?.renderer || null
  })

  const formControls = computed(() => {
    if (!currentService.value)
      return []
    return Array.from(currentService.value.formControls.entries())
  })

  const availableMaps = computed(() => {
    return mapRegistry
      .getAll()
      .map(entry => ({
        id: entry.id,
        title: entry.service.title,
      }))
  })

  // Actions
  const setCurrentMap = async (mapId: string) => {
    if (currentMapId.value === mapId) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const mapEntry = mapRegistry.get(mapId)
      if (!mapEntry) {
        throw new ServiceInitializationError(mapId, undefined, { available: mapRegistry.getIds() })
      }

      // Load geo data if not already loaded
      if (!geoData.value) {
        geoData.value = await loadDepartementsData()
      }

      // Load map service data
      await mapEntry.service.loadData()

      // Update current map
      currentMapId.value = mapId
    }
    catch (err) {
      const atlasError = err instanceof Error ? err : new Error('Unknown error occurred')
      error.value = ErrorHandler.getUserMessage(atlasError)
      ErrorHandler.logError(atlasError instanceof Error
        ? new ServiceInitializationError(mapId, atlasError)
        : new ServiceInitializationError(mapId),
      )
    }
    finally {
      isLoading.value = false
    }
  }

  const setSelectedEntry = (entryKey: string, selectedKey: string) => {
    if (!currentService.value) {
      return
    }
    currentService.value.setSelectedEntry(entryKey, selectedKey)
  }

  const getSelectedEntry = (entryKey: string) => {
    if (!currentService.value)
      return ''
    return currentService.value.getSelectedEntry(entryKey) || ''
  }

  const initialize = async () => {
    const availableMapIds = mapRegistry.getIds()
    if (availableMapIds.length > 0 && availableMapIds[0]) {
      await setCurrentMap(availableMapIds[0])
    }
  }

  return {
    geoData,
    // State
    currentMapId,
    isLoading,
    error,

    // Getters
    currentService,
    currentRenderer,
    formControls,
    availableMaps,

    // Actions
    setCurrentMap,
    setSelectedEntry,
    getSelectedEntry,
    initialize,
  }
})
