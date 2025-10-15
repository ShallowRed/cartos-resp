<script setup lang="ts">
import { onMounted } from 'vue'

import MapRenderer from '@/components/MapRenderer.vue'
import MapSelector from '@/components/MapSelector.vue'
import SelectInput from '@/components/SelectInput.vue'
import { initializeMapServices } from '@/core/map-services'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()

onMounted(async () => {
  // Initialize available map services
  initializeMapServices()

  // Initialize the store with the first available map
  await mapStore.initialize()
})

// Handle map selection changes
function handleMapChange(mapId: string) {
  mapStore.setCurrentMap(mapId)
}

// Handle entry selection changes
function handleEntryChange(entryKey: string, selectedValue: string | undefined) {
  if (selectedValue !== undefined) {
    mapStore.setSelectedEntry(entryKey, selectedValue)
  }
}
</script>

<template>
  <div class="bg-base-200">
    <main class="min-h-[100vh] container mx-auto py-8 flex flex-col">
      <!-- Map Selector -->
      <MapSelector
        :maps="mapStore.availableMaps"
        :selected="mapStore.currentMapId || undefined"
        label="Sélectionner une carte"
        @update:selected="handleMapChange"
      />

      <!-- Loading State -->
      <div
        v-if="mapStore.isLoading"
        class="flex justify-center items-center py-8"
      >
        <span class="loading loading-spinner loading-lg" />
      </div>

      <!-- Error State -->
      <div
        v-else-if="mapStore.error"
        class="alert alert-error"
      >
        <span>{{ mapStore.error }}</span>
      </div>

      <!-- Map Controls -->
      <template v-else-if="mapStore.currentService">
        <fieldset
          v-for="[key, entries] in mapStore.entriesMap"
          :key="key"
          class="fieldset"
        >
          <SelectInput
            v-model:selected="mapStore.selectedEntries[key]"
            :label="key"
            :entries="entries"
            @update:selected="(value: string | undefined) => handleEntryChange(key, value)"
          />
        </fieldset>

        <!-- Map Renderer -->
        <MapRenderer
          v-if="mapStore.mapPlot"
          :map-plot="mapStore.mapPlot"
        />
      </template>
    </main>
  </div>
</template>
