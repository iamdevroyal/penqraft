<template>
  <div class="penqraft-app">
    <!-- Top Header with Project Switcher & Wallet -->
    <StudioHeader
      :user="user"
      :wallet="wallet"
      :current-project="currentProject"
      :projects="projects"
      :left-open="leftOpen"
      :right-open="rightOpen"
      @toggle-left="leftOpen = !leftOpen"
      @toggle-right="rightOpen = !rightOpen"
      @open-topup="showTopupModal = true"
      @switch-project="handleSwitchProject"
      @open-create-project="showCreateProjectModal = true"
      @sign-out="handleSignOut"
    />

    <!-- Version History Slide-down Drawer (above layout when active) -->
    <VersionHistoryPanel
      :is-open="showHistoryPanel"
      :versions="versionHistory"
      :unit-title="selectedUnit?.title"
      :is-loading="isLoadingHistory"
      @close="showHistoryPanel = false"
      @restore-version="handleRestoreVersion"
    />

    <!-- 3-Panel Flexible Studio Layout -->
    <!-- When leftOpen is false or rightOpen is false, editor-canvas expands dynamically to fill 100% -->
    <div class="studio-layout">
      <!-- Left Panel: Manuscript Tree & Story Bible -->
      <transition name="slide-left">
        <ManuscriptSidebar
          v-show="leftOpen"
          :structural-units="structuralUnits"
          :story-bible-entries="storyBibleEntries"
          :selected-unit="selectedUnit"
          :is-mobile="isMobile"
          @select-unit="selectUnit"
          @add-unit="addStructuralUnit"
          @open-add-bible="showAddBibleModal = true"
          @close="leftOpen = false"
        />
      </transition>

      <!-- Mobile overlay for left drawer -->
      <div v-if="isMobile && leftOpen" class="drawer-overlay" @click="leftOpen = false"></div>

      <!-- Center Panel: Auto-expanding Literary Editor Canvas -->
      <EditorCanvas
        v-model="editorContent"
        :selected-unit="selectedUnit"
        :structural-units="structuralUnits"
        :active-word-count="activeWordCount"
        :is-saving="isSaving"
        :version-count="versionHistory.length"
        :active-rubric-score="activeRubricScore"
        :wallet="wallet"
        @save-title="saveUnitTitle"
        @save-draft="saveDraft"
        @clear-editor="clearEditor"
        @toggle-history="toggleVersionHistory"
        @add-unit="addStructuralUnit"
        @open-create-project="showCreateProjectModal = true"
        @dismiss-rubric="activeRubricScore = null"
      />

      <!-- Mobile overlay for right drawer -->
      <div v-if="isMobile && rightOpen" class="drawer-overlay" @click="rightOpen = false"></div>

      <!-- Right Panel: 8-Agent Command Deck -->
      <transition name="slide-right">
        <AgentDeck
          v-show="rightOpen"
          :agent-list="agentList"
          v-model:active-agent-key="activeAgentKey"
          v-model:prompt-input="agentPromptInput"
          :is-running-agent="isRunningAgent"
          :is-streaming="isStreaming"
          :streaming-content="streamingContent"
          :latest-agent-output="latestAgentOutput"
          :is-mobile="isMobile"
          @execute-agent="executeActiveAgent"
          @approve-output="approveAgentOutput"
          @reject-output="rejectAgentOutput"
          @close="rightOpen = false"
        />
      </transition>
    </div>

    <!-- Modals -->
    <CreateProjectModal
      :show="showCreateProjectModal"
      @close="showCreateProjectModal = false"
      @create="createProject"
    />

    <TopupModal
      :show="showTopupModal"
      :is-submitting="isToppingUp"
      @close="showTopupModal = false"
      @topup="topupAmount"
    />

    <AddBibleModal
      :show="showAddBibleModal"
      @close="showAddBibleModal = false"
      @save="saveBibleEntry"
    />

    <ExportPanel
      :is-open="showExportPanel"
      :project-id="currentProject?.id"
      @close="showExportPanel = false"
    />

    <ConfirmModal
      :show="showClearConfirm"
      title="Start Fresh Project?"
      message="This will deselect the current project and clear the canvas. Your saved manuscripts and balance remain safe in your account."
      confirm-text="Start Fresh"
      @close="showClearConfirm = false"
      @confirm="confirmClear"
    />

    <!-- Global Toast Notifications -->
    <ToastNotification
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @close="toast.visible = false"
    />
  </div>
