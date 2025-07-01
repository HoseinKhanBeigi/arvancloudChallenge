import { ref } from 'vue'

export function useArticleForm() {
  const form = ref({
    title: '',
    description: '',
    body: '',
    selectedTags: []
  })
  const showErrors = ref(false)

  function resetForm() {
    form.value = { title: '', description: '', body: '', selectedTags: [] }
    showErrors.value = false
  }

  function validateForm() {
    return (
      form.value.title &&
      form.value.description &&
      Array.isArray(form.value.selectedTags) &&
      form.value.selectedTags.length
    )
  }

  return { form, showErrors, resetForm, validateForm }
} 