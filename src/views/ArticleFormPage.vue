<template>
    <MainLayout>
        <template #header>
            <Header :sidebar-open="drawerOpen" @toggle-drawer="toggleDrawer" />
        </template>
        <template #sidebar>
            <DashboardSidebar :drawer-open="drawerOpen" @close-drawer="closeDrawer" />
        </template>

        <div class="article-form-container">
            <div class="form-article-wrapper">
                <FormArticle v-model="form" :show-errors="showErrors" :is-edit="isEdit" :loading="loading"
                    @submit="handleSubmit" />
            </div>
            <div class="tags-section-wrapper">
                <TagsSection title="Tags" :initialTags="['Vue', 'JavaScript', 'UI']" :selectedTags="form.selectedTags"
                    @update:selectedTags="handleSelectedTags" />
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Header from '@/components/Header.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import TagsSection from '@/components/TagsSection.vue'
import FormArticle from '@/components/FormArticle.vue'
import { fetcherWrapper } from '@/composables/useFetcherWrapper'
import { API_BASE_URL } from '@/config/api'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const isEdit = !!route.params.slug
const form = ref({
    title: '',
    description: '',
    body: '',
    selectedTags: []
})
const showErrors = ref(false)
const drawerOpen = ref(false)
const loading = ref(false)
const { notify } = useNotification()

function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value
}

function closeDrawer() {
    drawerOpen.value = false
}

async function fetchArticle(slug) {
    loading.value = true
    try {
        const { data, error } = await fetcherWrapper(`${API_BASE_URL}/articles/${slug}`)
        if (error) throw new Error(error)
        const article = data.article
        form.value.title = article.title || ''
        form.value.description = article.description || ''
        form.value.body = article.body || ''
        form.value.selectedTags = article.tagList || []
    } catch (e) {
        notify({ message: e.message || 'Error loading article for editing.', type: 'error' })
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (isEdit) {
        fetchArticle(route.params.slug)
    }
})

async function handleSubmit() {
    loading.value = true
    showErrors.value = true
    if (
        !form.value.title ||
        !form.value.description ||
        !Array.isArray(form.value.selectedTags) ||
        !form.value.selectedTags.length
    ) {
        notify({ message: 'Please fill in all fields and select at least one tag.', type: 'error' })
        loading.value = false
        return
    }
    try {
        let url, method, body
        if (isEdit) {
            url = `${API_BASE_URL}/articles/${route.params.slug}`
            method = 'PUT'
            body = {
                title: form.value.title,
                description: form.value.description,
                body: form.value.body,
                tagList: form.value.selectedTags
            }
        } else {
            url = `${API_BASE_URL}/articles`
            method = 'POST'
            body = {
                article: {
                    title: form.value.title,
                    description: form.value.description,
                    body: form.value.body,
                    tagList: form.value.selectedTags
                }
            }
        }
        const { data, error } = await fetcherWrapper(url, { method, body })
        if (error) throw new Error(error)
        notify({ message: isEdit ? 'Article updated!' : 'Article created! Tags: ' + form.value.selectedTags.join(', '), type: 'success' })
        form.value = { title: '', description: '', body: '', selectedTags: [] }
        showErrors.value = false
    } catch (e) {
        notify({ message: e.message || (isEdit ? 'Error updating article. Please try again.' : 'Error creating article. Please try again.'), type: 'error' })
    } finally {
        loading.value = false
    }
}

function handleSelectedTags(tags) {
    form.value.selectedTags = Array.isArray(tags) ? tags : []
}

watch(
    () => route.params.slug,
    (newSlug) => {
        if (!newSlug) {
            form.value = {
                title: '',
                description: '',
                body: '',
                selectedTags: []
            }
            showErrors.value = false
        }
    }
)
</script>

<style scoped>
.article-form-container {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
}

.form-article-wrapper {
    flex: 0 1 70%;
    min-width: 0;
}

.tags-section-wrapper {
    flex: 0 1 30%;
    min-width: 0;
}

@media (max-width: 900px) {
    .article-form-container {
        flex-direction: column;
    }

    .form-article-wrapper,
    .tags-section-wrapper {
        flex: 1 1 100%;
        width: 100%;
        min-width: 0;
    }
}

.loading-indicator {
    font-size: 1.2rem;
    color: #009595;
    text-align: center;
    margin-top: 3rem;
}
</style>
