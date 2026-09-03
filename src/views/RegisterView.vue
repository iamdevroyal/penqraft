<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="brand-header">
        <router-link to="/" class="brand-wordmark">
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="10" fill="url(#logo-reg)" />
            <path d="M11 25C14.5 24 16 19 18 13C20 18 21.5 23 25 25" stroke="white" stroke-width="2.5" stroke-linecap="round" />
            <circle cx="18" cy="10" r="2" fill="#A78BFA" />
            <defs>
              <linearGradient id="logo-reg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stop-color="#6210CC" />
                <stop offset="1" stop-color="#9333EA" />
              </linearGradient>
            </defs>
          </svg>
          <span>pen<span class="accent">Q</span>raft</span>
        </router-link>
        <h1 class="auth-title">Create Author Account</h1>
        <p class="auth-subtitle">Begin architecting with collaborative AI agents</p>
      </div>

      <div class="bonus-banner">
        <span style="font-size: 1rem;">🎁</span>
        <span>Includes 5,000 Complimentary Welcome Credits ($5.00 USD value)</span>
      </div>

      <div v-if="errorMessage" class="error-banner">
        <div>• {{ errorMessage }}</div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name" class="form-label">Full Name or Pen Name</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="form-input"
            placeholder="Jane Austen"
            required
            autofocus
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="form-input"
            placeholder="author@example.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password (min 8 characters)</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="form-input"
            placeholder="••••••••"
            required
            minlength="8"
          />
        </div>

        <div class="form-group">
          <label for="password_confirmation" class="form-label">Confirm Password</label>
          <input
            type="password"
            id="password_confirmation"
            v-model="form.password_confirmation"
            class="form-input"
            placeholder="••••••••"
            required
            minlength="8"
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="isLoading">
          <span v-if="!isLoading">Claim Credits & Create Account &rarr;</span>
          <span v-else>Creating account...</span>
        </button>
      </form>

      <div class="auth-footer">
        Already have an account?
        <router-link to="/login" class="auth-link">Sign In to PenQraft Studio</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../services/auth'

const router = useRouter()
const { register, isLoading } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''

  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Password confirmation does not match.'
    return
  }

  try {
    await register({
      name: form.name,
      email: form.email,
      password: form.password,
    })
    router.push('/app')
  } catch (err) {
    errorMessage.value = err.message || 'Registration failed. Please check your details.'
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background-color: var(--color-bg);
  background-image:
    radial-gradient(ellipse at 50% 0%, rgba(98, 16, 204, 0.35) 0%, transparent 65%),
    radial-gradient(circle at 85% 70%, rgba(124, 58, 237, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 15% 30%, rgba(98, 16, 204, 0.1) 0%, transparent 45%);
  background-attachment: fixed;
}

.auth-card {
  background: rgba(19, 14, 36, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--color-surface-border);
  border-radius: 20px;
  padding: clamp(28px, 6vw, 44px);
  width: 100%;
  max-width: 460px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(98, 16, 204, 0.2);
  position: relative;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-primary-light));
  border-radius: 20px 20px 0 0;
}

.brand-header {
  text-align: center;
  margin-bottom: 28px;
}

.brand-wordmark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #FFFFFF;
  text-decoration: none;
  margin-bottom: 12px;
}

.brand-wordmark .accent {
  color: var(--color-accent);
}

.auth-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 6px;
}

.auth-subtitle {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.bonus-banner {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34D399;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(10, 7, 18, 0.7);
  border: 1px solid var(--color-surface-border);
  border-radius: 10px;
  color: #FFFFFF;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
  background: rgba(14, 9, 26, 0.9);
}

.error-banner {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #FCA5A5;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  margin-bottom: 20px;
  line-height: 1.4;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  border: none;
  border-radius: 10px;
  color: #FFFFFF;
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 20px var(--color-primary-glow);
  transition: all 0.25s ease;
  margin-top: 8px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(98, 16, 204, 0.6);
  background: linear-gradient(135deg, #7014EA, #8B5CF6);
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 0.88rem;
  color: var(--color-text-muted);
  border-top: 1px solid rgba(42, 34, 77, 0.4);
  padding-top: 18px;
}

.auth-link {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
  margin-left: 4px;
}

.auth-link:hover {
  color: #FFFFFF;
  text-decoration: underline;
}
</style>
