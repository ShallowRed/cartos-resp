<script setup lang="ts">
interface MapOption {
  id: string
  title: string
}

interface Props {
  maps: MapOption[]
  selected?: string
  label?: string
}

interface Emits {
  (e: 'update:selected', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ label || 'Cartes disponibles' }}
    </legend>
    <div class="form-control">
      <select
        :value="selected"
        class="select select-bordered"
        @change="$emit('update:selected', ($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="map in maps"
          :key="map.id"
          :value="map.id"
        >
          {{ map.title }}
        </option>
      </select>
    </div>
  </fieldset>
</template>
