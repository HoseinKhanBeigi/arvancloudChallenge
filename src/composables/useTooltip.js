import { ref } from 'vue'

export function useTooltip() {
  const tooltip = ref({
    show: false,
    text: '',
    x: 0,
    y: 0
  })

  function showTooltip(event, text) {
    tooltip.value.show = true
    tooltip.value.text = text
    tooltip.value.x = event.clientX
    tooltip.value.y = event.clientY
  }

  function hideTooltip() {
    tooltip.value.show = false
  }

  return {
    tooltip,
    showTooltip,
    hideTooltip
  }
} 