import { reactive, computed } from 'vue'
import { apiRequest, setAuthToken, getAuthToken } from './api'

const state = reactive({
  user: null,
  wallet: {
    balance_credits: 5000,
    balance_usd: 5.00,
  },
  token: getAuthToken(),
  isLoading: false,
  error: null,
})

export const useAuth = () => {
  const isAuthenticated = computed(() => !!state.token)
  const user = computed(() => state.user)
  const wallet = computed(() => state.wallet)
  const isLoading = computed(() => state.isLoading)
  const error = computed(() => state.error)

  async function register({ name, email, password }) {
    state.isLoading = true
    state.error = null
    try {
      const response = await apiRequest('/api/v1/auth/register', {
        method: 'POST',
        body: { name, email, password },
      })

      if (response?.token) {
        state.token = response.token
        setAuthToken(response.token)
        state.user = response.user || null
        await fetchWallet()
      }
      return response
    } catch (err) {
      state.error = err.message || 'Registration failed'
      throw err
    } finally {
      state.isLoading = false
    }
  }

  async function login({ email, password }) {
    state.isLoading = true
    state.error = null
    try {
      const response = await apiRequest('/api/v1/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      if (response?.token) {
        state.token = response.token
        setAuthToken(response.token)
        state.user = response.user || null
        await fetchWallet()
      }
      return response
    } catch (err) {
      state.error = err.message || 'Invalid credentials'
      throw err
    } finally {
      state.isLoading = false
    }
  }

  async function fetchUser() {
    if (!state.token) return null
    try {
      const response = await apiRequest('/api/v1/auth/me')
      if (response?.user) {
        state.user = response.user
      }
      await fetchWallet()
      return state.user
    } catch (err) {
      if (err.status === 401) {
        logout()
      }
      return null
    }
  }

  async function fetchWallet() {
    if (!state.token) return
    try {
      const response = await apiRequest('/api/v1/wallet')
      if (response?.data) {
        state.wallet = {
          balance_credits: response.data.balance_credits || 0,
          balance_usd: response.data.balance_usd || (response.data.balance_credits / 1000),
        }
      }
    } catch {
      // Keep default or current wallet state on error
    }
  }

  function logout() {
    state.token = null
    state.user = null
    setAuthToken(null)
  }

  return {
    state,
    isAuthenticated,
    user,
    wallet,
    isLoading,
    error,
    register,
    login,
    logout,
    fetchUser,
    fetchWallet,
  }
}
