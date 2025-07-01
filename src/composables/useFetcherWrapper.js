import { getToken } from '@/utils/auth'

export async function fetcherWrapper(url, { method = 'GET', body, headers = {}, ...rest } = {}) {
  const token = getToken()
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...headers
  }

  let response, data, error
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...rest
    })
    if (response.status === 204) {
      data = null
      error = null
    } else {
      data = await response.json()
      if (!response.ok) {
        error = data.errors ? Object.values(data.errors).join(' ') : data.message || response.statusText
      }
    }
  } catch (e) {
    error = e.message || 'Network error'
  }
  return { data, error, response }
} 