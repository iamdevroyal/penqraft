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

  let body = options.body
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body)
  }

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

export const apiGet = (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' })
export const apiPost = (endpoint, body = {}, options = {}) => apiRequest(endpoint, { ...options, method: 'POST', body })
export const apiPatch = (endpoint, body = {}, options = {}) => apiRequest(endpoint, { ...options, method: 'PATCH', body })
export const apiDelete = (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' })

/**
 * Real-time SSE Token Stream Consumer for Agents
 */
export async function streamAgentOutput(endpoint, { onToken, onDone, onError, signal } = {}) {
  const url = `${getApiBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const token = getAuthToken()

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      signal,
    })

    if (!response.ok) {
      throw new Error(`Streaming failed: HTTP ${response.status}`)
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported by browser or empty response.')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith(':')) continue

        if (trimmed.startsWith('data:')) {
          const rawData = trimmed.slice(5).trim()
          if (rawData === '[DONE]') {
            if (onDone) onDone()
            return
          }

          try {
            const parsed = JSON.parse(rawData)
            if (parsed.token && onToken) {
              onToken(parsed.token)
            } else if (parsed.content && onToken) {
              onToken(parsed.content)
            }
          } catch {
            // raw text token
            if (onToken) onToken(rawData)
          }
        }
      }
    }

    if (onDone) onDone()
  } catch (err) {
    if (onError) onError(err)
    else console.error('Stream error:', err)
  }
}
