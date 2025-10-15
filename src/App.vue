<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import MapRenderer from '@/components/MapRenderer.vue'
import SelectInput from '@/components/SelectInput.vue'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
const { currentService, currentRenderer, geoData, selectedEntries } = storeToRefs(mapStore)

onMounted(async () => {
  await mapStore.initialize()
})

const mapPlot = ref<any>(null)
watch([currentService, currentRenderer, geoData, selectedEntries], () => {
  if (!currentService.value || !currentRenderer.value || !geoData.value) {
    return null
  }
  mapPlot.value = currentRenderer.value(geoData.value, currentService.value)
}, { immediate: true, deep: true })
</script>

<template>
  <div class="bg-base-200">
    <main class="min-h-[100vh] container mx-auto py-12 flex flex-col">
      <div class="flex-1 flex flex-col md:flex-row gap-12">
        <div class="md:w-1/4 flex flex-col gap-12">
          <div class="card bg-base-100 border border-base-300 rounded-lg">
            <div class="card-body">
              <h1 class="text-2xl font-bold mb-2">
                Cartos Resp
              </h1>
              <p class="text-sm">
                Visualisation des indicateurs de l&apos;accessibilité des services publics en France métropolitaine.
              </p>
              <p class="text-xs mt-2">
                Données issues de la <a
                  class="link link-primary"
                  href="https://www.cquest.org/cquest2024/"
                  target="_blank"
                  rel="noopener noreferrer"
                >CQuest 2024</a>.
              </p>
            </div>
          </div>
          <!-- Map Selector -->
          <!-- <MapSelector
            :maps="mapStore.availableMaps"
            :selected="mapStore.currentMapId || undefined"
            label="Sélectionner une carte"
            @update:selected="mapStore.setCurrentMap"
          /> -->
          <div class="card bg-base-100 border border-base-300 rounded-lg">
            <div class="card-body">
              <div>
                <label
                  class="fieldset-legend text-sm"
                  for="#map-service-select"
                >
                  Sélectionner une carte
                </label>
                <select
                  id="map-service-select"
                  class="select select-bordered cursor-pointer"
                  :value="mapStore.currentMapId"
                  @change="(e) => mapStore.setCurrentMap((e.target as HTMLSelectElement).value)"
                >
                  <option
                    v-for="entry in mapStore.availableMaps"
                    :key="entry.id"
                    :value="entry.id"
                  >
                    {{ entry.title }}
                  </option>
                </select>
              </div>
              <!-- Dynamic Controls -->
              <fieldset
                v-if="mapStore.currentService"
                class="fieldset bg-base-100 border-base-300 rounded-box w-xs border p-4"
              >
                <legend class="fieldset-legend text-sm">
                  Indicateurs
                </legend>
                <div
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
                </div>
              </fieldset>
            </div>
          </div>
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
