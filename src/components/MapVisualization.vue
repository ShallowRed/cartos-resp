<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import MapControls from '@/components/MapControls.vue'
import MapPickerTabs from '@/components/MapPickerTabs.vue'
import MapRenderer from '@/components/MapRenderer.vue'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
const { currentService, currentRenderer, geoData } = storeToRefs(mapStore)

const mapPlot = ref<any>(null)

watch([
  currentService,
  currentRenderer,
  geoData,
], () => {
  if (!currentService.value || !currentRenderer.value || !geoData.value) {
    return null
  }
  mapPlot.value = currentRenderer.value(geoData.value, currentService.value)
}, { immediate: true, deep: true })
</script>

<template>
  <div class="flex-1 flex flex-col  bg-base-100 shadow-md border rounded-md border-base-300 p-6 gap-6">
    <MapPickerTabs />
    <!-- Map Renderer -->
    <div
      v-if="currentService"
      class="flex-1 flex flex-col-reverse md:flex-row gap-0"
    >
      <MapRenderer
        v-if="mapPlot"
        class="map-renderer flex-1 flex justify-center items-end min-h-[300px]"
        :map-plot="mapPlot"
      />
      <div class="divider md:divider-horizontal" />
      <MapControls class="md:w-1/4" />
    </div>
  </div>
</template>

<style scoped>
.map-renderer:deep(figure) {
  display: flex;
  flex-direction: column;
}
.map-renderer:deep(figure h2) {
  width: 48rem;
  height: 4rem;
  display: flex;
  align-items: end;
}
</style>
