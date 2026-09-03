<template>
  <div class="app-shell">
    <!-- VS Code-Style Activity Rail -->
    <aside class="activity-rail">
      <div class="rail-top">
        <!-- Logo Mark -->
        <router-link to="/app/studio" class="rail-logo" title="PenQraft Studio">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="9" fill="url(#logo-rail)"/>
            <path d="M11 25C14.5 24 16 19 18 13C20 18 21.5 23 25 25" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="18" cy="10" r="2" fill="#A78BFA"/>
            <defs>
              <linearGradient id="logo-rail" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stop-color="#6210CC"/>
                <stop offset="1" stop-color="#9333EA"/>
              </linearGradient>
            </defs>
          </svg>
        </router-link>

        <!-- Navigation Icons -->
        <nav class="rail-nav">
          <router-link
            to="/app/studio"
            class="rail-item"
            :class="{ active: isCurrentRoute('/app/studio') }"
            title="Literary Studio (✍️)"
          >
            <span class="rail-icon">✍️</span>
            <span class="rail-tooltip">Studio</span>
          </router-link>

          <router-link
            to="/app/projects"
            class="rail-item"
            :class="{ active: isCurrentRoute('/app/projects') }"
            title="Manuscript Projects (📁)"
          >
            <span class="rail-icon">📁</span>
            <span class="rail-tooltip">Projects</span>
          </router-link>

          <router-link
            to="/app/wallet"
            class="rail-item"
            :class="{ active: isCurrentRoute('/app/wallet') }"
            title="Wallet & Credits (🪙)"
          >
            <span class="rail-icon">🪙</span>
            <span class="rail-tooltip">Wallet</span>
          </router-link>

          <router-link
            to="/app/profile"
            class="rail-item"
            :class="{ active: isCurrentRoute('/app/profile') }"
            title="Author Profile (👤)"
          >
            <span class="rail-icon">👤</span>
            <span class="rail-tooltip">Profile</span>
          </router-link>

          <router-link
            to="/app/settings"
            class="rail-item"
            :class="{ active: isCurrentRoute('/app/settings') }"
            title="Studio Settings (⚙️)"
          >
            <span class="rail-icon">⚙️</span>
            <span class="rail-tooltip">Settings</span>
          </router-link>
        </nav>
      </div>

      <!-- Bottom Actions -->
      <div class="rail-bottom">
        <router-link to="/app/profile" class="rail-avatar" :title="user?.name || 'Author Profile'">
          <span class="avatar-letter">{{ userInitial }}</span>
          <span class="avatar-status-dot"></span>
        </router-link>

        <button class="rail-btn-signout" @click="handleSignOut" title="Sign Out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </aside>

    <!-- Main Viewport (Studio or Sub-pages) -->
    <main class="app-viewport">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../services/auth'

const route = useRoute()
const router = useRouter()
const { user, logout } = useAuth()

const userInitial = computed(() => {
  return user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'A'
})

function isCurrentRoute(path) {
  return route.path.startsWith(path)
}

function handleSignOut() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.app-shell {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #090611;
}

/* VS Code-style Activity Rail */
.activity-rail {
  width: 54px;
  height: 100vh;
  background-color: #0D0A1A;
  border-right: 1px solid #2A224D;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0 16px 0;
  flex-shrink: 0;
  z-index: 60;
}

.rail-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
}

.rail-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 8px;
  transition: transform 0.2s;
}
.rail-logo:hover {
  transform: scale(1.05);
}

.rail-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.rail-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: #A19EB7;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}
.rail-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
}
.rail-item.active {
  background: rgba(98, 16, 204, 0.25);
  color: #FFFFFF;
  border-left: 2px solid #7C3AED;
}

.rail-icon {
  font-size: 1.15rem;
}

/* Tooltips */
.rail-tooltip {
  position: absolute;
  left: calc(100% + 10px);
  background: #1A1333;
  color: #FFF;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 5px;
  border: 1px solid #3B2D6B;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.15s ease;
  box-shadow: 0 4px 14px rgba(0,0,0,0.5);
  z-index: 100;
}
.rail-item:hover .rail-tooltip {
  opacity: 1;
  transform: translateX(0);
}

.rail-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.rail-avatar {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6210CC, #9333EA);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #FFF;
  font-weight: 700;
  font-size: 0.85rem;
  transition: transform 0.2s;
}
.rail-avatar:hover {
  transform: scale(1.08);
}
.avatar-status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10B981;
  border: 1.5px solid #0D0A1A;
}

.rail-btn-signout {
  background: none;
  border: none;
  color: #635F7E;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s;
}
.rail-btn-signout:hover {
  color: #F87171;
  background: rgba(239, 68, 68, 0.1);
}

/* Main Viewport */
.app-viewport {
  flex: 1;
  height: 100vh;
  overflow: auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

@media (max-width: 640px) {
  .activity-rail {
    width: 44px;
    padding: 8px 0 12px 0;
  }
  .rail-item {
    width: 34px;
    height: 34px;
  }
}
</style>
