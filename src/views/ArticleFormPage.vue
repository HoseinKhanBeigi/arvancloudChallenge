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
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Header from '@/components/Header.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import TagsSection from '@/components/TagsSection.vue'
import FormArticle from '@/components/FormArticle.vue'
import { useNotification } from '@/composables/useNotification'
import { useArticleForm } from '@/composables/useArticleForm'
import { fetchArticle, createArticle, updateArticle } from '@/api/articles'

const route = useRoute()
const router = useRouter()
const isEdit = !!route.params.slug
const { form, showErrors, resetForm, validateForm } = useArticleForm()
const drawerOpen = ref(false)
const loading = ref(false)
const { notify } = useNotification()

function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value
}

function closeDrawer() {
    drawerOpen.value = false
}

async function loadArticle(slug) {
    loading.value = true
    try {
        const { data, error } = await fetchArticle(slug)
        if (error) throw new Error(error)
        form.value.title = data.article.title || ''
        form.value.description = data.article.description || ''
        form.value.body = data.article.body || ''
        form.value.selectedTags = data.article.tagList || []
    } catch (e) {
        notify({ message: e.message || 'Error loading article for editing.', type: 'error' })
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (isEdit) {
        loadArticle(route.params.slug)
    }
})

async function handleSubmit() {
    loading.value = true
    showErrors.value = true
    if (!validateForm()) {
        notify({ message: 'Please fill in all fields and select at least one tag.', type: 'error' })
        loading.value = false
        return
    }
    try {
        let result
        if (isEdit) {
            result = await updateArticle(route.params.slug, {
                title: form.value.title,
                description: form.value.description,
                body: form.value.body,
                tagList: form.value.selectedTags
            })
        } else {
            result = await createArticle({
                title: form.value.title,
                description: form.value.description,
                body: form.value.body,
                tagList: form.value.selectedTags
            })
        }
        if (result.error) throw new Error(result.error)
        notify({ message: isEdit ? 'Article updated!' : 'Article created! Tags: ' + form.value.selectedTags.join(', '), type: 'success' })
        resetForm()
        router.push('/articles')
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
