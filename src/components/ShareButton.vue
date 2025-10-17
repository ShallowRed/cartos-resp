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

async function downloadSvg() {
  try {
    // Find the complete figure element that contains title and both SVGs
    const figureElement = document.querySelector('.map-container figure')

    if (!figureElement) {
      feedbackMessage.value = 'Aucune carte à télécharger'
      showFeedback.value = true
      setTimeout(() => {
        showFeedback.value = false
      }, 3000)
      return
    }

    // Get all elements within the figure
    const titleElement = figureElement.querySelector('h2')
    const svgElements = figureElement.querySelectorAll('svg')

    if (svgElements.length === 0) {
      feedbackMessage.value = 'Aucune carte SVG trouvée'
      showFeedback.value = true
      setTimeout(() => {
        showFeedback.value = false
      }, 3000)
      return
    }

    // Get the current service for filename generation
    const currentService = mapStore.currentService
    const serviceTitle = currentService?.title || 'carte'

    // Create a safe filename
    const filename = `${serviceTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`

    // Create a combined SVG that includes title and both legend and map
    const combinedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    combinedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    // Calculate dimensions and layout
    let totalWidth = 0
    let totalHeight = 0
    let currentY = 0

    // Add title as text element if it exists
    if (titleElement && titleElement.textContent?.trim()) {
      const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      titleText.setAttribute('x', '20')
      titleText.setAttribute('y', '30')
      titleText.setAttribute('font-family', 'Arial, sans-serif')
      titleText.setAttribute('font-size', '18')
      titleText.setAttribute('font-weight', 'bold')
      titleText.setAttribute('fill', '#333')
      titleText.textContent = titleElement.textContent.trim()
      combinedSvg.appendChild(titleText)
      currentY = 50
      totalWidth = Math.max(totalWidth, 400) // Minimum width for title
    }

    // Add each SVG as a group
    svgElements.forEach((svg) => {
      const svgClone = svg.cloneNode(true) as SVGElement
      const svgWidth = Number.parseFloat(svgClone.getAttribute('width') || '0')
      const svgHeight = Number.parseFloat(svgClone.getAttribute('height') || '0')

      // Create a group to contain this SVG's content
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      group.setAttribute('transform', `translate(0, ${currentY})`)

      // Copy all child elements from the SVG to the group
      while (svgClone.firstChild) {
        group.appendChild(svgClone.firstChild)
      }

      combinedSvg.appendChild(group)

      // Update dimensions
      totalWidth = Math.max(totalWidth, svgWidth)
      currentY += svgHeight + 20 // Add some spacing between elements
      totalHeight = currentY
    })

    // Set final dimensions
    combinedSvg.setAttribute('width', totalWidth.toString())
    combinedSvg.setAttribute('height', totalHeight.toString())
    combinedSvg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`)

    // Serialize the combined SVG
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(combinedSvg)

    // Add XML declaration
    const svgWithDeclaration = `<?xml version="1.0" encoding="UTF-8"?>
${svgString}`

    // Create and trigger download
    const blob = new Blob([svgWithDeclaration], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = filename
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)

    // Clean up
    URL.revokeObjectURL(url)

    feedbackMessage.value = 'Carte téléchargée avec succès !'
    showFeedback.value = true
    setTimeout(() => {
      showFeedback.value = false
    }, 3000)
  }
  catch (error) {
    console.error('Failed to download SVG:', error)
    feedbackMessage.value = 'Erreur lors du téléchargement'
    showFeedback.value = true
    setTimeout(() => {
      showFeedback.value = false
    }, 3000)
  }
}
</script>

<template>
  <div class="relative w-full">
    <div class="flex flex-col gap-2">
      <button
        class="btn w-full btn-primary btn-soft gap-2"
        :disabled="!mapStore.currentMapId"
        @click="shareMap"
      >
        <i class="ri-share-line text-base" />
        Partager la carte à l'écran
      </button>

      <button
        class="btn w-full btn-secondary btn-soft gap-2"
        :disabled="!mapStore.currentMapId"
        @click="downloadSvg"
      >
        <i class="ri-download-line text-base" />
        Télécharger en SVG
      </button>
    </div>

    <!-- Success/Error feedback toast -->
    <div
      v-if="showFeedback"
      class="toast absolute top-16 left-0 right-0 w-full z-10"
    >
      <div class="alert alert-success alert-soft shadow-lg">
        <i class="ri-check-line text-base" />
        <span>{{ feedbackMessage }}</span>
      </div>
    </div>
  </div>
</template>
