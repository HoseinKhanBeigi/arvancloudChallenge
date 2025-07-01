<template>
  <div class="modal-backdrop" @click.self="onCancel">
    <div class="modal-content">
      <div class="modal-header">
        <slot name="header"></slot>
      </div>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
      <div class="modal-footer">
        <Button
          class="delete-btn"
          variant="danger"
          size="medium"
          @click="onDelete"
          :loading="props.deleteLoading"
          :disabled="props.deleteLoading"
        >Delete</Button>
        <Button
          class="cancel-btn"
          variant="secondary"
          size="medium"
          @click="onCancel"
        >Cancel</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from './Button.vue'
const props = defineProps({
  deleteLoading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['delete', 'cancel'])

function onDelete() {
  emit('delete')
}
function onCancel() {
  emit('cancel')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.modal-content {
  width: 456px;
  height: 260px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-header {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  font-size: 1.15rem;
  font-weight: 600;
  border-bottom: 1px solid #eee;
}
.modal-body {
  height: 132px;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #333;
}
.modal-footer {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 0 32px;
  border-top: 1px solid #eee;
}
.delete-btn {
  background: #dc2626;
  color: #fff;
  border: none;
}
.cancel-btn {
  background: #f3f4f6;
  color: #333;
  border: none;
}
</style> 