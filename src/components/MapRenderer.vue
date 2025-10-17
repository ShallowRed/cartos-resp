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

.map-container {
  background: var(--custom-bg);
}

.map-container:deep(figure) {
  display: flex;
  flex-direction: column;
}

.map-container:deep(figure h2) {
  @apply ml-18 text-lg font-semibold mb-4;

  width: 48rem;
  height: 4rem;
  display: flex;
  align-items: end;
}

.map-container:deep(h2+svg) {
  @apply ml-18;
}
</style>
