<template>
  <div class="dashboard-layout">
    <header class="dashboard-header">
      <slot name="header" />
    </header>
    <div class="dashboard-main">
      <aside class="dashboard-sidebar">
        <slot name="sidebar" />
      </aside>
      <main class="dashboard-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
// No script needed for layout shell
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: #f7f8fa;
}

.dashboard-header {
  height: 64px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  align-items: center;
  padding: 0 32px;
  z-index: 10;
}

.dashboard-main {
  display: flex;
  flex: 1;
  min-height: 0;
}

.dashboard-sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  padding: 24px 0;
  min-width: 180px;
  max-width: 260px;
  box-sizing: border-box;
  overflow-y: auto;
}

.dashboard-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  min-width: 0;
}

@media (max-width: 900px) {
  .dashboard-sidebar {
    width: 60px;
    min-width: 60px;
    padding: 12px 0;
  }
  .dashboard-content {
    padding: 16px;
  }
}
</style> 