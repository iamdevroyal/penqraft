<template>
  <header class="app-header">
    <div class="header-left">
      <!-- Left panel toggle -->
      <button
        class="panel-toggle"
        :class="{ active: leftOpen }"
        @click.stop="$emit('toggle-left')"
        :title="leftOpen ? 'Collapse Manuscript (Ctrl+B)' : 'Expand Manuscript'"
        id="toggle-left-sidebar"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="3" width="16" height="1.5" rx="1" fill="currentColor"/>
          <rect x="1" y="8.25" width="16" height="1.5" rx="1" fill="currentColor"/>
          <rect x="1" y="13.5" width="16" height="1.5" rx="1" fill="currentColor"/>
        </svg>
      </button>

      <!-- Brand Logo -->
      <router-link to="/app/studio" class="brand-logo" title="PenQraft Studio">
        <svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="10" fill="url(#logo-studio-hdr)"/>
          <path d="M11 25C14.5 24 16 19 18 13C20 18 21.5 23 25 25" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="18" cy="10" r="2" fill="#A78BFA"/>
          <defs>
            <linearGradient id="logo-studio-hdr" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stop-color="#6210CC"/>
              <stop offset="1" stop-color="#9333EA"/>
            </linearGradient>
          </defs>
        </svg>
        <span class="brand-text">pen<span class="brand-accent">q</span>raft</span>
      </router-link>

      <!-- Interactive Project Switcher Dropdown -->
      <div class="project-switcher-wrapper" ref="projectDropdownRef">
        <button
          class="project-switcher-btn"
          @click.stop="projectSwitcherOpen = !projectSwitcherOpen"
          :title="'Switch project: ' + (currentProject?.title || 'None')"
        >
          <span class="project-badge">{{ currentProject?.project_type?.label || currentProject?.project_type || 'Novel' }}</span>
          <span class="project-title">{{ currentProject?.title || 'Select Project' }}</span>
          <span class="tier-tag" v-if="currentProject?.model_tier">{{ currentProject.model_tier }}</span>
          <svg class="dropdown-chevron" :class="{ rotated: projectSwitcherOpen }" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>

        <transition name="dropdown-anim">
          <div v-if="projectSwitcherOpen" class="project-dropdown-menu" @click.stop>
            <div class="dropdown-section-title">Your Manuscripts</div>
            <div class="project-dropdown-list">
              <div
                v-for="p in projects"
                :key="p.id"
                class="project-dropdown-item"
                :class="{ active: currentProject && currentProject.id === p.id }"
                @click="onSelectProject(p)"
              >
                <div class="proj-item-info">
                  <div class="proj-item-title">{{ p.title }}</div>
                  <div class="proj-item-meta">
                    {{ p.project_type?.label || p.project_type || 'Novel' }} · {{ p.model_tier || 'balanced' }}
                  </div>
                </div>
                <span v-if="currentProject && currentProject.id === p.id" class="check-mark">✓</span>
              </div>
              <div v-if="projects.length === 0" class="empty-projects-msg">
                No saved projects found.
              </div>
            </div>

            <div class="project-dropdown-footer">
              <button class="dropdown-action-btn primary" @click="handleCreateNew">
                <span>+</span> New Project
              </button>
              <router-link to="/app/projects" class="dropdown-action-btn secondary" @click="projectSwitcherOpen = false">
                View All Projects &rarr;
              </router-link>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="header-right">
      <!-- Wallet pill -->
      <div class="wallet-pill" @click.stop="$emit('open-topup')" title="PenQraft Credits">
        <span class="credit-icon">🪙</span>
        <span class="credit-balance">{{ Number(wallet.balance_credits || 0).toLocaleString() }}</span>
        <span class="credit-usd hide-xs">(${{ Number(wallet.balance_usd || 0).toFixed(2) }})</span>
        <button class="topup-btn" aria-label="Top up credits">+</button>
      </div>

      <!-- User Profile Dropdown -->
      <div class="profile-wrapper" ref="profileDropdownRef">
        <div class="user-avatar-btn" @click.stop="profileOpen = !profileOpen">
          <span class="user-avatar">{{ userInitial }}</span>
          <span class="user-name hide-sm">{{ user.name || 'Author' }}</span>
          <svg class="chevron" :class="{ rotated: profileOpen }" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>

        <transition name="dropdown-anim">
          <div v-if="profileOpen" class="profile-dropdown" @click.stop>
            <div class="dropdown-header">
              <span class="dropdown-avatar">{{ userInitial }}</span>
              <div class="user-details">
                <div class="dropdown-name">{{ user.name || 'Author' }}</div>
                <div class="dropdown-email">{{ user.email || '' }}</div>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <router-link to="/app/profile" class="dropdown-item" @click="profileOpen = false">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7a3 3 0 100-6 3 3 0 000 6zm0 2c-3 0-6 1.5-6 4v1h12v-1c0-2.5-3-4-6-4z" fill="currentColor"/></svg>
              Author Profile
            </router-link>
            <router-link to="/app/wallet" class="dropdown-item" @click="profileOpen = false">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 3h12v8H1V3zm0-2h12v1H1V1zm10 5a1 1 0 100 2 1 1 0 000-2z" fill="currentColor"/></svg>
              Wallet &amp; Invoices
            </router-link>
            <router-link to="/app/settings" class="dropdown-item" @click="profileOpen = false">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" fill="currentColor"/><path d="M7 1v2m0 8v2M1 7h2m8 0h2m-2.2 4.8l-1.4-1.4M3.6 3.6L2.2 2.2m9.6 0l-1.4 1.4M3.6 10.4l-1.4 1.4" stroke="currentColor" stroke-width="1.2"/></svg>
              Studio Preferences
            </router-link>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item danger" @click="onSignOut">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2H12a1 1 0 011 1v8a1 1 0 01-1 1H9M6 10l4-3-4-3M10 7H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Sign Out
            </button>
          </div>
        </transition>
      </div>

      <!-- Right panel toggle -->
      <button
        class="panel-toggle"
        :class="{ active: rightOpen }"
        @click.stop="$emit('toggle-right')"
        :title="rightOpen ? 'Collapse Agent Deck (Ctrl+J)' : 'Expand Agent Deck'"
        id="toggle-right-sidebar"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="2.5" fill="currentColor"/>
          <path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M4.22 4.22l1.41 1.41M12.37 12.37l1.41 1.41M4.22 13.78l1.41-1.41M12.37 5.63l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({ name: 'Author', email: '', role: 'user' }),
  },
  wallet: {
    type: Object,
    default: () => ({ balance_credits: 0, balance_usd: 0 }),
  },
  currentProject: {
    type: Object,
    default: null,
  },
  projects: {
    type: Array,
    default: () => [],
  },
  leftOpen: {
    type: Boolean,
    default: true,
  },
  rightOpen: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'toggle-left',
  'toggle-right',
  'open-topup',
  'switch-project',
  'open-create-project',
  'sign-out',
])

