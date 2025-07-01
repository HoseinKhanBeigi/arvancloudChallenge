<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'button',
      `button-${variant}`,
      `button-${size}`,
      {
        'button-disabled': disabled,
        'button-loading': loading,
        'button-icon-only': iconOnly
      }
    ]"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="button-spinner"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-dasharray="25.13"
        stroke-dashoffset="25.13"
        class="spinner-circle"
      />
    </svg>


    <!-- Text or icon slot content -->
    <span v-if="!loading" class="button-text">
      <slot />
    </span>
  </button>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'dark', 'light', 'danger', 'danger-secondary', 'danger-light'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: [String, Object, Function],
    default: null
  },
  iconRight: {
    type: Boolean,
    default: false
  },
  iconOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const iconSize = computed(() => {
  switch (props.size) {
    case 'small': return 14
    case 'large': return 18
    default: return 16
  }
})

const handleClick = (event) => {
  console.log('Button loading prop:', props.loading)
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
}

/* Button sizes */
.button-small {
  padding: 8px 16px;
  font-size: 14px;
  line-height: 1.4;
  min-height: 32px;
}

.button-medium {
  padding: 12px 24px;
  font-size: 16px;
  line-height: 1.5;
  min-height: 40px;
}

.button-large {
  padding: 16px 32px;
  font-size: 18px;
  line-height: 1.5;
  min-height: 48px;
}

/* Icon only buttons */
.button-icon-only.button-small {
  padding: 8px;
  width: 32px;
  height: 32px;
}

.button-icon-only.button-medium {
  padding: 12px;
  width: 40px;
  height: 40px;
}

.button-icon-only.button-large {
  padding: 16px;
  width: 48px;
  height: 48px;
}

/* Button variants */
.button-primary {
  background-color: #009595;
  color: white;
}

.button-primary:hover:not(.button-disabled) {
  background-color: #007070;
}

.button-secondary {
  background-color: #007070;
  color: white;
}

.button-secondary:hover:not(.button-disabled) {
  background-color: #004A4A;
}

.button-dark {
  background-color: #004A4A;
  color: white;
}

.button-dark:hover:not(.button-disabled) {
  background-color: #002626;
}

.button-light {
  background-color: #99E3E3;
  color: white;
}

.button-light:hover:not(.button-disabled) {
  background-color: #7DD4D4;
}

.button-danger {
  background-color: #D61E20;
  color: white;
}

.button-danger:hover:not(.button-disabled) {
  background-color: #AB181A;
}

.button-danger-secondary {
  background-color: #AB181A;
  color: white;
}

.button-danger-secondary:hover:not(.button-disabled) {
  background-color: #801213;
}

.button-danger-light {
  background-color: #EFA5A6;
  color: white;
}

.button-danger-light:hover:not(.button-disabled) {
  background-color: #E88A8B;
}

/* Disabled state */
.button-disabled {
  background-color: #CCCCCC !important;
  color: #999999 !important;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Loading state */
.button-loading {
  cursor: wait;
}

.button-spinner {
  animation: spin 1s linear infinite;
}

.spinner-circle {
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* Icon styles */
.button-icon {
  flex-shrink: 0;
}

.button-icon-left {
  margin-right: 4px;
}

.button-icon-right {
  margin-left: 4px;
}

/* Text styles */
.button-text {
  display: inline-block;
}

/* Focus styles */
.button:focus-visible {
  outline: 2px solid #018FE1;
  outline-offset: 2px;
}

/* Active state */
.button:active:not(.button-disabled) {
  transform: translateY(1px);
}

.button-plain {
  background: transparent;
  color: inherit;
  box-shadow: none;
}
.button-plain:hover:not(.button-disabled) {
  /* background: rgba(0,0,0,0.04); */
}
</style> 