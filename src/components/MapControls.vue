<script setup lang="ts">
import { storeToRefs } from 'pinia'
import SelectInput from '@/components/SelectInput.vue'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
const { currentService } = storeToRefs(mapStore)
</script>

<template>
  <div class="card bg-base-100 border border-base-300 rounded-lg">
    <div class="card-body">
      <div>
        <label
          class="fieldset-legend text-sm"
          for="#map-service-select"
        >
          Sélectionner une carte
        </label>
        <select
          id="map-service-select"
          class="select select-bordered cursor-pointer"
          :value="mapStore.currentMapId"
          @change="(e) => mapStore.setCurrentMap((e.target as HTMLSelectElement).value)"
        >
          <option
            v-for="entry in mapStore.availableMaps"
            :key="entry.id"
            :value="entry.id"
          >
            {{ entry.title }}
          </option>
        </select>
      </div>

      <!-- Dynamic Controls -->
      <fieldset
        v-if="currentService"
        class="fieldset bg-base-100 border-base-300 rounded-box w-xs border p-4"
      >
        <legend class="fieldset-legend text-sm">
          Indicateurs
        </legend>
        <div
          v-for="control in mapStore.formControls"
          :key="control.key"
          class="fieldset"
        >
          <SelectInput
            :label="control.name"
            :entries="control.entries"
            :model-value="mapStore.getSelectedEntry(control.key)"
            @update:model-value="(value: any) => value && mapStore.setSelectedEntry(control.key, value)"
          />
        </div>
      </fieldset>
    </div>
  </div>
</template>