const profileOpen = ref(false)
const projectSwitcherOpen = ref(false)
const profileDropdownRef = ref(null)
const projectDropdownRef = ref(null)

const userInitial = computed(() => {
  return props.user?.name ? props.user.name.charAt(0).toUpperCase() : 'A'
})

function onSelectProject(project) {
  emit('switch-project', project)
  projectSwitcherOpen.value = false
}

function handleCreateNew() {
  projectSwitcherOpen.value = false
  emit('open-create-project')
}

function onSignOut() {
  profileOpen.value = false
  emit('sign-out')
}

function handleDocumentClick(e) {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(e.target)) {
    profileOpen.value = false
  }
  if (projectDropdownRef.value && !projectDropdownRef.value.contains(e.target)) {
    projectSwitcherOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 14px;
  background: #120E22;
  border-bottom: 1px solid #2A224D;
  flex-shrink: 0;
  gap: 12px;
  z-index: 50;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: rgba(255,255,255,0.05);
  border: 1px solid #2A224D;
  border-radius: 8px;
  color: #A19EB7;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.panel-toggle:hover, .panel-toggle.active {
  background: rgba(98,16,204,0.25);
  border-color: #7C3AED;
  color: #FFF;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.brand-text {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #FFF;
  letter-spacing: -0.03em;
}
.brand-accent { color: #A78BFA; }

/* Project Switcher */
.project-switcher-wrapper {
  position: relative;
  border-left: 1px solid #2A224D;
  padding-left: 10px;
  margin-left: 4px;
}

.project-switcher-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.project-switcher-btn:hover {
  background: rgba(255,255,255,0.07);
  border-color: #2A224D;
}

.project-badge {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 5px;
  background: rgba(98,16,204,0.3);
  color: #C4B5FD;
  border: 1px solid rgba(124,58,237,0.4);
}

.project-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: #FFF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.tier-tag {
  font-size: 0.64rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(16,185,129,0.15);
  color: #10B981;
  border: 1px solid rgba(16,185,129,0.3);
  text-transform: uppercase;
}

