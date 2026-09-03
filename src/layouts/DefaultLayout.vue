<template>
  <div class="site-wrapper">
    <!-- Navigation Header -->
    <header class="site-header">
      <div class="container">
        <div class="header-inner">
          <router-link to="/" class="brand-logo">
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="10" fill="url(#logo-grad)" />
              <path d="M11 25C14.5 24 16 19 18 13C20 18 21.5 23 25 25" stroke="white" stroke-width="2.5" stroke-linecap="round" />
              <circle cx="18" cy="10" r="2" fill="#A78BFA" />
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#6210CC" />
                  <stop offset="1" stop-color="#9333EA" />
                </linearGradient>
              </defs>
            </svg>
            <div class="brand-wordmark">
              <span>pen<span class="accent">Q</span>raft</span>
            </div>
          </router-link>

          <nav class="desktop-nav">
            <router-link to="/" class="nav-link">Platform</router-link>
            <a href="/#agents" class="nav-link">Agent System</a>
            <a href="/#bible" class="nav-link">Story Bible</a>
            <router-link to="/pricing" class="nav-link">Economics</router-link>
            <a href="/#faq" class="nav-link">FAQ</a>
          </nav>

          <div class="header-actions">
            <template v-if="isAuthenticated">
              <router-link to="/app" class="btn-primary" style="padding: 9px 18px; font-size: 0.9rem;">
                Open Studio &rarr;
              </router-link>
            </template>
            <template v-else>
              <router-link to="/login" class="nav-link" style="margin-right: 6px;">Sign In</router-link>
              <router-link to="/register" class="btn-primary" style="padding: 9px 18px; font-size: 0.9rem;">
                Get Started Free
              </router-link>
            </template>

            <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle Navigation">
              &#9776;
            </button>
          </div>
        </div>
      </div>

      <div class="mobile-nav-drawer" :class="{ active: mobileMenuOpen }">
        <router-link to="/" class="nav-link" @click="mobileMenuOpen = false">Platform</router-link>
        <a href="/#agents" class="nav-link" @click="mobileMenuOpen = false">8-Agent System</a>
        <a href="/#bible" class="nav-link" @click="mobileMenuOpen = false">Story Bible</a>
        <router-link to="/pricing" class="nav-link" @click="mobileMenuOpen = false">Economics</router-link>
        <a href="/#faq" class="nav-link" @click="mobileMenuOpen = false">FAQ</a>
        <div style="height: 1px; background: rgba(42, 34, 77, 0.6); margin: 6px 0;"></div>
        <template v-if="isAuthenticated">
          <router-link to="/app" class="btn-primary" @click="mobileMenuOpen = false">Open Studio &rarr;</router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link" @click="mobileMenuOpen = false">Sign In</router-link>
          <router-link to="/register" class="btn-primary" @click="mobileMenuOpen = false">Get Started Free</router-link>
        </template>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="brand-wordmark" style="font-size: 1.5rem; margin-bottom: 12px;">
              <span>pen<span class="accent">Q</span>raft</span>
            </div>
            <p style="color: var(--color-text-muted); font-size: 0.9rem; line-height: 1.6; max-width: 320px;">
              The multi-agent collaborative intelligence platform engineered for long-form narrative craft.
            </p>
          </div>

          <div class="footer-col">
            <h4>Architecture</h4>
            <a href="/#agents">Agent Pipeline</a>
            <a href="/#bible">Story Bible</a>
            <a href="/#evaluator">Evaluator Loop</a>
            <a href="/#formats">Manuscript Exports</a>
          </div>

          <div class="footer-col">
            <h4>Economics</h4>
            <router-link to="/pricing">Pricing & Credits</router-link>
            <a href="/pricing#models">Model Tiers</a>
            <a href="/pricing#topup">Volume Top-ups</a>
          </div>

          <div class="footer-col">
            <h4>Platform</h4>
            <router-link to="/login">Author Sign In</router-link>
            <router-link to="/register">Create Account</router-link>
            <router-link to="/app">Studio Workspace</router-link>
          </div>
        </div>

        <div class="footer-bottom">
          <div>&copy; {{ new Date().getFullYear() }} PenQraft Inc. Built with Spinx Framework.</div>
          <div style="display: flex; gap: 16px;">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../services/auth'

const { isAuthenticated } = useAuth()
const mobileMenuOpen = ref(false)
</script>

<style scoped>
.site-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  background-image:
    radial-gradient(ellipse at 50% -10%, rgba(98, 16, 204, 0.35) 0%, transparent 65%),
    radial-gradient(circle at 90% 25%, rgba(124, 58, 237, 0.15) 0%, transparent 45%),
    radial-gradient(circle at 10% 65%, rgba(98, 16, 204, 0.12) 0%, transparent 45%),
    radial-gradient(ellipse at 50% 100%, rgba(98, 16, 204, 0.18) 0%, transparent 60%);
  background-attachment: fixed;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 640px) {
  .container {
    padding: 0 16px;
  }
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(42, 34, 77, 0.6);
  background: rgba(9, 6, 17, 0.9);
  width: 100%;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: 16px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-wordmark {
  font-family: var(--font-serif);
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #FFFFFF;
}

.brand-wordmark .accent {
  color: var(--color-accent);
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-link {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
}

.nav-link:hover {
  color: #FFFFFF;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: #FFFFFF !important;
  font-family: var(--font-sans);
  font-weight: 600;
  padding: 12px 26px;
  border-radius: 10px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px var(--color-primary-glow);
  transition: all 0.25s ease;
  white-space: nowrap;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(98, 16, 204, 0.6);
  background: linear-gradient(135deg, #7014EA, #8B5CF6);
}

.mobile-menu-btn {
  display: none;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-surface-border);
  color: var(--color-text-main);
  font-size: 1.4rem;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
}

.mobile-nav-drawer {
  display: none;
  flex-direction: column;
  gap: 14px;
  padding: 16px 20px 24px 20px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-surface-border);
}

.mobile-nav-drawer.active {
  display: flex;
}

@media (max-width: 920px) {
  .desktop-nav {
    display: none;
  }
  .mobile-menu-btn {
    display: flex;
  }
}

.main-content {
  flex: 1;
  width: 100%;
}

.site-footer {
  border-top: 1px solid var(--color-surface-border);
  background: rgba(10, 7, 18, 0.95);
  padding: 60px 0 30px 0;
  margin-top: 60px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}

@media (max-width: 800px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}

@media (max-width: 500px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-col h4 {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 700;
  color: #FFFFFF;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.footer-col a {
  color: var(--color-text-muted);
  font-size: 0.88rem;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-col a:hover {
  color: #FFFFFF;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid rgba(42, 34, 77, 0.5);
  font-size: 0.82rem;
  color: var(--color-text-faint);
  flex-wrap: wrap;
  gap: 12px;
}
</style>
