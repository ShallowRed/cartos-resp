<script setup lang="ts">
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()

function getTabIcon(mapId: string) {
  switch (mapId) {
    case 'couverture':
      return 'ri-map-2-line'
    case 'duree':
      return 'ri-timer-flash-line'
    case 'eloignement':
      return 'ri-road-map-line'
    case 'evolution':
      return 'ri-increase-decrease-line'
    default:
      return 'ri-map-pin-line'
  }
}
</script>

<template>
  <div class="tabs tabs-box grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
    <label
      v-for="entry in mapStore.availableMaps"
      :key="entry.id"
      class="tab font-semibold flex justify-center gap-2 cursor-pointer"
    >
      <i :class="`${getTabIcon(entry.id)} text-base`" />
      <input
        :id="`map-tab-${entry.id}`"
        type="radio"
        :name="`map-tab-${entry.id}`"
        :aria-label="entry.title"
        :checked="mapStore.currentMapId === entry.id"
        @change="mapStore.setCurrentMap(entry.id)"
      >
      {{ entry.title }}
    </label>
  </div>
</template>
