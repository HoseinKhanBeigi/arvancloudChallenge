<template>
  <label class="checkbox-container" :class="{ 'checkbox-disabled': disabled }">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
      class="checkbox-input"
    />
    <div 
      class="checkbox-custom"
      :class="[
        `checkbox-${variant}`,
        {
          'checkbox-checked': modelValue,
          'checkbox-disabled': disabled,
          'checkbox-indeterminate': indeterminate
        }
      ]"
    >
      <!-- Checkmark icon -->
      <svg 
        v-if="modelValue && !indeterminate" 
        class="checkbox-icon"
        width="10" 
        height="8" 
        viewBox="0 0 10 8" 
        fill="none"
      >
        <path 
          fill-rule="evenodd" 
          clip-rule="evenodd" 
          d="M9.818 1.6818C9.994 1.8575 9.994 2.1424 9.818 2.3182L3.6305 8.5057C3.4548 8.6814 3.1698 8.6814 2.9941 8.5057L0.1816 5.6932C0.0059 5.5174 0.0059 5.2325 0.1816 5.0568C0.3573 4.8811 0.6423 4.8811 0.818 5.0568L3.3123 7.5511L9.1816 1.6818C9.3573 1.5061 9.6423 1.5061 9.818 1.6818Z" 
          fill="currentColor"
        />
      </svg>
      
      <!-- Indeterminate icon (minus sign) -->
      <svg 
        v-if="indeterminate" 
        class="checkbox-icon"
        width="10" 
        height="2" 
        viewBox="0 0 10 2" 
        fill="none"
      >
        <path 
          fill-rule="evenodd" 
          clip-rule="evenodd" 
          d="M1.4 0C1.4 -0.2485 1.615 -0.45 1.88 -0.45H8.12C8.385 -0.45 8.6 -0.2485 8.6 0C8.6 0.2485 8.385 0.45 8.12 0.45H1.88C1.615 0.45 1.4 0.2485 1.4 0Z" 
          fill="currentColor"
        />
      </svg>
    </div>
    <span v-if="$slots.default" class="checkbox-label">
      <slot />
    </span>
  </label>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'dark', 'light'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleChange = (event) => {
  if (!props.disabled) {
    emit('update:modelValue', event.target.checked)
    emit('change', event.target.checked)
  }
}
</script>

<style scoped>
.checkbox-container {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: #333333;
  transition: all 0.2s ease;
}

.checkbox-container:hover:not(.checkbox-disabled) .checkbox-custom {
  transform: scale(1.05);
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
}

.checkbox-custom {
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid transparent;
  background-color: white;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-icon {
  width: 10px;
  height: 8px;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* Primary variant (teal) */
.checkbox-primary.checkbox-checked {
  background-color: #009595;
  border-color: #009595;
}

.checkbox-primary.checkbox-checked .checkbox-icon {
  opacity: 1;
}

/* Secondary variant (darker teal) */
.checkbox-secondary.checkbox-checked {
  background-color: #007070;
  border-color: #007070;
}

.checkbox-secondary.checkbox-checked .checkbox-icon {
  opacity: 1;
}

/* Dark variant (darkest teal) */
.checkbox-dark.checkbox-checked {
  background-color: #004A4A;
  border-color: #004A4A;
}

.checkbox-dark.checkbox-checked .checkbox-icon {
  opacity: 1;
}

/* Light variant (light teal) */
.checkbox-light.checkbox-checked {
  background-color: #99E3E3;
  border-color: #99E3E3;
}

.checkbox-light.checkbox-checked .checkbox-icon {
  opacity: 1;
}

/* Unchecked states with borders */
.checkbox-primary:not(.checkbox-checked) {
  border-color: #7F7F7F;
}

.checkbox-secondary:not(.checkbox-checked) {
  border-color: #666666;
  background-color: #F0F0F0;
}

.checkbox-dark:not(.checkbox-checked) {
  border-color: #4C4C4C;
  background-color: #EBEBEB;
}

.checkbox-light:not(.checkbox-checked) {
  border-color: #CCCCCC;
}

/* Indeterminate state */
.checkbox-indeterminate .checkbox-icon {
  opacity: 1;
}

/* Disabled state */
.checkbox-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox-disabled .checkbox-custom {
  background-color: #F5F5F5;
  border-color: #CCCCCC;
  transform: none !important;
}

.checkbox-disabled .checkbox-label {
  color: #999999;
}

/* Label styling */
.checkbox-label {
  margin-left: 8px;
  font-size: 14px;
  line-height: 1.4;
}

/* Focus states for accessibility */
.checkbox-input:focus-visible + .checkbox-custom {
  outline: 2px solid #018FE1;
  outline-offset: 2px;
}

/* Hover effects */
.checkbox-container:not(.checkbox-disabled):hover .checkbox-custom {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Size variations */
.checkbox-container.checkbox-sm .checkbox-custom {
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

.checkbox-container.checkbox-sm .checkbox-icon {
  width: 8px;
  height: 6px;
}

.checkbox-container.checkbox-lg .checkbox-custom {
  width: 20px;
  height: 20px;
  border-radius: 5px;
}

.checkbox-container.checkbox-lg .checkbox-icon {
  width: 12px;
  height: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .checkbox-label {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style> 