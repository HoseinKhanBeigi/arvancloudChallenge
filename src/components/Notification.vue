<template>
  <div class="notification-wrapper">
    <div
      v-for="n in notifications"
      :key="n.id"
      class="notification"
      :class="n.type"
    >
      {{ n.message }}
    </div>
  </div>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification'
const { notifications } = useNotification()
</script>

<style scoped>
.notification-wrapper {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.notification {
  min-width: 220px;
  padding: 12px 20px;
  border-radius: 6px;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  background: #333;
  opacity: 0.95;
  transition: all 0.3s;
}
.notification.success { background: #22c55e; }
.notification.error { background: #dc2626; }
.notification.info { background: #2563eb; }
</style>
 