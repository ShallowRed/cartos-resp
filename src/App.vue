<script setup lang="ts">
import { onMounted } from 'vue'
import MapControls from '@/components/MapControls.vue'
import MapVisualization from '@/components/MapVisualization.vue'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()

onMounted(async () => {
  await mapStore.initialize()
})
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
          <MapControls />
        </div>
        <MapVisualization />
      </div>
    </main>
  </div>
</template>
