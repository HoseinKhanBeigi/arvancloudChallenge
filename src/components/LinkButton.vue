<template>
  <a
    :href="href"
    :target="target"
    :rel="rel"
    :class="[
      'link-button',
      `link-button-${variant}`,
      `link-button-${size}`,
      {
        'link-button-disabled': disabled,
        'link-button-external': isExternal
      }
    ]"
    @click="handleClick"
  >
    <!-- Icon (left) -->
    <svg
      v-if="icon && !iconOnly"
      class="link-button-icon link-button-icon-left"
      :width="iconSize"
      :height="iconSize"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M10 6L14 10L10 14"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 10H6C4.89543 10 4 9.10457 4 8V6"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- Icon (right) -->
    <svg
      v-if="iconRight && !iconOnly"
      class="link-button-icon link-button-icon-right"
      :width="iconSize"
      :height="iconSize"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M6 10L2 6L6 2"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2 6H10C11.1046 6 12 6.89543 12 8V10"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- External link icon -->
    <svg
      v-if="isExternal && !iconOnly"
      class="link-button-icon link-button-icon-right"
      :width="iconSize"
      :height="iconSize"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M10 6L14 10L10 14"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 10H6C4.89543 10 4 9.10457 4 8V6"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- Icon only -->
    <svg
      v-if="iconOnly"
      class="link-button-icon"
      :width="iconSize"
      :height="iconSize"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M10 6L14 10L10 14"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 10H6C4.89543 10 4 9.10457 4 8V6"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- Text content -->
    <span v-if="!iconOnly" class="link-button-text">
      <slot />
    </span>
  </a>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  href: {
    type: String,
    default: '#'
  },
  target: {
    type: String,
    default: '_self',
    validator: (value) => ['_self', '_blank', '_parent', '_top'].includes(value)
  },
  rel: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'dark', 'light'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Boolean,
    default: false
  },
  iconRight: {
    type: Boolean,
    default: false
  },
  iconOnly: {
    type: Boolean,
    default: false
  },
  external: {
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

const isExternal = computed(() => {
  return props.external || props.target === '_blank'
})

const computedRel = computed(() => {
  if (props.rel) return props.rel
  return isExternal.value ? 'noopener noreferrer' : ''
})

const handleClick = (event) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<style scoped>
.link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px dashed #9747FF;
  border-radius: 5px;
  background-color: white;
  color: #0172B4;
  font-family: inherit;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
  user-select: none;
  min-height: 40px;
}

/* Link button sizes */
.link-button-small {
  padding: 8px 16px;
  font-size: 14px;
  line-height: 1.4;
  min-height: 32px;
}

.link-button-medium {
  padding: 12px 24px;
  font-size: 16px;
  line-height: 1.5;
  min-height: 40px;
}

.link-button-large {
  padding: 16px 32px;
  font-size: 18px;
  line-height: 1.5;
  min-height: 48px;
}

/* Icon only buttons */
.link-button-icon-only.link-button-small {
  padding: 8px;
  width: 32px;
  height: 32px;
}

.link-button-icon-only.link-button-medium {
  padding: 12px;
  width: 40px;
  height: 40px;
}

.link-button-icon-only.link-button-large {
  padding: 16px;
  width: 48px;
  height: 48px;
}

/* Link button variants */
.link-button-primary {
  color: #0172B4;
  border-color: #9747FF;
}

.link-button-primary:hover:not(.link-button-disabled) {
  color: #015687;
  border-color: #7B3CC7;
  background-color: #F8F5FF;
}

.link-button-secondary {
  color: #015687;
  border-color: #7B3CC7;
}

.link-button-secondary:hover:not(.link-button-disabled) {
  color: #00395A;
  border-color: #5F2E9E;
  background-color: #F0EDF7;
}

.link-button-dark {
  color: #00395A;
  border-color: #5F2E9E;
}

.link-button-dark:hover:not(.link-button-disabled) {
  color: #002438;
  border-color: #432371;
  background-color: #E8E5F0;
}

.link-button-light {
  color: #99D2F3;
  border-color: #B8A5D9;
}

.link-button-light:hover:not(.link-button-disabled) {
  color: #7BC1E8;
  border-color: #9B8BC4;
  background-color: #F7F4FF;
}

/* Disabled state */
.link-button-disabled {
  color: #CCCCCC !important;
  border-color: #E5E5E5 !important;
  background-color: #F8F8F8 !important;
  cursor: not-allowed;
  opacity: 0.6;
}

.link-button-disabled:hover {
  color: #CCCCCC !important;
  border-color: #E5E5E5 !important;
  background-color: #F8F8F8 !important;
}

/* Icon styles */
.link-button-icon {
  flex-shrink: 0;
}

.link-button-icon-left {
  margin-right: 4px;
}

.link-button-icon-right {
  margin-left: 4px;
}

/* Text styles */
.link-button-text {
  display: inline-block;
}

/* Focus styles */
.link-button:focus-visible {
  outline: 2px solid #018FE1;
  outline-offset: 2px;
}

/* Active state */
.link-button:active:not(.link-button-disabled) {
  transform: translateY(1px);
}

/* External link indicator */
.link-button-external .link-button-icon-right {
  opacity: 0.8;
}

/* Responsive design */
@media (max-width: 768px) {
  .link-button {
    padding: 10px 20px;
    font-size: 14px;
  }
  
  .link-button-small {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .link-button-large {
    padding: 14px 28px;
    font-size: 16px;
  }
}
</style> 