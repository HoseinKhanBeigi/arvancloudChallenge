<template>
  <div class="tags-section-card">
    <h3 class="tags-section-title">{{ title }}</h3>
    <div class="tags-section-input-row">
      <InputField
        v-model="newTag"
        :placeholder="inputPlaceholder"
        style="flex:1;"
        @keyup.enter="addTag"
      />
    </div>
    <div v-if="addTagError" class="tags-section-error">{{ addTagError }}</div>
    <div class="tags-section-list">
      <label
        v-for="tag in tags"
        :key="tag"
        class="tags-section-checkbox-label"
      >
        <Checkbox
          :modelValue="props.selectedTags.includes(tag)"
          :variant="'primary'"
          @update:modelValue="checked => onCheckboxChange(tag, checked)"
        />
        <span>{{ tag }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, computed, onMounted } from 'vue'
import InputField from './InputField.vue'
import Button from './Button.vue'
import Checkbox from './Checkbox.vue'
import { fetcherWrapper } from '@/composables/useFetcherWrapper'
import { API_BASE_URL } from '@/config/api'
import { useNotification } from '@/composables/useNotification'

const props = defineProps({
  title: {
    type: String,
    default: 'Tags',
  },
  initialTags: {
    type: Array,
    default: () => ['Vue', 'JavaScript', 'Frontend', 'UI', 'Dashboard', 'Article', 'Tag'],
  },
  inputPlaceholder: {
    type: String,
    default: 'Add a tag...'
  },
  selectedTags: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:selectedTags'])

const tags = ref([...props.initialTags])
const newTag = ref('')
const addTagError = ref('')
const { notify } = useNotification()

async function fetchTags() {
  try {
    const { data, error } = await fetcherWrapper(`${API_BASE_URL}/tags`)
    if (error) throw new Error(error)
    if (Array.isArray(data.tags)) {
      // Merge in any missing selectedTags
      const allTags = Array.from(new Set([...data.tags, ...(props.selectedTags || [])]))
      tags.value = allTags
    }
  } catch (e) {
    // fallback to initialTags, also merge selectedTags
    tags.value = Array.from(new Set([...props.initialTags, ...(props.selectedTags || [])]))
    notify({ message: e.message || 'Could not load tags.', type: 'error' })
  }
}

onMounted(() => {
  fetchTags()
})

async function addTag() {
  const tag = newTag.value.trim()
  addTagError.value = ''
  if (tag && !tags.value.includes(tag)) {
    try {
      const { error } = await fetcherWrapper(`${API_BASE_URL}/tags`, {
        method: 'POST',
        body: { tag }
      })
      if (error) throw new Error(error)
      tags.value.push(tag)
      // Immediately select the new tag
      emit('update:selectedTags', [...props.selectedTags, tag])
      newTag.value = ''
    } catch (e) {
      addTagError.value = 'Could not add tag. Please try again.'
      notify({ message: e.message || 'Could not add tag. Please try again.', type: 'error' })
    }
  } else if (tags.value.includes(tag)) {
    // Just select it if it already exists
    if (!props.selectedTags.includes(tag)) {
      emit('update:selectedTags', [...props.selectedTags, tag])
    }
    newTag.value = ''
  }
}

function onCheckboxChange(tag, checked) {
  let updated = [...props.selectedTags]
  if (checked && !updated.includes(tag)) {
    updated.push(tag)
  } else if (!checked && updated.includes(tag)) {
    updated = updated.filter(t => t !== tag)
  }
  emit('update:selectedTags', updated)
}
</script>

<style scoped>
.tags-section-card {
  /* width: 376px; */
  /* min-height: 484px; */
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  border: 1px solid #e6e6e6;
  padding: 2rem 2rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.tags-section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  letter-spacing: 0.01em;
}
.tags-section-input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
.tags-section-error {
  color: #dc2626;
  margin-bottom: 1rem;
  font-size: 0.98rem;
  text-align: left;
}
.tags-section-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.tags-section-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.05rem;
  color: #009595;
  background: #e6f7fa;
  border-radius: 16px;
  padding: 0.4rem 1.2rem 0.4rem 0.9rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}
@media (max-width: 500px) {
  .tags-section-card {
    width: 100%;
    min-width: 0;
    padding: 1rem;
  }
}
</style> 