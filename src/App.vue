<script setup lang="ts">
import { onMounted } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import MapVisualization from '@/components/MapVisualization.vue'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()

onMounted(async () => {
  await mapStore.initialize()
})
</script>

<template>
  <AppHeader />
  <div class="bg-base-200">
    <main class="min-h-[calc(100vh-6rem)] container mx-auto py-12 flex flex-col">
      <MapVisualization />
    </main>
  </div>
  <AppFooter />
</template>
