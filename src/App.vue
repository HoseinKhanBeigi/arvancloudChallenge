<script setup>
// Router will handle the page content
import Notification from '@/components/Notification.vue'
</script>

<template>
  <router-view />
  <Notification />
</template>

<style>
/* Global styles for full-page layout */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  max-width: none;
}

/* Override any conflicting styles from main.css */
body {
  display: block !important;
  place-items: unset !important;
}
</style>
