/**
 * API Client for PenQraft Spinx Backend
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export function getApiBaseUrl() {
  return API_BASE_URL.replace(/\/+$/, '')
}

export function getAuthToken() {
  return localStorage.getItem('penqraft_token') || ''
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('penqraft_token', token)
  } else {
    localStorage.removeItem('penqraft_token')
  }
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${getApiBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const token = getAuthToken()

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  // Handle GET query parameters if needed
  let body = options.body
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body)
  }

  console.log(headers)

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  })

  let data = null
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  } else {
    data = await response.text()
  }

  if (response.status === 401) {
    setAuthToken(null)
  }

  if (!response.ok) {
    const error = new Error(data?.message || data?.error || `Request failed with status ${response.status}`)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}
