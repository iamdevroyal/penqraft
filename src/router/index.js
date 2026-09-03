import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import PricingView from '../views/PricingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import StudioView from '../views/StudioView.vue'
import AppShellLayout from '../layouts/AppShellLayout.vue'
import ProjectsView from '../views/app/ProjectsView.vue'
import WalletView from '../views/app/WalletView.vue'
import ProfileView from '../views/app/ProfileView.vue'
import SettingsView from '../views/app/SettingsView.vue'
import { getAuthToken } from '../services/api'

const routes = [
  {
    path: '/',
    name: 'home',
    component: LandingView,
    meta: { title: 'PenQraft — Multi-Agent AI Long-Form Craft' },
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: PricingView,
    meta: { title: 'Pricing & Economics — PenQraft Studio' },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Sign In — PenQraft Studio', guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { title: 'Create Account — PenQraft Studio', guestOnly: true },
  },
  {
    path: '/app',
    component: AppShellLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/app/studio',
      },
      {
        path: 'studio',
        name: 'studio',
        component: StudioView,
        meta: { title: 'PenQraft Studio — Workspace', requiresAuth: true },
      },
      {
        path: 'projects',
        name: 'projects',
        component: ProjectsView,
        meta: { title: 'Manuscript Projects — PenQraft', requiresAuth: true },
      },
      {
        path: 'wallet',
        name: 'wallet',
        component: WalletView,
        meta: { title: 'Wallet & Billing — PenQraft', requiresAuth: true },
      },
      {
        path: 'profile',
        name: 'profile',
        component: ProfileView,
        meta: { title: 'Author Profile — PenQraft', requiresAuth: true },
      },
      {
        path: 'settings',
        name: 'settings',
        component: SettingsView,
        meta: { title: 'Studio Settings — PenQraft', requiresAuth: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const token = getAuthToken()

  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (to.meta.requiresAuth && !token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guestOnly && token) {
    next({ name: 'studio' })
    return
  }

  next()
})

export default router
