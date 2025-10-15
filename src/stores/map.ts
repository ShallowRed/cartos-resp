import type { MapServiceEntry } from '@/core/map-registry'

import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { loadDepartementsData } from '@/core/geodata-loader'
import { mapRegistry } from '@/core/map-registry'

export const useMapStore = defineStore('map', () => {
  // State
  const currentMapId = ref<string | null>(null)
  const geoData = ref<any>(null)
  const selectedEntries = reactive<Record<string, string>>({})
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

  const entriesMap = computed(() => {
    if (!currentService.value)
      return []
    return Array.from(currentService.value.entries.entries())
  })

  const mapPlot = computed(() => {
    if (!geoData.value || !currentService.value || !currentRenderer.value) {
      return null
    }
    // Include selectedEntries in the reactive dependency to trigger re-computation
    // when entries change
    const _entries = selectedEntries
    // Trigger access to make the computed reactive to selectedEntries changes
    Object.keys(_entries)
    return currentRenderer.value(geoData.value, currentService.value)
  })

  const availableMaps = computed(() => {
    return mapRegistry.getAll().map(entry => ({
      id: entry.id,
      title: entry.service.title,
    }))
  })

  // Actions
  const setCurrentMap = async (mapId: string) => {
    if (currentMapId.value === mapId)
      return

    isLoading.value = true
    error.value = null

    try {
      const mapEntry = mapRegistry.get(mapId)
      if (!mapEntry) {
        throw new Error(`Map service "${mapId}" not found`)
      }

      // Load geo data if not already loaded
      if (!geoData.value) {
        geoData.value = await loadDepartementsData()
      }

      // Load map service data
      await mapEntry.service.loadData()

      // Update current map
      currentMapId.value = mapId

      // Initialize selected entries from service defaults
      Object.keys(selectedEntries).forEach(key => delete selectedEntries[key])
      for (const [entryKey] of mapEntry.service.entries) {
        selectedEntries[entryKey] = mapEntry.service.getSelectedEntry(entryKey) || ''
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Failed to load map:', err)
    }
    finally {
      isLoading.value = false
    }
  }

  const setSelectedEntry = (entryKey: string, selectedValue: string) => {
    if (currentService.value) {
      selectedEntries[entryKey] = selectedValue
      currentService.value.setSelectedEntry(entryKey, selectedValue)
    }
  }

  const initialize = async () => {
    const availableMaps = mapRegistry.getIds()
    if (availableMaps.length > 0 && availableMaps[0]) {
      await setCurrentMap(availableMaps[0])
    }
  }

  return {
    // State
    currentMapId,
    selectedEntries,
    isLoading,
    error,

    // Getters
    currentService,
    entriesMap,
    mapPlot,
    availableMaps,

    // Actions
    setCurrentMap,
    setSelectedEntry,
    initialize,
  }
})
