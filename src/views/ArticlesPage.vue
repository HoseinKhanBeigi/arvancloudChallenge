<template>
  <MainLayout>
    <template #header>
      <Header />
    </template>
    <template #sidebar>
      <DashboardSidebar />
    </template>
    <div class="articles-container">

      <Table :columns="columns" :items="paginatedArticles" :loading="loading" :error="error" item-key="slug">
        <!-- Row number column -->
        <template #number="{ index }">
          <span class="row-number">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</span>
        </template>

        <!-- Title column -->
        <template #title="{ item }">
          <span class="article-title-cell" @mouseenter="showTooltip($event, item.title)"
            @mousemove="showTooltip($event, item.title)" @mouseleave="hideTooltip">
            {{ item.title }}
          </span>
        </template>


        <!-- Author column -->
        <template #author="{ item }">
          <div class="author">
            <!-- <img :src="item.author.image" :alt="item.author.username" class="author-image"> -->
            <span>{{ item.author.username }}</span>
          </div>
        </template>


        <!-- Created At column -->
        <template #createdAt="{ item }">
          <div class="created-at">
            <span>{{ formatDate(item.createdAt) }}</span>
          </div>
        </template>

        <!-- Tags column -->
        <template #tags="{ item }">
          <span v-for="tag in item.tagList" :key="tag" class="tag">
            {{ tag }}
          </span>
        </template>

        <!-- Actions column -->
        <template #actions="{ item }">
          <div style="position: relative;">
            <Button class="icon-btn" variant="plain" size="medium" :iconOnly="true" @click="openMenu(item.slug)"
              title="More">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 0.5H28C34.3513 0.5 39.5 5.64873 39.5 12V28C39.5 34.3513 34.3513 39.5 28 39.5H12C5.64873 39.5 0.5 34.3513 0.5 28V12C0.5 5.64873 5.64873 0.5 12 0.5Z"
                  stroke="#999999" />
                <path
                  d="M13.625 18.1249C14.6605 18.1249 15.5 18.9643 15.5 19.9999C15.5 21.0354 14.6605 21.8749 13.625 21.8749C12.5895 21.8749 11.75 21.0354 11.75 19.9999C11.75 18.9643 12.5895 18.1249 13.625 18.1249Z"
                  fill="black" />
                <path
                  d="M20.002 18.1249C21.0375 18.1249 21.877 18.9643 21.877 19.9999C21.877 21.0354 21.0375 21.8749 20.002 21.8749C18.9664 21.8749 18.127 21.0354 18.127 19.9999C18.127 18.9643 18.9664 18.1249 20.002 18.1249Z"
                  fill="black" />
                <path
                  d="M26.3789 18.1249C27.4144 18.1249 28.2539 18.9643 28.2539 19.9999C28.2539 21.0354 27.4144 21.8749 26.3789 21.8749C25.3434 21.8749 24.5039 21.0354 24.5039 19.9999C24.5039 18.9643 25.3434 18.1249 26.3789 18.1249Z"
                  fill="black" />
              </svg>
            </Button>
            <div v-if="openMenuSlug === item.slug" class="action-menu" v-click-outside="closeMenu">
              <div class="action-menu-item" @click="handleEdit(item.slug)">Edit</div>
              <div class="action-menu-item delete" @click="handleDelete(item.slug)">Delete</div>
            </div>
          </div>
        </template>
      </Table>

      <Pagination v-if="!loading && !error && articles.length > 0" v-model="currentPage" :total-items="articles.length"
        :per-page="itemsPerPage" @update:modelValue="handlePageChange" />

      <Modal v-if="showDeleteModal" @delete="confirmDelete" @cancel="showDeleteModal = false"
        :delete-loading="deleteLoading">
        <template #header>
          Delete Article
        </template>
        <template #body>
          Are you sure you want to delete this article? This action cannot be undone.
        </template>
      </Modal>

      <div v-if="tooltip.show" class="custom-tooltip-fixed"
        :style="{ left: tooltip.x + 12 + 'px', top: tooltip.y + 12 + 'px' }">
        {{ tooltip.text }}
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Header from '@/components/Header.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import Pagination from '@/components/Pagination.vue'
import Table from '@/components/Table.vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import { API_BASE_URL } from '@/config/api'
import { fetcherWrapper } from '@/composables/useFetcherWrapper'
import { useNotification } from '@/composables/useNotification'
import { onMounted as vOnMounted, onBeforeUnmount } from 'vue'
import { useTooltip } from '@/composables/useTooltip'
import { formatDate } from '@/utils/formatDate.js'

