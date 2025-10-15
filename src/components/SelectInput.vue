<script lang="ts" setup>
defineProps<{
  label: string
  entries: { label: string, key: string }[]
}>()

const id = `select-input-${Math.random().toString(36).substring(2, 15)}`

const selected = defineModel<string>()
</script>

<template>
  <div>
    <label
      class="label"
      :for="`#${id}`"
    >
      {{ label }}
    </label>
    <select
      :id="id"
      v-model="selected"
      class="select select-bordered cursor-pointer"
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
