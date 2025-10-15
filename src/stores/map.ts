import type { MapServiceEntry } from '@/core/map-registry'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { couvertureService, renderCouvertureMap } from '@/core/couverture'
import { dureeService, renderDureeMap } from '@/core/duree'
import { eloignementService, renderEloignementMap } from '@/core/eloignement'
import { evolutionService, renderEvolutionMap } from '@/core/evolution'
import { loadDepartementsData } from '@/core/geodata-loader'
import { MapRegistry } from '@/core/map-registry'

export const useMapStore = defineStore('map', () => {
  const mapRegistry = new MapRegistry()
  mapRegistry.register('couverture', couvertureService, renderCouvertureMap)
  mapRegistry.register('duree', dureeService, renderDureeMap)
  mapRegistry.register('eloignement', eloignementService, renderEloignementMap)
  mapRegistry.register('evolution', evolutionService, renderEvolutionMap)

  // State
  const currentMapId = ref<string | null>(null)
  const geoData = ref<any>(null)
  const selectedEntries = ref<Record<string, Record<string, string>>>({
    couverture: {
      facility: 'ambulance',
      metric: 'pct_communes',
    },
    duree: {
      facility: 'gendarmerie',
      metric: 'mediane',
    },
    eloignement: {
      facility: 'bureau_de_poste',
      metric: '15min',
    },
    evolution: {
      facility: 'centre_de_sante',
      metric: 'Evolution_pct',
    },
  })

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
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Failed to load map:', err)
    }
    finally {
      isLoading.value = false
    }
  }

  const setSelectedEntry = (entryKey: string, selectedKey: string) => {
    if (!currentMapId.value || !currentService.value) {
      return
    }
    const entryOptions = currentService.value.entries.get(entryKey)
    if (!entryOptions || !entryOptions.find(e => e.key === selectedKey)) {
      console.warn(`Entry key "${entryKey}" or selected key "${selectedKey}" not found in service "${currentMapId.value}"`)
      return
    }
    // Update the service's selected entry
    currentService.value.setSelectedEntry(entryKey, selectedKey)
    console.log(currentService.value)
    selectedEntries.value[currentMapId.value] ??= {} as Record<string, string>
    (selectedEntries.value[currentMapId.value] as Record<string, string>)[entryKey] = selectedKey
  }

  const getSelectedEntry = (entryKey: string) => {
    if (!currentMapId.value)
      return ''
    const mapEntries = selectedEntries.value[currentMapId.value]
    return mapEntries?.[entryKey] || ''
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
    selectedEntries,
    isLoading,
    error,

    // Getters
    currentService,
    currentRenderer,
    entriesMap,
    availableMaps,

    // Actions
    setCurrentMap,
    setSelectedEntry,
    getSelectedEntry,
    initialize,
  }
})
