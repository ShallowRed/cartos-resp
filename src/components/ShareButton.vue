<script setup lang="ts">
import { ref } from 'vue'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
const showFeedback = ref(false)
const feedbackMessage = ref('')

async function shareMap() {
  try {
    const shareableUrl = mapStore.getShareableUrl()

    if (!shareableUrl) {
      feedbackMessage.value = 'Impossible de générer le lien de partage'
      showFeedback.value = true
      setTimeout(() => {
        showFeedback.value = false
      }, 3000)
      return
    }

    // Copy to clipboard
    await navigator.clipboard.writeText(shareableUrl)

    feedbackMessage.value = 'Lien copié dans le presse-papier !'
    showFeedback.value = true
    setTimeout(() => {
      showFeedback.value = false
    }, 3000)
  }
  catch (error) {
    console.error('Failed to copy to clipboard:', error)
    feedbackMessage.value = 'Erreur lors de la copie du lien'
    showFeedback.value = true
    setTimeout(() => {
      showFeedback.value = false
    }, 3000)
  }
}
</script>

<template>
  <div class="relative w-full">
    <button
      class="btn w-full btn-primary btn-soft gap-2"
      :disabled="!mapStore.currentMapId"
      @click="shareMap"
    >
      <i class="ri-share-line text-base" />
      Partager la carte à l'écran
    </button>

    <!-- Success/Error feedback toast -->
    <div
      v-if="showFeedback"
      class="toast absolute top-12 left-0 right-0 w-full"
    >
      <div class="alert alert-success alert-soft shadow-lg">
        <i class="ri-check-line text-base" />
        <span>{{ feedbackMessage }}</span>
      </div>
    </div>
  </div>
</template>