</template>

<script>
import { apiGet, apiPost, apiPatch, setAuthToken, streamAgentOutput } from '../services/api'
import StudioHeader from '../components/studio/StudioHeader.vue'
import ManuscriptSidebar from '../components/studio/ManuscriptSidebar.vue'
import EditorCanvas from '../components/studio/EditorCanvas.vue'
import AgentDeck from '../components/studio/AgentDeck.vue'
import VersionHistoryPanel from '../components/studio/VersionHistoryPanel.vue'
import ExportPanel from '../components/studio/ExportPanel.vue'
import ToastNotification from '../components/studio/ToastNotification.vue'
import CreateProjectModal from '../components/studio/modals/CreateProjectModal.vue'
import TopupModal from '../components/studio/modals/TopupModal.vue'
import AddBibleModal from '../components/studio/modals/AddBibleModal.vue'
import ConfirmModal from '../components/studio/modals/ConfirmModal.vue'

export default {
  name: 'PenqraftStudio',
  components: {
    StudioHeader,
    ManuscriptSidebar,
    EditorCanvas,
    AgentDeck,
    VersionHistoryPanel,
    ExportPanel,
    ToastNotification,
    CreateProjectModal,
    TopupModal,
    AddBibleModal,
    ConfirmModal,
  },
  data() {
    return {
      // User & Billing
      user: { id: null, name: 'Author', email: '', role: 'user' },
      wallet: { balance_credits: 5000, balance_usd: 5.0 },

      // Projects & Units
      projects: [],
      currentProject: null,
      structuralUnits: [],
      selectedUnit: null,
      editorContent: '',
      activeWordCount: 0,

      // Story Bible
      storyBibleEntries: [],

      // Agent Deck
      activeAgentKey: 'drafting',
      agentPromptInput: '',
      isRunningAgent: false,
      isStreaming: false,
      streamingContent: '',
      latestAgentOutput: null,
      activeRubricScore: null,

      // History & Draft State
      isSaving: false,
      showHistoryPanel: false,
      isLoadingHistory: false,
      versionHistory: [],

      // UI Layout state
      leftOpen: true,
      rightOpen: true,
      isMobile: false,

      // Modals
      showTopupModal: false,
      isToppingUp: false,
      showCreateProjectModal: false,
      showAddBibleModal: false,
      showExportPanel: false,
      showClearConfirm: false,

      // Toast system
      toast: {
        visible: false,
        message: '',
        type: 'info',
        timeout: null,
      },

      agentList: [
        { key: 'concept',        icon: '💡', name: 'Concept',     role: 'Themes & Comps',      description: 'Architects overarching narrative arguments, core conflicts, and literary hooks.', placeholder: 'Refine the core central dramatic question for this scene…' },
        { key: 'structure',      icon: '📐', name: 'Structure',   role: 'Beats & Pacing',      description: 'Constructs beat sheets, turning points, and chapter word count trajectories.', placeholder: 'Outline 5 key scene beats building toward the confrontation…' },
        { key: 'character_world',icon: '🎭', name: 'Character',   role: 'Psychology & Lore',   description: 'Develops flaws, desire-vs-need psychology, and sensory textures.', placeholder: 'Deepen the protagonist internal conflict during this exchange…' },
        { key: 'drafting',       icon: '✍️', name: 'Drafting',   role: 'Prose Generation',    description: 'Generates publication-grade prose strictly conditioned on the Story Bible.', placeholder: 'Draft the tense confrontation in the rain at the top of the High Spire…' },
        { key: 'continuity',     icon: '📜', name: 'Continuity', role: 'Canon Auditor',       description: 'Cross-references drafts against the Story Bible to prevent plot contradictions.', placeholder: 'Audit this scene for timeline or character appearance errors…' },
        { key: 'editorial',      icon: '⚖️', name: 'Editorial',  role: 'Rubric Evaluator',    description: 'Evaluates prose on craft, voice, pacing, and emotional resonance.', placeholder: 'Score the dialogue authenticity and sensory immersion…' },
        { key: 'style_voice',    icon: '🎻', name: 'Style',      role: 'Syntactic Rhythm',    description: 'Maintains authorial voice fingerprint, sentence cadence, and tone consistency.', placeholder: 'Elevate the metaphorical texture to match literary gothic fantasy…' },
        { key: 'export',         icon: '📦', name: 'Export',     role: 'Typesetting',         description: 'Compiles units into Standard Manuscript Format Markdown or Fountain.', placeholder: 'Format current project chapters for publication submission…' },
      ],
    }
  },

  watch: {
    editorContent(newVal) {
      this.updateWordCount(newVal)
    },
  },

  async mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)

    if (this.isMobile) {
      this.leftOpen = false
      this.rightOpen = false
    }

    await this.fetchUserData()
    await this.fetchProjects()
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
    if (this.toast.timeout) clearTimeout(this.toast.timeout)
  },

  methods: {
    showToast(message, type = 'info') {
      if (this.toast.timeout) clearTimeout(this.toast.timeout)
      this.toast.message = message
      this.toast.type = type
      this.toast.visible = true
      this.toast.timeout = setTimeout(() => {
        this.toast.visible = false
      }, 4000)
    },

    checkMobile() {
      this.isMobile = window.innerWidth < 768
    },

    handleSignOut() {
      setAuthToken(null)
      this.$router.push('/login')
    },

    async fetchUserData() {
      try {
        const userRes = await apiGet('/api/v1/auth/me')
        if (userRes?.user) {
          this.user = userRes.user
        }
      } catch (err) {
        console.warn('Using default auth profile.')
      }

      try {
        const walletRes = await apiGet('/api/v1/wallet')
        const wData = walletRes?.data || walletRes?.wallet
        if (wData) {
          this.wallet.balance_credits = Number(wData.balance_credits ?? walletRes.balance_credits ?? 0)
          this.wallet.balance_usd = Number(wData.balance_usd ?? walletRes.balance_usd ?? (this.wallet.balance_credits / 1000))
        }
      } catch (err) {
        console.warn('Default wallet used.')
      }
    },

    async fetchProjects() {
      try {
        const res = await apiGet('/api/v1/projects')
        this.projects = res?.data || []

        // Check if route has ?project=ID
        const queryProjectId = this.$route?.query?.project
        let targetProject = null
        if (queryProjectId) {
          targetProject = this.projects.find(p => String(p.id) === String(queryProjectId))
        }

        if (!targetProject && this.projects.length > 0) {
          targetProject = this.projects[0]
        }

        if (targetProject) {
          await this.loadProject(targetProject)
        }
      } catch (err) {
        console.warn('No active projects fetched.', err)
      }
    },

    async loadProject(project) {
      this.currentProject = project
      this.structuralUnits = []
      this.selectedUnit = null
      this.editorContent = ''
      this.storyBibleEntries = []
      this.versionHistory = []
      this.latestAgentOutput = null
      this.activeRubricScore = null

      try {
        // Fetch structural units
        const unitsRes = await apiGet(`/api/v1/projects/${project.id}/structural-units`)
        if (unitsRes?.data && unitsRes.data.length > 0) {
          this.structuralUnits = unitsRes.data
          this.selectUnit(this.structuralUnits[0])
        }

        // Fetch Story Bible canon entries
        const bibleRes = await apiGet(`/api/v1/projects/${project.id}/continuity/entries`)
        if (bibleRes?.data) {
          this.storyBibleEntries = bibleRes.data
        }
      } catch (err) {
        console.error('Error loading project details:', err)
      }
    },

    handleSwitchProject(project) {
      this.loadProject(project)
      this.showToast(`Switched to "${project.title}"`, 'info')
    },

    selectUnit(unit) {
      this.selectedUnit = unit
      // Load content from latest version if available
      this.editorContent = unit.latest_version?.content || ''
      this.updateWordCount(this.editorContent)
      this.fetchVersionHistory(unit.id)

      if (this.isMobile) this.leftOpen = false
    },

    updateWordCount(content) {
      if (!content) {
        this.activeWordCount = 0
        return
      }
      const words = content.trim().split(/\s+/)
      this.activeWordCount = words.filter(w => w.length > 0).length
      if (this.selectedUnit) {
        this.selectedUnit.word_count = this.activeWordCount
      }
    },

    async saveUnitTitle(newTitle) {
      if (!this.selectedUnit || !newTitle.trim()) return
      this.selectedUnit.title = newTitle.trim()

      try {
        await apiPatch(`/api/v1/structural-units/${this.selectedUnit.id}`, {
          title: this.selectedUnit.title,
        })
        this.showToast('Chapter title updated.', 'success')
      } catch (err) {
        this.showToast('Failed to save chapter title.', 'error')
      }
    },

    async saveDraft() {
      if (!this.selectedUnit) return
      this.isSaving = true

      try {
        const res = await apiPatch(`/api/v1/structural-units/${this.selectedUnit.id}`, {
          content: this.editorContent,
          title: this.selectedUnit.title,
          status: 'revised',
        })

        if (res?.data) {
          this.selectedUnit.status = 'revised'
          this.selectedUnit.word_count = res.data.word_count || this.activeWordCount
        }
        await this.fetchVersionHistory(this.selectedUnit.id)
        this.showToast('Draft saved successfully.', 'success')
      } catch (err) {
        this.showToast(err.message || 'Failed to save draft.', 'error')
      } finally {
        this.isSaving = false
      }
    },

    clearEditor() {
      this.editorContent = ''
    },

    async addStructuralUnit() {
      if (!this.currentProject) {
        this.showCreateProjectModal = true
        return
      }

      const nextNum = this.structuralUnits.length + 1
      const defaultTitle = `Chapter ${nextNum}: Untitled`

      try {
        const res = await apiPost(`/api/v1/projects/${this.currentProject.id}/structural-units`, {
          title: defaultTitle,
          type: 'chapter',
        })

        if (res?.data) {
          this.structuralUnits.push(res.data)
          this.selectUnit(res.data)
          this.showToast(`Created ${res.data.title}`, 'success')
        }
      } catch (err) {
        this.showToast(err.message || 'Failed to create chapter.', 'error')
      }
    },

    async createProject(projectData) {
      try {
        const res = await apiPost('/api/v1/projects', projectData)
        if (res?.data) {
          this.projects.unshift(res.data)
          this.showCreateProjectModal = false
          await this.loadProject(res.data)
          this.showToast(`Created project "${res.data.title}"`, 'success')
          // Add first chapter automatically
          await this.addStructuralUnit()
        }
      } catch (err) {
        this.showToast(err.message || 'Failed to create project.', 'error')
      }
    },

    async executeActiveAgent() {
      if (!this.currentProject) {
        this.showCreateProjectModal = true
        return
      }

      // Handle Export Agent separately
      if (this.activeAgentKey === 'export') {
        this.showExportPanel = true
        return
      }

      this.isRunningAgent = true
      this.isStreaming = false
      this.streamingContent = ''
      this.latestAgentOutput = null
      this.activeRubricScore = null

      try {
        const payload = {
          agent_key: this.activeAgentKey,
          prompt: this.agentPromptInput || 'Execute standard craft pass for this unit.',
          content: this.editorContent,
          structural_unit_id: this.selectedUnit ? this.selectedUnit.id : null,
        }

        const resData = await apiPost(
          `/api/v1/projects/${this.currentProject.id}/agents/${this.activeAgentKey}/run`,
          payload
        )

        if (resData?.data) {
          this.latestAgentOutput = resData.data

          // Handle Rubric evaluation if present
          if (resData.data.editorial_rubric) {
            this.activeRubricScore = resData.data.editorial_rubric
          } else if (resData.data.rubric_score) {
            this.activeRubricScore = resData.data.rubric_score
          }

          // Deduct credits if charged
          const charged = Number(resData.data.credits_charged || 18)
          if (this.wallet.balance_credits >= charged) {
            this.wallet.balance_credits -= charged
            this.wallet.balance_usd = +(this.wallet.balance_credits / 1000).toFixed(2)
          }

          this.showToast(`${this.selectedAgentName} pass complete (${charged} credits).`, 'success')
        }
      } catch (err) {
        this.showToast(err.message || 'Agent orchestration encountered an error.', 'error')
      } finally {
        this.isRunningAgent = false
      }
    },

    async approveAgentOutput(outputId) {
      if (!outputId) return
      try {
        const res = await apiPost(`/api/v1/agent-outputs/${outputId}/approve`)
        if (this.latestAgentOutput?.content) {
          this.editorContent += (this.editorContent ? '\n\n' : '') + this.latestAgentOutput.content
          this.latestAgentOutput.status = 'approved'
          await this.saveDraft()
          this.showToast('Output approved and committed to draft.', 'success')
        }
      } catch (err) {
        this.showToast(err.message || 'Failed to approve output.', 'error')
      }
    },

    async rejectAgentOutput(outputId) {
      if (!outputId) return
      try {
        await apiPost(`/api/v1/agent-outputs/${outputId}/reject`)
        if (this.latestAgentOutput) {
          this.latestAgentOutput.status = 'rejected'
        }
        this.showToast('Agent output rejected.', 'info')
      } catch (err) {
        this.showToast(err.message || 'Failed to reject output.', 'error')
      }
    },

    async saveBibleEntry(entryData) {
      if (!this.currentProject) return
      try {
        const res = await apiPost(`/api/v1/projects/${this.currentProject.id}/continuity/entries`, {
          ...entryData,
          first_referenced_unit_id: this.selectedUnit?.id || null,
        })
        if (res?.data) {
          this.storyBibleEntries.unshift(res.data)
          this.showAddBibleModal = false
          this.showToast(`Logged canon: ${res.data.key}`, 'success')
        }
      } catch (err) {
        this.showToast(err.message || 'Failed to save Story Bible entry.', 'error')
      }
    },

    async fetchVersionHistory(unitId) {
      if (!unitId) return
      try {
        const res = await apiGet(`/api/v1/structural-units/${unitId}/versions`)
        this.versionHistory = res?.data || []
      } catch {
        this.versionHistory = []
      }
    },

    async toggleVersionHistory() {
      if (!this.selectedUnit) return
      this.showHistoryPanel = !this.showHistoryPanel
      if (this.showHistoryPanel) {
        this.isLoadingHistory = true
        await this.fetchVersionHistory(this.selectedUnit.id)
        this.isLoadingHistory = false
      }
    },

    handleRestoreVersion(version) {
      if (!version?.content) return
      this.editorContent = version.content
      this.showToast(`Restored version v${version.version_number}`, 'success')
      this.showHistoryPanel = false
      this.saveDraft()
    },

    async topupAmount(usd) {
      this.isToppingUp = true
      try {
        const res = await apiPost('/api/v1/wallet/topup', { amount_usd: Number(usd) })
        const wData = res?.data || res?.wallet
        if (wData) {
          this.wallet.balance_credits = Number(wData.balance_credits ?? (this.wallet.balance_credits + usd * 1000))
          this.wallet.balance_usd = Number(wData.balance_usd ?? (this.wallet.balance_usd + usd))
        } else {
          this.wallet.balance_credits += usd * 1000
          this.wallet.balance_usd += usd
        }
        this.showTopupModal = false
        this.showToast(`Added $${Number(usd).toFixed(2)} USD (${Number(usd * 1000).toLocaleString()} Credits).`, 'success')
      } catch (err) {
        this.showToast(err.message || 'Top up transaction failed.', 'error')
      } finally {
        this.isToppingUp = false
      }
    },

    confirmClear() {
      this.currentProject = null
      this.structuralUnits = []
      this.selectedUnit = null
      this.editorContent = ''
      this.storyBibleEntries = []
      this.versionHistory = []
      this.latestAgentOutput = null
      this.showClearConfirm = false
      this.showToast('Workspace cleared.', 'info')
    },
  },

  computed: {
    selectedAgentName() {
      const agent = this.agentList.find(a => a.key === this.activeAgentKey)
      return agent ? agent.name : 'Agent'
    },
  },
}
</script>

<style scoped>
.penqraft-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #090611;
  color: #FDFBF7;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  position: relative;
}

/* Fluid Flexbox Layout: Center canvas expands automatically to 100% when either side is hidden */
.studio-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  width: 100%;
  min-height: 0;
}

/* Slide Transitions for Panels */
.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-left-enter-from, .slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.drawer-overlay {
  position: fixed;
  inset: 56px 0 0 0;
  background: rgba(0,0,0,0.6);
  z-index: 90;
  backdrop-filter: blur(3px);
}
</style>
