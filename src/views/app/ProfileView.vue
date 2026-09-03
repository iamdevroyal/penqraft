<template>
  <div class="profile-view">
    <div class="view-header">
      <div class="header-titles">
        <h1 class="view-title serif">Author Profile</h1>
        <p class="view-subtitle">Manage your author identity, security credentials, and API access tokens.</p>
      </div>
    </div>

    <div class="profile-layout">
      <!-- Left Column: Identity Card -->
      <div class="identity-card">
        <div class="avatar-large">{{ userInitial }}</div>
        <h2 class="user-display-name">{{ user.name || 'Author' }}</h2>
        <span class="user-role-badge">{{ user.role || 'Writer' }}</span>
        <span class="user-email-text">{{ user.email || '' }}</span>

        <div class="identity-details">
          <div class="detail-row">
            <span class="detail-label">Account ID</span>
            <span class="detail-value">#{{ user.id || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Member Since</span>
            <span class="detail-value">{{ formatDate(user.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Settings Forms -->
      <div class="settings-column">
        <!-- Update Profile Details -->
        <div class="settings-card">
          <h3 class="card-title">Profile Information</h3>
          <form @submit.prevent="updateProfileInfo">
            <div class="form-group">
              <label>Full Name</label>
              <input
                type="text"
                v-model="profileForm.name"
                class="form-input"
                placeholder="Author Name"
                required
              />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input
                type="email"
                v-model="profileForm.email"
                class="form-input"
                placeholder="author@example.com"
                required
              />
            </div>

            <button type="submit" class="btn-save" :disabled="isSavingProfile">
              <span v-if="isSavingProfile" class="spinner"></span>
              {{ isSavingProfile ? 'Saving…' : 'Update Profile' }}
            </button>
          </form>
        </div>

        <!-- Change Password -->
        <div class="settings-card">
          <h3 class="card-title">Security &amp; Password</h3>
          <form @submit.prevent="updatePassword">
            <div class="form-group">
              <label>Current Password</label>
              <input
                type="password"
                v-model="passwordForm.current_password"
                class="form-input"
                placeholder="••••••••"
                required
              />
            </div>
            <div class="form-row">
              <div class="form-group half">
                <label>New Password</label>
                <input
                  type="password"
                  v-model="passwordForm.password"
                  class="form-input"
                  placeholder="Min 8 characters"
                  required
                />
              </div>
              <div class="form-group half">
                <label>Confirm Password</label>
                <input
                  type="password"
                  v-model="passwordForm.confirm_password"
                  class="form-input"
                  placeholder="Repeat new password"
                  required
                />
              </div>
            </div>

            <button type="submit" class="btn-save" :disabled="isSavingPassword">
              <span v-if="isSavingPassword" class="spinner"></span>
              {{ isSavingPassword ? 'Updating…' : 'Change Password' }}
            </button>
          </form>
        </div>

        <!-- Personal Access Tokens -->
        <div class="settings-card">
          <div class="card-header-flex">
            <div>
              <h3 class="card-title">Personal Access Tokens</h3>
              <p class="card-desc">Generate Bearer tokens to access the PenQraft API programmatically.</p>
            </div>
            <button class="btn-sm-action" @click="showTokenModal = true">+ Create Token</button>
          </div>

          <div v-if="newTokenCreated" class="new-token-banner">
            <span class="token-alert-title">⚠️ Copy your new token now — it won't be shown again:</span>
            <div class="token-display-box">
              <code>{{ newTokenCreated }}</code>
              <button class="btn-copy-token" @click="copyToken">Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Token Modal -->
    <div v-if="showTokenModal" class="modal-overlay" @click.self="showTokenModal = false">
      <div class="modal-card">
        <h3 class="serif modal-title">Create Personal Access Token</h3>
        <div class="form-group" style="margin-top: 14px;">
          <label>Token Description</label>
          <input
            type="text"
            v-model="tokenDescription"
            class="form-input"
            placeholder="e.g. VS Code Scripting, CLI"
            required
          />
        </div>
        <div class="modal-buttons">
          <button class="btn-save" @click="generateToken" :disabled="!tokenDescription.trim()">Generate</button>
          <button class="btn-close-modal" @click="showTokenModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { apiGet, apiPatch, apiPost } from '../../services/api'
import { useAuth } from '../../services/auth'

const { user: authUser, fetchUser } = useAuth()
const user = ref({ name: '', email: '', role: '', created_at: '' })

const profileForm = reactive({ name: '', email: '' })
const passwordForm = reactive({ current_password: '', password: '', confirm_password: '' })

const isSavingProfile = ref(false)
const isSavingPassword = ref(false)
const showTokenModal = ref(false)
const tokenDescription = ref('')
const newTokenCreated = ref(null)

const userInitial = computed(() => {
  return user.value.name ? user.value.name.charAt(0).toUpperCase() : 'A'
})

async function loadProfile() {
  try {
    const res = await apiGet('/api/v1/auth/me')
    if (res?.user) {
      user.value = res.user
      profileForm.name = res.user.name || ''
      profileForm.email = res.user.email || ''
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
  }
}

async function updateProfileInfo() {
  isSavingProfile.value = true
  try {
    const res = await apiPatch('/api/v1/auth/me', {
      name: profileForm.name,
      email: profileForm.email,
    })
    if (res?.user) {
      user.value = res.user
      await fetchUser()
      alert('Profile updated successfully.')
    }
  } catch (err) {
    alert(err.message || 'Failed to update profile.')
  } finally {
    isSavingProfile.value = false
  }
}

async function updatePassword() {
  if (passwordForm.password !== passwordForm.confirm_password) {
    alert('Passwords do not match.')
    return
  }

  isSavingPassword.value = true
  try {
    await apiPatch('/api/v1/auth/me', {
      current_password: passwordForm.current_password,
      password: passwordForm.password,
    })
    passwordForm.current_password = ''
    passwordForm.password = ''
    passwordForm.confirm_password = ''
    alert('Password updated successfully.')
  } catch (err) {
    alert(err.message || 'Failed to update password.')
  } finally {
    isSavingPassword.value = false
  }
}

async function generateToken() {
  if (!tokenDescription.value.trim()) return
  try {
    const res = await apiPost('/api/v1/auth/tokens', {
      name: tokenDescription.value.trim(),
    })
    if (res?.token) {
      newTokenCreated.value = res.token
      showTokenModal.value = false
      tokenDescription.value = ''
    }
  } catch (err) {
    alert(err.message || 'Failed to create token.')
  }
}

function copyToken() {
  if (!newTokenCreated.value) return
  navigator.clipboard.writeText(newTokenCreated.value)
  alert('Token copied to clipboard.')
}

function formatDate(str) {
  if (!str) return 'Recent'
  try {
    const d = new Date(str)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return str
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-view {
  padding: 36px 40px;
  background-color: #090611;
  min-height: 100vh;
  color: #FDFBF7;
  overflow-y: auto;
}
.serif { font-family: 'Fraunces', Georgia, serif; }

.view-header { margin-bottom: 28px; }
.view-title { font-size: 2rem; font-weight: 700; color: #FFF; margin-bottom: 6px; }
.view-subtitle { color: #A19EB7; font-size: 0.95rem; }

.profile-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 28px;
}
@media (max-width: 860px) {
  .profile-layout { grid-template-columns: 1fr; }
}

/* Identity Card */
.identity-card {
  background: rgba(18, 14, 34, 0.8);
  border: 1px solid #2A224D;
  border-radius: 14px;
  padding: 28px 20px;
  text-align: center;
  height: fit-content;
}

.avatar-large {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6210CC, #9333EA);
  color: #FFF;
  font-size: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 8px 20px rgba(98, 16, 204, 0.4);
}

.user-display-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #FFF;
  margin-bottom: 4px;
}
.user-role-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(98, 16, 204, 0.3);
  color: #C4B5FD;
  margin-bottom: 8px;
}
.user-email-text {
  display: block;
  font-size: 0.82rem;
  color: #A19EB7;
  margin-bottom: 20px;
  word-break: break-all;
}

.identity-details {
  border-top: 1px solid #2A224D;
  padding-top: 16px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}
.detail-label { color: #635F7E; }
.detail-value { color: #EDE9FE; font-weight: 600; }

/* Settings Column */
.settings-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-card {
  background: rgba(18, 14, 34, 0.7);
  border: 1px solid #2A224D;
  border-radius: 14px;
  padding: 24px;
}
.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #FFF;
  margin-bottom: 4px;
}
.card-desc {
  font-size: 0.82rem;
  color: #A19EB7;
  margin-bottom: 16px;
}
.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.form-group { margin-bottom: 14px; }
.form-row { display: flex; gap: 12px; }
.form-group.half { flex: 1; }
.form-group label {
  display: block; font-size: 0.78rem; font-weight: 600; color: #C4B5FD; margin-bottom: 6px;
}
.form-input {
  width: 100%;
  background: rgba(0,0,0,0.3);
  border: 1px solid #2A224D;
  border-radius: 8px;
  padding: 10px 12px;
  color: #FFF;
  font-size: 0.88rem;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}
.form-input:focus { border-color: #7C3AED; }

.btn-save {
  padding: 10px 20px;
  background: linear-gradient(135deg, #6210CC, #7C3AED);
  border: none;
  border-radius: 8px;
  color: #FFF;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-sm-action {
  background: rgba(98, 16, 204, 0.25);
  border: 1px solid rgba(124, 58, 237, 0.4);
  color: #C4B5FD;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-sm-action:hover {
  background: #7C3AED;
  color: #FFF;
}

.new-token-banner {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 8px;
  padding: 14px;
  margin-top: 10px;
}
.token-alert-title {
  display: block; font-size: 0.8rem; color: #34D399; font-weight: 700; margin-bottom: 8px;
}
.token-display-box {
  display: flex; align-items: center; gap: 8px;
}
.token-display-box code {
  flex: 1; background: rgba(0,0,0,0.4); padding: 8px 10px; border-radius: 6px;
  color: #FFF; font-size: 0.8rem; overflow-x: auto;
}
.btn-copy-token {
  background: #10B981; color: #FFF; border: none; padding: 8px 12px; border-radius: 6px;
  cursor: pointer; font-weight: 600; font-size: 0.78rem;
}

.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 400; padding: 20px;
}
.modal-card {
  background: #120E22; border: 1px solid #3B2D6B;
  border-radius: 16px; padding: 24px; width: 100%; max-width: 440px;
}
.modal-title { font-size: 1.25rem; color: #FFF; }
.modal-buttons { display: flex; gap: 10px; margin-top: 18px; align-items: center; }
.btn-close-modal {
  background: none; border: none; color: #A19EB7; padding: 8px; cursor: pointer;
}

.spinner {
  width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #FFF; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 640px) {
  .profile-view { padding: 20px 16px; }
  .view-title { font-size: 1.6rem; }
}
</style>
