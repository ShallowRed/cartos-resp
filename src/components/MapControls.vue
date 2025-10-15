<script setup lang="ts">
import { storeToRefs } from 'pinia'
import SelectInput from '@/components/SelectInput.vue'
import ShareButton from '@/components/ShareButton.vue'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
const { currentService } = storeToRefs(mapStore)
</script>

<template>
  <!-- Dynamic Controls -->
  <fieldset
    v-if="currentService"
    class="fieldset p-4"
  >
    <legend class="fieldset-legend pb-0 text-sm">
      Indicateurs
    </legend>
    <div
      v-for="control in mapStore.formControls"
      :key="control.key"
      class="fieldset"
    >
      <SelectInput
        :label="control.label"
        :entries="control.entries"
        :model-value="mapStore.getSelectedEntry(control.key)"
        @update:model-value="(value: any) => value && mapStore.setSelectedEntry(control.key, value)"
      />
    </div>

    <!-- Share Button -->
    <div class="mt-4 pt-4 border-t border-base-300">
      <ShareButton />
    </div>
  </fieldset>
</template>
