<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { onMounted, ref, watch } from 'vue'
import MapRenderer from '@/components/MapRenderer.vue'
import MapSelector from '@/components/MapSelector.vue'
import SelectInput from '@/components/SelectInput.vue'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
const { currentService, currentRenderer, geoData, selectedEntries } = storeToRefs(mapStore)

onMounted(async () => {
  await mapStore.initialize()
})

const mapPlot = ref(null)
watch([currentService, currentRenderer, geoData, selectedEntries], () => {
  if (!currentService.value || !currentRenderer.value || !geoData.value) {
    return null
  }
  mapPlot.value = currentRenderer.value(geoData.value, currentService.value)
}, { immediate: true, deep: true })
</script>

<template>
  <div class="bg-base-200">
    <main class="min-h-[100vh] container mx-auto py-8 flex flex-col">
      <div class="flex-1 flex flex-col md:flex-row gap-8">
        <div class="md:w-1/4 flex flex-col gap-4">
          <!-- Map Selector -->
          <MapSelector
            :maps="mapStore.availableMaps"
            :selected="mapStore.currentMapId || undefined"
            label="Sélectionner une carte"
            @update:selected="mapStore.setCurrentMap"
          />
          <!-- Dynamic Controls -->
          <template v-if="mapStore.currentService">
            <fieldset
              v-for="[key, entries] in mapStore.entriesMap"
              :key="key"
              class="fieldset"
            >
              <SelectInput
                :label="key"
                :entries="entries"
                :model-value="mapStore.getSelectedEntry(key)"
                @update:model-value="(value: any) => value && mapStore.setSelectedEntry(key, value)"
              />
            </fieldset>
          </template>
        </div>
        <div class="flex-1 flex flex-col gap-4">
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

          <!-- Map Renderer -->
          <template v-else-if="mapStore.currentService">
            <MapRenderer
              v-if="mapPlot"
              :map-plot="mapPlot"
            />
          </template>
        </div>
      </div>
    </main>
  </div>
</template>
