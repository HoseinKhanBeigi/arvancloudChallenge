<template>
  <div class="input-container">
    <template v-if="type === 'textarea'">
      <textarea
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :class="[
          'input-field',
          {
            'input-focused': isFocused && !disabled,
            'input-filled': modelValue && !disabled,
            'input-disabled': disabled,
            'input-error': hasError
          }
        ]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        rows="6"
        :style="minHeight ? { minHeight: typeof minHeight === 'number' ? minHeight + 'px' : minHeight } : {}"
      />
    </template>
    <template v-else>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :class="[
          'input-field',
          {
            'input-focused': isFocused && !disabled,
            'input-filled': modelValue && !disabled,
            'input-disabled': disabled,
            'input-error': hasError
          }
        ]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </template>
    <div v-if="hasError" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: 'Enter text here...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hasError: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: 'This field is required'
  },
  minHeight: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const isFocused = ref(false)

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}
</script>

<style scoped>
.input-container {
  width: 100%;
  position: relative;
  min-height: 55px;
}

.input-field {
  width: 100%;
  height: 39px;
  padding: 0 16px;
  border: 1px solid #CCCCCC;
  border-radius: 7.5px;
  background-color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: #333333;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-field::placeholder {
  color: #CCCCCC;
  font-weight: 400;
}

.input-field.input-focused {
  outline: none;
  border-color: #018FE1;
  box-shadow: 0 0 0 1px #018FE1;
}

.input-field.input-filled {
  border-color: #009595;
  color: #333333;
}

.input-field.input-disabled {
  background-color: #F5F5F5;
  border-color: #CCCCCC;
  color: #CCCCCC;
  cursor: not-allowed;
}

.input-field.input-disabled::placeholder {
  color: #CCCCCC;
}

.input-field.input-error {
  border-color: #FF4444;
  box-shadow: 0 0 0 1px #FF4444;
}

.error-message {
  position: absolute;
  top: 43px;
  left: 0;
  font-size: 12px;
  color: #FF4444;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Hover states */
.input-field:not(.input-disabled):hover {
  border-color: #B3B3B3;
}

.input-field.input-focused:hover {
  border-color: #018FE1;
}

.input-field.input-filled:hover {
  border-color: #009595;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .input-field {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style> 