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
    class="flex-1 flex justify-center items-center border border-base-300 rounded-lg bg-neutral-100"
  />
</template>