.dropdown-chevron {
  color: #A19EB7;
  transition: transform 0.2s;
}
.dropdown-chevron.rotated {
  transform: rotate(180deg);
}

.project-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 10px;
  background: #1A1333;
  border: 1px solid #3B2D6B;
  border-radius: 12px;
  width: 280px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.7);
  z-index: 250;
  padding: 8px;
}

.dropdown-section-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #A78BFA;
  letter-spacing: 0.06em;
  padding: 6px 8px;
}

.project-dropdown-list {
  max-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.project-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.15s;
}
.project-dropdown-item:hover, .project-dropdown-item.active {
  background: rgba(98,16,204,0.25);
}

.proj-item-title {
  font-size: 0.84rem;
  font-weight: 600;
  color: #FFF;
}
.proj-item-meta {
  font-size: 0.7rem;
  color: #A19EB7;
}
.check-mark {
  color: #10B981;
  font-weight: bold;
}
.empty-projects-msg {
  font-size: 0.8rem;
  color: #635F7E;
  text-align: center;
  padding: 16px 8px;
}

.project-dropdown-footer {
  border-top: 1px solid #2A224D;
  margin-top: 8px;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dropdown-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: none;
  border: none;
  font-weight: 600;
}
.dropdown-action-btn.primary {
  background: linear-gradient(135deg, #6210CC, #7C3AED);
  color: #FFF;
}
.dropdown-action-btn.secondary {
  background: rgba(255,255,255,0.05);
  color: #EDE9FE;
  border: 1px solid #2A224D;
}
.dropdown-action-btn.secondary:hover {
  background: rgba(255,255,255,0.1);
  border-color: #7C3AED;
}

/* Wallet Pill */
.wallet-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(18,14,34,0.9);
  border: 1px solid #3B2D6B;
  padding: 5px 10px;
  border-radius: 18px;
  cursor: pointer;
  font-size: 0.83rem;
  transition: all 0.2s;
  white-space: nowrap;
}
.wallet-pill:hover { border-color: #7C3AED; }
.credit-balance { font-weight: 700; color: #FFF; }
.credit-usd { color: #A19EB7; font-size: 0.75rem; }
.topup-btn {
  background: #6210CC; border: none; color: #FFF;
  width: 16px; height: 16px; border-radius: 50%;
  font-size: 0.8rem; display: flex; align-items: center; justify-content: center; cursor: pointer;
}

/* Profile Dropdown */
.profile-wrapper { position: relative; }
.user-avatar-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.2s;
}
.user-avatar-btn:hover { background: rgba(255,255,255,0.06); border-color: #2A224D; }

.user-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, #6210CC, #9333EA);
  color: #FFF;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.82rem;
  flex-shrink: 0;
}
.user-name { font-size: 0.86rem; color: #EDE9FE; }
.chevron { color: #A19EB7; transition: transform 0.2s; }
.chevron.rotated { transform: rotate(180deg); }

.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #1A1333;
  border: 1px solid #3B2D6B;
  border-radius: 12px;
  padding: 8px;
  min-width: 220px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.6);
  z-index: 250;
}
.dropdown-header {
  display: flex; align-items: center; gap: 10px;
  padding: 8px; margin-bottom: 4px;
}
.dropdown-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #6210CC, #9333EA);
  color: #FFF; font-weight: 700; font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.user-details { overflow: hidden; }
.dropdown-name { font-weight: 700; font-size: 0.9rem; color: #FFF; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
.dropdown-email { font-size: 0.75rem; color: #A19EB7; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }

.dropdown-divider { height: 1px; background: #2A224D; margin: 6px 0; }

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 0.86rem;
  color: #D1C4FD;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
}
.dropdown-item:hover { background: rgba(255,255,255,0.07); color: #FFF; }
.dropdown-item.danger { color: #FCA5A5; }
.dropdown-item.danger:hover { background: rgba(239,68,68,0.12); color: #FFF; }

/* Dropdown Animation */
.dropdown-anim-enter-active, .dropdown-anim-leave-active { transition: all 0.18s ease; }
.dropdown-anim-enter-from, .dropdown-anim-leave-to { opacity: 0; transform: translateY(-6px); }

@media (max-width: 767px) {
  .project-switcher-wrapper { display: none; }
  .hide-sm { display: none; }
  .hide-xs { display: none; }
}
@media (max-width: 480px) {
  .brand-text { display: none; }
}
</style>
