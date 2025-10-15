<script lang="ts" setup>
defineProps<{
  label: string
  entries: { label: string, key: string }[]
}>()

const selected = defineModel<string>()
</script>

<template>
  <div>
    <legend class="fieldset-legend">
      {{ label }}
    </legend>
    <select
      v-model="selected"
      class="select select-bordered"
    >
      <option
        v-for="entry in entries"
        :key="entry.key"
        :value="entry.key"
      >
        {{ entry.label }}
      </option>
    </select>
  </div>
</template>
