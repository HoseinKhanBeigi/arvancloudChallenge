<template>
  <div class="new-article-root">
    <h2 class="new-article-title">New Article</h2>
    <form class="article-form" @submit.prevent="onSubmit">
      <div class="form-group title">
        <label for="title">Title</label>
        <InputField id="title" v-model="localForm.title" placeholder="Enter article title" :has-error="showErrors && !localForm.title" error-message="Title is required" />
      </div>
      <div class="form-group description">
        <label for="description">Description</label>
        <InputField id="description" v-model="localForm.description" placeholder="Enter a short description" :has-error="showErrors && !localForm.description" error-message="Description is required" />
      </div>
      <div class="form-group body-group">
        <label for="body">Body</label>
        <InputField id="body" v-model="localForm.body" type="textarea" placeholder="Write your article..." :minHeight="220" />
      </div>
      <Button class="submit-btn" type="submit" variant="primary" size="medium" :loading="props.loading">
        {{ props.isEdit ? 'Update Article' : 'Create Article' }}
      </Button>
    </form>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from 'vue'
import InputField from './InputField.vue'
import Button from './Button.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  showErrors: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'submit'])

const localForm = reactive({
  title: props.modelValue.title || '',
  description: props.modelValue.description || '',
  body: props.modelValue.body || ''
})

watch(
  () => ({ ...localForm }),
  (val) => {
    emit('update:modelValue', {
      ...props.modelValue,
      ...val
    })
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  (val) => {
    localForm.title = val.title
    localForm.description = val.description
    localForm.body = val.body
  },
  { deep: true }
)

function onSubmit() {
  emit('submit')
}
</script>

<style scoped>
.new-article-root {
  /* max-width: 600px; */
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 2rem 2.5rem 2.5rem 2.5rem;
}
.new-article-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #000000;
}
.article-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.submit-btn {
  background: linear-gradient(135deg, #018FE1 0%, #009595 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;
}
.submit-btn:hover {
  background: linear-gradient(135deg, #009595 0%, #018FE1 100%);
}

.title label {
    font-size: 1rem;
    font-weight: bold;
    color: #000000;
}

.description label {
  font-size: 1rem;
  font-weight: bold;
  color: #000000;
}

.body-group label {
  font-size: 1rem;
  font-weight: bold;
  color: #000000;
}
</style> 