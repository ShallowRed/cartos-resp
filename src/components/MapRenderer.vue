<script setup lang="ts">
import { ref, toRef, watch } from 'vue'

const props = defineProps<{
  mapPlot: HTMLDivElement
}>()

const mapPlot = toRef(props, 'mapPlot')

const mapContainer = ref<HTMLDivElement | null>(null)

watch([mapPlot, mapContainer], ([plot, container]) => {
  if (plot && container) {
    container.innerHTML = ''
    container.appendChild(plot)
  }
})
</script>

<template>
  <div
    ref="mapContainer"
    class="map-container"
  />
</template>

<style scoped>
@import 'tailwindcss';

.map-container:deep(h2) {
  @apply text-lg font-semibold mb-4;
}
</style>
