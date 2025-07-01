import { ref } from 'vue'

const notifications = ref([])

export function useNotification() {
  function notify({ message, type = 'info', timeout = 3000 }) {
    const id = Date.now() + Math.random()
    notifications.value.push({ id, message, type })
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, timeout)
  }
  return { notifications, notify }
} 