const router = useRouter()
const route = useRoute()
const { notify } = useNotification()

const columns = [
  { key: 'number', label: '#', style: { width: '50px' } },
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'tags', label: 'Tags' },

  { key: "createdAt", label: "Created At" },
  { key: 'actions', label: 'Actions', style: { width: '140px' } }
]

const articles = ref([])
const loading = ref(true)
const error = ref(null)
const itemsPerPage = 10

// Initialize currentPage from route
const currentPage = ref(parseInt(route.params.page) || 1)

// Watch for route changes
watch(
  () => route.params.page,
  (newPage) => {
    currentPage.value = parseInt(newPage) || 1
  }
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return articles.value.slice(start, end)
})

function handlePageChange(page) {
  if (page === 1) {
    router.push({ name: 'articles' })
  } else {
    router.push({ name: 'articles-page', params: { page: page.toString() } })
  }
}

function goToEdit(slug) {
  router.push(`/articles/edit/${slug}`)
}

const showDeleteModal = ref(false)
const articleToDelete = ref(null)

function openDeleteModal(slug) {
  articleToDelete.value = slug
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!articleToDelete.value) return
  try {
    const { error: deleteError } = await fetcherWrapper(`${API_BASE_URL}/articles/${articleToDelete.value}`, { method: 'DELETE' })
    if (deleteError) throw new Error(deleteError)
    articles.value = articles.value.filter(a => a.slug !== articleToDelete.value)
    notify({ message: 'Article deleted!', type: 'success' })
  } catch (e) {
    notify({ message: 'Error deleting article.', type: 'error' })
  } finally {
    showDeleteModal.value = false
    articleToDelete.value = null
  }
}

async function fetchArticles() {
  try {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await fetcherWrapper(`${API_BASE_URL}/articles`)
    if (fetchError) throw new Error(fetchError)
    articles.value = data.articles
  } catch (err) {
    error.value = 'Error loading articles. Please try again later.'
    notify({ message: 'Error loading articles. Please try again later.', type: 'error' })
    console.error('Error fetching articles:', err)
  } finally {
    loading.value = false
  }
}

const openMenuSlug = ref(null)

function openMenu(slug) {
  if (openMenuSlug.value === slug) {
    openMenuSlug.value = null;
  } else {
    openMenuSlug.value = slug;
  }
}
function closeMenu() {
  openMenuSlug.value = null
}
function handleEdit(slug) {
  closeMenu()
  goToEdit(slug)
}
function handleDelete(slug) {
  closeMenu()
  openDeleteModal(slug)
}

const { tooltip, showTooltip, hideTooltip } = useTooltip()

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.articles-container {
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.row-number {
  display: inline-block;
  min-width: 24px;
  text-align: center;
  font-weight: 500;
  color: #666;
}

.description {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author {
  display: flex;
  align-items: center;
  color: #333333;
  gap: 0.5rem;
}

.author-image {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.tag {
  display: inline-block;
  background: #e6f7fa;
  color: #009595;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  margin: 0.25rem;
}

.icon-btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-right: 0.25rem;
}

.action-menu {
  position: absolute;
  top: 44px;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  min-width: 120px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 6px 0;
}

.action-menu-item {
  padding: 10px 18px;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  transition: background 0.15s;
}

.action-menu-item:hover {
  background: #f3f4f6;
}

.action-menu-item.delete {
  color: #dc2626;
}

.article-title-cell {
  color: #333333;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
}

.created-at {
  color: #333333;
  font-size: 0.9rem;
}

.custom-tooltip-fixed {
  position: fixed;
  z-index: 9999;
  background: #222;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.95rem;
  white-space: pre-line;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  max-width: 400px;
  min-width: 120px;
  word-break: break-word;
  transition: opacity 0.15s;
  opacity: 0.97;
  animation: tooltip-fade-in 0.15s;
}

@keyframes tooltip-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.97;
  }
}
</style>