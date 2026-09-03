<template>
  <div class="projects-view">
    <div class="view-header">
      <div class="header-titles">
        <h1 class="view-title serif">Manuscript Projects</h1>
        <p class="view-subtitle">Manage your long-form universes, active story arcs, and structural units.</p>
      </div>
      <button class="btn-create-proj" @click="showCreateModal = true">
        <span>+</span> Start New Project
      </button>
    </div>

    <!-- Quick Stats Bar -->
    <div class="stats-bar">
      <div class="stat-card">
        <span class="stat-label">Total Projects</span>
        <span class="stat-val">{{ projects.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Total Structural Units</span>
        <span class="stat-val">{{ totalUnits }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Estimated Words</span>
        <span class="stat-val">{{ totalWords.toLocaleString() }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner-large"></div>
      <p>Retrieving your manuscript archives…</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="projects.length === 0" class="empty-projects">
      <div class="empty-icon">📚</div>
      <h2 class="serif">No Manuscripts Yet</h2>
      <p>Launch your first novel, screenplay, or story collection with the 8-agent ensemble.</p>
      <button class="btn-create-proj" style="margin-top: 16px;" @click="showCreateModal = true">
        + Create First Project
      </button>
    </div>

    <!-- Projects Grid -->
    <div v-else class="projects-grid">
      <div
        v-for="proj in projects"
        :key="proj.id"
        class="project-card"
      >
        <div class="card-header">
          <span class="project-badge">{{ proj.project_type?.label || proj.project_type || 'Novel' }}</span>
          <span class="tier-tag">{{ proj.model_tier || 'balanced' }}</span>
        </div>

        <h3 class="serif project-title">{{ proj.title }}</h3>
        <p class="project-synopsis">
          {{ proj.synopsis || 'No synopsis logged. Ready for development in the studio.' }}
        </p>

        <div class="project-metrics">
          <div class="metric">
            <span class="metric-num">{{ proj.total_units || 0 }}</span>
            <span class="metric-name">Units</span>
          </div>
          <div class="metric">
            <span class="metric-num">{{ (proj.total_words || 0).toLocaleString() }}</span>
            <span class="metric-name">Words</span>
          </div>
          <div class="metric">
            <span class="metric-status" :class="proj.status || 'active'">● {{ proj.status || 'Active' }}</span>
          </div>
        </div>

        <div class="card-footer">
          <router-link :to="'/app/studio?project=' + proj.id" class="btn-open-studio">
            Open in Studio &rarr;
          </router-link>
        </div>
      </div>
    </div>

    <!-- Create Project Modal -->
    <CreateProjectModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @create="handleCreateProject"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiGet, apiPost } from '../../services/api'
import CreateProjectModal from '../../components/studio/modals/CreateProjectModal.vue'

const router = useRouter()
const projects = ref([])
const isLoading = ref(true)
const showCreateModal = ref(false)

const totalUnits = computed(() => {
  return projects.value.reduce((acc, p) => acc + (p.total_units || 0), 0)
})

const totalWords = computed(() => {
  return projects.value.reduce((acc, p) => acc + (p.total_words || 0), 0)
})

async function fetchProjects() {
  isLoading.value = true
  try {
    const res = await apiGet('/api/v1/projects')
    projects.value = res?.data || []
  } catch (err) {
    console.error('Failed to fetch projects:', err)
  } finally {
    isLoading.value = false
  }
}

async function handleCreateProject(formData) {
  try {
    const res = await apiPost('/api/v1/projects', formData)
    if (res?.data) {
      showCreateModal.value = false
      router.push(`/app/studio?project=${res.data.id}`)
    }
  } catch (err) {
    alert(err.message || 'Failed to create project.')
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.projects-view {
  padding: 36px 40px;
  background-color: #090611;
  min-height: 100vh;
  color: #FDFBF7;
  overflow-y: auto;
}

.serif { font-family: 'Fraunces', Georgia, serif; }

.view-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.view-title {
  font-size: 2rem;
  font-weight: 700;
  color: #FFF;
  margin-bottom: 6px;
}
.view-subtitle {
  color: #A19EB7;
  font-size: 0.95rem;
}

.btn-create-proj {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  background: linear-gradient(135deg, #6210CC, #7C3AED);
  color: #FFF;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(98, 16, 204, 0.4);
}
.btn-create-proj:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(98, 16, 204, 0.6);
}

/* Stats Bar */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}
.stat-card {
  background: rgba(18, 14, 34, 0.7);
  border: 1px solid #2A224D;
  border-radius: 12px;
  padding: 16px 20px;
}
.stat-label {
  display: block;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #A78BFA;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}
.stat-val {
  font-size: 1.6rem;
  font-weight: 800;
  color: #FFF;
}

/* Loading & Empty */
.loading-state, .empty-projects {
  text-align: center;
  padding: 60px 20px;
  color: #A19EB7;
}
.spinner-large {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top-color: #7C3AED;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-icon { font-size: 3rem; margin-bottom: 12px; }
.empty-projects h2 { font-size: 1.5rem; color: #FFF; margin-bottom: 8px; }
.empty-projects p { font-size: 0.92rem; max-width: 440px; margin: 0 auto; }

/* Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.project-card {
  background: rgba(18, 14, 34, 0.85);
  border: 1px solid #2A224D;
  border-radius: 14px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.25s ease;
}
.project-card:hover {
  border-color: #7C3AED;
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(98, 16, 204, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.project-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 5px;
  background: rgba(98, 16, 204, 0.3);
  color: #C4B5FD;
  border: 1px solid rgba(124, 58, 237, 0.4);
}
.tier-tag {
  font-size: 0.68rem;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  text-transform: uppercase;
}

.project-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #FFF;
  margin-bottom: 8px;
}
.project-synopsis {
  font-size: 0.86rem;
  color: #A19EB7;
  line-height: 1.5;
  margin-bottom: 18px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-metrics {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid #2A224D;
  border-bottom: 1px solid #2A224D;
  margin-bottom: 16px;
}
.metric {
  display: flex;
  flex-direction: column;
}
.metric-num {
  font-weight: 700;
  font-size: 0.95rem;
  color: #FFF;
}
.metric-name {
  font-size: 0.68rem;
  color: #A19EB7;
}
.metric-status {
  font-size: 0.72rem;
  font-weight: 600;
  color: #34D399;
}

.btn-open-studio {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  background: rgba(98, 16, 204, 0.2);
  border: 1px solid rgba(124, 58, 237, 0.4);
  color: #EDE9FE;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.86rem;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-open-studio:hover {
  background: #7C3AED;
  color: #FFF;
}

@media (max-width: 640px) {
  .projects-view { padding: 20px 16px; }
  .view-title { font-size: 1.6rem; }
}
</style>
