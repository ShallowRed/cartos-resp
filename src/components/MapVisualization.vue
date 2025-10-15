<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import MapRenderer from '@/components/MapRenderer.vue'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
const { currentService, currentRenderer, geoData, isLoading, error } = storeToRefs(mapStore)

const mapPlot = ref<any>(null)

watch([currentService, currentRenderer, geoData], () => {
  if (!currentService.value || !currentRenderer.value || !geoData.value) {
    return null
  }
  mapPlot.value = currentRenderer.value(geoData.value, currentService.value)
}, { immediate: true, deep: true })

// Watch for service changes (when indicators are updated)
watch(() => currentService.value?.version?.value, () => {
  if (!currentService.value || !currentRenderer.value || !geoData.value) {
    return null
  }
  mapPlot.value = currentRenderer.value(geoData.value, currentService.value)
}, { immediate: false })
</script>

<template>
  <div class="flex-1 flex flex-col gap-4">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex justify-center items-center py-8"
    >
      <span class="loading loading-spinner loading-lg" />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="alert alert-error"
    >
      <span>{{ error }}</span>
    </div>

    <!-- Map Renderer -->
    <template v-else-if="currentService">
      <MapRenderer
        v-if="mapPlot"
        :map-plot="mapPlot"
      />
    </template>
  </div>
</template>
