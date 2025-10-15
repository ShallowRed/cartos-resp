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
  />
</template>
