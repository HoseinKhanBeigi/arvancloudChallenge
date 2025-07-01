import { fetcherWrapper } from '@/composables/useFetcherWrapper'
import { API_BASE_URL } from '@/config/api'

export function fetchArticle(slug) {
  return fetcherWrapper(`${API_BASE_URL}/articles/${slug}`)
}

export function createArticle(article) {
  return fetcherWrapper(`${API_BASE_URL}/articles`, {
    method: 'POST',
    body: { article }
  })
}

export function updateArticle(slug, article) {
  return fetcherWrapper(`${API_BASE_URL}/articles/${slug}`, {
    method: 'PUT',
    body: { article }
  })
} 