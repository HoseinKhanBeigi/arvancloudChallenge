<template>
  <div>
    <!-- Overlay -->
    <div v-if="drawerOpen" class="drawer-overlay" @click="$emit('close-drawer')"></div>
    <!-- Drawer Sidebar -->
    <nav :class="['sidebar-drawer', { open: drawerOpen }]">
      <button class="drawer-close" @click="$emit('close-drawer')">&times;</button>
      <ul>
        <li>
          <router-link to="/articles" active-class="active" exact @click="$emit('close-drawer')">Articles</router-link>
        </li>
        <li>
          <router-link to="/articles/create" active-class="active" exact @click="$emit('close-drawer')">New Article</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  drawerOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close-drawer'])

// Close drawer on ESC key
function handleKeydown(e) {
  if (e.key === 'Escape' && props.drawerOpen) {
    emit('close-drawer')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.sidebar-drawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 260px;
  background: #fff;
  box-shadow: 2px 0 16px rgba(0,0,0,0.08);
  z-index: 1200;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.sidebar-drawer.open {
  transform: translateX(0);
}
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.18);
  z-index: 1100;
}
.drawer-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #009595;
  align-self: flex-end;
  margin-bottom: 1rem;
  cursor: pointer;
  line-height: 1;
}
.sidebar-drawer ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-drawer li {
  margin-bottom: 1rem;
}
.sidebar-drawer a {
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  display: block;
  transition: background 0.2s;
}
.sidebar-drawer a.active,
.sidebar-drawer a.router-link-exact-active {
  background: #e6f7fa;
  color: #009595;
}
@media (min-width: 901px) {
  .drawer-overlay {
    display: none !important;
  }
  .sidebar-drawer {
    position: static;
    transform: none !important;
    height: auto;
    width: 220px;
    min-height: 100vh;
    box-shadow: none;
    z-index: 1;
    padding: 2rem 1.5rem 1.5rem 1.5rem;
  }
  .drawer-close {
    display: none;
  }
}
</style> 