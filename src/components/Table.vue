<template>
  <div class="table-wrapper">
    <div class="table-header-box">
      <h2>All Posts</h2>
    </div>
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" :style="column.style">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td :colspan="columns.length">
              <slot name="loading">Loading...</slot>
            </td>
          </tr>
          <tr v-else-if="error" class="error-row">
            <td :colspan="columns.length">
              <slot name="error">{{ error }}</slot>
            </td>
          </tr>
          <tr v-else-if="items.length === 0" class="empty-row">
            <td :colspan="columns.length">
              <slot name="empty">No data available</slot>
            </td>
          </tr>
          <tr v-else v-for="(item, index) in items" :key="getItemKey(item, index)">
            <td v-for="column in columns" :key="column.key" :style="column.style">
              <slot :name="column.key" :item="item" :column="column" :index="index">
                {{ item[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true,
    // Each column should have: { key, label, style? }
  },
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: [String, null],
    default: null
  },
  itemKey: {
    type: [String, Function],
    default: null
  }
})

function getItemKey(item, index) {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item)
  }
  if (props.itemKey && item[props.itemKey]) {
    return item[props.itemKey]
  }
  return index
}
</script>

<style scoped>
.table-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  overflow-x: auto;
}

.table-container{
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.table th,
.table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.loading-row td,
.error-row td,
.empty-row td {
  text-align: center;
  padding: 2rem !important;
  color: #666;
}

.error-row td {
  color: #dc2626;
}

.table tr:last-child td {
  border-bottom: none;
}

.table-header-box {
  background: #fff;
  /* border-radius: 10px; */
  /* box-shadow: 0 1px 4px rgba(0,0,0,0.06); */
  border-bottom: 1px solid #dadada;
  padding: 24px 32px 16px 32px;
  margin-bottom: 24px;
  margin-top: 0;
  display: flex;
  align-items: center;
  height: 100px;
}

.table-header-box h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}
</style>