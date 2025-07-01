<template>
  <div class="header-container">
    <!-- Add hamburger button for mobile -->
    <button v-if="isMobile" class="drawer-toggle" @click="toggleDrawer">
      <span class="hamburger"></span>
      <span class="hamburger"></span>
      <span class="hamburger"></span>
    </button>
    <div class="logo" :class="{ 'centered-logo': sidebarOpen }">My Dashboard</div>
    <div class="header-right">
      <div class="header-actions" @click="toggleUserMenu">
        User
        <div v-if="showUserMenu" class="user-menu">
          <div class="user-info">
            <div><strong>Name:</strong> {{ user.username }}</div>
            <div><strong>Email:</strong> {{ user.email }}</div>
          </div>
          <Button class="logout-btn" variant="danger" size="medium" @click.stop="handleLogout">Logout</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue'
import Button from '@/components/Button.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-drawer'])

const isMobile = ref(window.innerWidth <= 900)

function handleResize() {
  isMobile.value = window.innerWidth <= 900
}

function toggleDrawer() {
  console.log('toggleDrawer')
  emit('toggle-drawer')
}

// User menu logic
const showUserMenu = ref(false)
function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}
function closeUserMenu() {
  showUserMenu.value = false
}
function handleClickOutside(event) {
  if (!event.target.closest('.user-menu') && !event.target.closest('.header-actions')) {
    closeUserMenu()
  }
}

const router = useRouter()
function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const user = ref({ username: '', email: '' })

onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('mousedown', handleClickOutside)
  // Load user info from localStorage
  try {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      user.value.username = parsed.username || ''
      user.value.email = parsed.email || ''
    }
  } catch (e) {}
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 64px;
}
.drawer-toggle {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 1rem;
}
.hamburger {
  width: 28px;
  height: 3px;
  background: #009595;
  border-radius: 2px;
  display: block;
}
.logo {
  font-size: 1.25rem;
  font-weight: bold;
  color: #009595;
  text-align: left;
  transition: all 0.2s;
  flex: 0 0 auto;
}
.centered-logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}
.header-actions {
  font-size: 1rem;
  color: #333;
  position: relative;
  cursor: pointer;
}
.user-menu {
  position: absolute;
  right: 0;
  top: 120%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  min-width: 180px;
  z-index: 100;
  padding: 16px 20px;
  color: #222;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.user-info {
  font-size: 0.98rem;
  margin-bottom: 8px;
}
.logout-btn {
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 0;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.15s;
}
.logout-btn:hover {
  background: #b91c1c;
}
@media (min-width: 901px) {
  .drawer-toggle {
    display: none !important;
  }
}
</style> 