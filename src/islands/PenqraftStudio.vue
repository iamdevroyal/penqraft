<template>
  <div class="penqraft-app" @click="closeDropdowns">

    <!-- ===================== HEADER ===================== -->
    <header class="app-header">
      <div class="header-left">
        <!-- Left panel toggle -->
        <button class="panel-toggle" @click.stop="leftOpen = !leftOpen" :title="leftOpen ? 'Hide Sidebar' : 'Show Sidebar'">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="3" width="16" height="1.5" rx="1" fill="currentColor"/>
            <rect x="1" y="8.25" width="16" height="1.5" rx="1" fill="currentColor"/>
            <rect x="1" y="13.5" width="16" height="1.5" rx="1" fill="currentColor"/>
          </svg>
        </button>

        <!-- Inline SVG Logo -->
        <router-link to="/" class="brand-logo" title="PenQraft Home">
          <svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="10" fill="url(#logo-studio)"/>
            <path d="M11 25C14.5 24 16 19 18 13C20 18 21.5 23 25 25" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="18" cy="10" r="2" fill="#A78BFA"/>
            <defs>
              <linearGradient id="logo-studio" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stop-color="#6210CC"/>
                <stop offset="1" stop-color="#9333EA"/>
              </linearGradient>
            </defs>
          </svg>
          <span class="brand-text">pen<span class="brand-accent">q</span>raft</span>
        </router-link>

        <!-- Project info (desktop only) -->
        <div class="project-switcher" v-if="currentProject">
          <span class="project-badge">{{ currentProject.project_type?.label || 'Novel' }}</span>
          <h2 class="project-title">{{ currentProject.title }}</h2>
          <span class="tier-tag">{{ currentProject.model_tier }}</span>
        </div>
      </div>

      <div class="header-right">
        <!-- Wallet pill -->
        <div class="wallet-pill" @click.stop="showTopupModal = true">
          <span class="credit-icon">🪙</span>
          <span class="credit-balance">{{ wallet.balance_credits.toLocaleString() }}</span>
          <span class="credit-usd hide-xs">(${{ wallet.balance_usd.toFixed(2) }})</span>
          <button class="topup-btn" aria-label="Top up credits">+</button>
        </div>

        <!-- Profile dropdown -->
        <div class="profile-wrapper" @click.stop="profileOpen = !profileOpen">
          <div class="user-avatar-btn">
            <span class="user-avatar">{{ userInitial }}</span>
            <span class="user-name hide-sm">{{ user.name || 'Author' }}</span>
            <svg class="chevron" :class="{ rotated: profileOpen }" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>

          <transition name="dropdown">
            <div v-if="profileOpen" class="profile-dropdown" @click.stop>
              <div class="dropdown-header">
                <span class="dropdown-avatar">{{ userInitial }}</span>
                <div>
                  <div class="dropdown-name">{{ user.name || 'Author' }}</div>
                  <div class="dropdown-email">{{ user.email || '' }}</div>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click="clearWorkspace">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M2 12L12 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                New Fresh Project
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item danger" @click="handleSignOut">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2H12a1 1 0 011 1v8a1 1 0 01-1 1H9M6 10l4-3-4-3M10 7H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Sign Out
              </button>
            </div>
          </transition>
        </div>

        <!-- Right panel toggle -->
        <button class="panel-toggle" @click.stop="rightOpen = !rightOpen" :title="rightOpen ? 'Hide Agent Deck' : 'Show Agent Deck'">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="2.5" fill="currentColor"/>
            <path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M4.22 4.22l1.41 1.41M12.37 12.37l1.41 1.41M4.22 13.78l1.41-1.41M12.37 5.63l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- ===================== BODY ===================== -->
    <div class="studio-layout">

      <!-- LEFT PANEL: Manuscript Tree & Story Bible -->
      <transition name="slide-left">
        <aside v-show="leftOpen" class="sidebar" :class="{ 'mobile-drawer': isMobile }">
          <!-- Mobile close -->
          <button v-if="isMobile" class="drawer-close" @click="leftOpen = false">✕</button>

          <div class="sidebar-tabs">
            <button :class="['tab-btn', { active: activeSidebarTab === 'structure' }]" @click="activeSidebarTab = 'structure'">
              📖 Manuscript
            </button>
            <button :class="['tab-btn', { active: activeSidebarTab === 'bible' }]" @click="activeSidebarTab = 'bible'">
              📜 Story Bible <span class="count-chip">{{ storyBibleEntries.length }}</span>
            </button>
          </div>

          <!-- Structure Tree -->
          <div v-if="activeSidebarTab === 'structure'" class="tab-pane">
            <div class="section-actions">
              <span class="section-heading">Structural Units</span>
              <button class="icon-btn" @click="addStructuralUnit" title="Add Chapter/Unit">+</button>
            </div>

            <div v-if="structuralUnits.length === 0" class="welcome-empty">
              <div class="welcome-empty-icon">📄</div>
              <p>No chapters yet.<br>Click <strong>+</strong> to begin.</p>
            </div>

            <div class="unit-list">
              <div
                v-for="unit in structuralUnits"
                :key="unit.id"
                :class="['unit-item', { active: selectedUnit && selectedUnit.id === unit.id }]"
                @click="selectUnit(unit)"
              >
                <div class="unit-info">
                  <span class="unit-title">{{ unit.title }}</span>
                  <span class="unit-meta">{{ unit.word_count || 0 }} words · {{ unit.status }}</span>
                </div>
                <span class="status-dot" :class="unit.status"></span>
              </div>
            </div>
          </div>

          <!-- Story Bible -->
          <div v-if="activeSidebarTab === 'bible'" class="tab-pane">
            <div class="section-actions">
              <span class="section-heading">Canon Entries</span>
              <button class="icon-btn" @click="showAddBibleModal = true">+</button>
            </div>

            <div class="category-filters">
              <button
                v-for="cat in ['all', 'character', 'timeline', 'place', 'symbol', 'lore']"
                :key="cat"
                :class="['pill-filter', { active: selectedCategory === cat }]"
                @click="selectedCategory = cat"
              >{{ cat }}</button>
            </div>

            <div v-if="filteredBibleEntries.length === 0" class="welcome-empty">
              <div class="welcome-empty-icon">📚</div>
              <p>No canon entries yet.<br>Click <strong>+</strong> to log your first fact.</p>
            </div>

            <div class="bible-list">
              <div
                v-for="entry in filteredBibleEntries"
                :key="entry.id"
                :class="['bible-card', entry.category]"
              >
                <div class="bible-header">
                  <span class="entry-key">{{ entry.key }}</span>
                  <span class="entry-cat">{{ entry.category }}</span>
                </div>
                <p class="entry-value">{{ entry.value }}</p>
                <div class="bible-footer" v-if="entry.supersedes_entry_id">
                  <span class="supersedes-tag">supersedes #{{ entry.supersedes_entry_id }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </transition>

      <!-- Mobile overlay for left drawer -->
      <div v-if="isMobile && leftOpen" class="drawer-overlay" @click="leftOpen = false"></div>

      <!-- CENTER: Editor Canvas -->
      <main class="editor-canvas">
        <!-- Welcome state for fresh users -->
        <div v-if="!selectedUnit && structuralUnits.length === 0" class="fresh-start">
          <div class="fresh-start-inner">
            <div class="fresh-logo-mark">
              <svg width="52" height="52" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="10" fill="url(#logo-fresh)"/>
                <path d="M11 25C14.5 24 16 19 18 13C20 18 21.5 23 25 25" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="18" cy="10" r="2" fill="#A78BFA"/>
                <defs>
                  <linearGradient id="logo-fresh" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#6210CC"/><stop offset="1" stop-color="#9333EA"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2 class="fresh-title">Welcome to PenQraft Studio</h2>
            <p class="fresh-subtitle">Your 8-agent literary workspace is ready. Start by creating your first chapter.</p>
            <div class="fresh-actions">
              <button class="btn-fresh-primary" @click="addStructuralUnit">
                ✍️ &nbsp;Create First Chapter
              </button>
              <button class="btn-fresh-secondary" @click="loadSampleProject">
                📖 &nbsp;Load Sample Project
              </button>
            </div>
            <div class="fresh-credits">
              <span>🪙 {{ wallet.balance_credits.toLocaleString() }} credits available (${{ wallet.balance_usd.toFixed(2) }} USD)</span>
            </div>
          </div>
        </div>

        <!-- Editor toolbar -->
        <div v-else class="canvas-toolbar">
          <div class="unit-header-details" v-if="selectedUnit">
            <input
              type="text"
              v-model="selectedUnit.title"
              class="unit-title-input"
              @change="saveUnitTitle"
            />
            <span class="word-count-badge">{{ activeWordCount }} words</span>
          </div>
          <div class="canvas-actions">
            <button class="btn-sm btn-ghost" @click="clearEditor" v-if="selectedUnit && editorContent" title="Clear editor content">
              🗑 Clear
            </button>
            <button class="btn-sm btn-ghost" @click="loadVersionHistory" v-if="selectedUnit">
              📜 History ({{ versionHistory.length }})
            </button>
            <button class="btn-sm btn-primary" @click="saveDraft" :disabled="isSaving">
              {{ isSaving ? 'Saving…' : '💾 Save Draft' }}
            </button>
          </div>
        </div>

        <!-- Editor textarea -->
        <div class="canvas-body" v-if="selectedUnit || structuralUnits.length > 0">
          <textarea
            v-if="selectedUnit"
            v-model="editorContent"
            class="literary-editor"
            placeholder="Type your literary draft here, or launch an AI agent from the Command Deck →"
            @input="updateWordCount"
          ></textarea>
          <div v-else class="no-selection-state">
            <h3 class="serif">Select or create a chapter from the Manuscript Tree</h3>
            <p>Your writing canvas and agent workspace will activate automatically.</p>
          </div>
        </div>

        <!-- Evaluator Rubric Scorecard -->
        <div v-if="activeRubricScore" class="rubric-scorecard">
          <div class="rubric-header">
            <span class="rubric-title">Editorial Rubric Evaluation</span>
            <span class="rubric-score-badge" :class="{ pass: activeRubricScore.passed }">
              {{ (activeRubricScore.overall_score * 100).toFixed(0) }}/100 · {{ activeRubricScore.passed ? '✓ PASSED' : '↺ REVISING' }}
            </span>
          </div>
          <div class="rubric-criteria-grid">
            <div v-for="crit in activeRubricScore.criteria" :key="crit.name" class="criterion-item">
              <span class="crit-name">{{ crit.name }} ({{ (crit.score * 100).toFixed(0) }}%)</span>
              <p class="crit-feedback">{{ crit.feedback }}</p>
            </div>
          </div>
          <div class="rubric-notes" v-if="activeRubricScore.revision_notes">
            <strong>Revision:</strong> {{ activeRubricScore.revision_notes }}
          </div>
        </div>
      </main>

      <!-- Mobile overlay for right drawer -->
      <div v-if="isMobile && rightOpen" class="drawer-overlay" @click="rightOpen = false"></div>

      <!-- RIGHT PANEL: 8-Agent Command Deck -->
      <transition name="slide-right">
        <aside v-show="rightOpen" class="agent-deck" :class="{ 'mobile-drawer mobile-drawer-right': isMobile }">
          <!-- Mobile close -->
          <button v-if="isMobile" class="drawer-close drawer-close-right" @click="rightOpen = false">✕</button>

          <div class="deck-header">
            <span class="deck-title">Agent Command Deck</span>
            <span class="deck-subtitle">Ensemble Orchestration</span>
          </div>

          <!-- 8 Agents Grid -->
          <div class="agent-cards-grid">
            <div
              v-for="agent in agentList"
              :key="agent.key"
              :class="['agent-card', { active: activeAgentKey === agent.key }]"
              @click="activeAgentKey = agent.key"
            >
              <span class="agent-icon">{{ agent.icon }}</span>
              <div class="agent-details">
                <span class="agent-name">{{ agent.name }}</span>
                <span class="agent-role">{{ agent.role }}</span>
              </div>
            </div>
          </div>

          <!-- Active Agent Console -->
          <div class="agent-console">
            <div class="console-header">
              <span class="console-title">{{ selectedAgent.name }} Console</span>
            </div>
            <p class="console-desc">{{ selectedAgent.description }}</p>

            <div class="console-input-group">
              <label class="input-label">Prompt / Directives</label>
              <textarea
                v-model="agentPromptInput"
                class="console-input"
                :placeholder="selectedAgent.placeholder"
                rows="3"
              ></textarea>
            </div>

            <button
              class="btn-run-agent"
              :disabled="isRunningAgent"
              @click="executeActiveAgent"
            >
              <span v-if="isRunningAgent" class="spinner"></span>
              {{ isRunningAgent ? 'Orchestrating…' : 'Dispatch ' + selectedAgent.name }}
            </button>
          </div>

          <!-- Agent Output Panel -->
          <div v-if="latestAgentOutput" class="latest-output-panel">
            <div class="output-header">
              <span class="output-badge">{{ latestAgentOutput.agent_key }} · {{ latestAgentOutput.status }}</span>
              <span class="output-time">{{ latestAgentOutput.created_at }}</span>
            </div>
            <div class="output-preview">{{ latestAgentOutput.content }}</div>
            <div class="output-actions" v-if="latestAgentOutput.status === 'pending_review'">
              <button class="btn-approve" @click="approveAgentOutput(latestAgentOutput.id)">✓ Approve & Commit</button>
              <button class="btn-reject" @click="rejectAgentOutput(latestAgentOutput.id)">✕ Reject</button>
            </div>
          </div>
        </aside>
      </transition>
    </div>

    <!-- ===================== MODALS ===================== -->

    <!-- Topup Credits Modal -->
    <div v-if="showTopupModal" class="modal-overlay" @click.self="showTopupModal = false">
      <div class="modal-card">
        <h3 class="serif modal-title">Top Up PenQraft Wallet</h3>
        <p class="modal-desc">Credits are pegged to USD at 1,000 Credits = $1.00 USD. Direct provider token metering, zero markup.</p>
        <div class="topup-options">
          <button class="topup-tier-btn" @click="topupAmount(10)">
            <span class="tier-price">$10.00</span>
            <span class="tier-credits">10,000 Credits</span>
          </button>
          <button class="topup-tier-btn featured" @click="topupAmount(25)">
            <span class="tier-price">$25.00</span>
            <span class="tier-credits">25,000 Credits · Most Popular</span>
          </button>
          <button class="topup-tier-btn" @click="topupAmount(50)">
            <span class="tier-price">$50.00</span>
            <span class="tier-credits">50,000 Credits</span>
          </button>
        </div>
        <button class="btn-close-modal" @click="showTopupModal = false">Cancel</button>
      </div>
    </div>

    <!-- Add Story Bible Fact Modal -->
    <div v-if="showAddBibleModal" class="modal-overlay" @click.self="showAddBibleModal = false">
      <div class="modal-card">
        <h3 class="serif modal-title">Log Story Bible Fact</h3>
        <div class="form-group">
          <label>Category</label>
          <select v-model="newBibleEntry.category" class="modal-select">
            <option value="character">Character</option>
            <option value="timeline">Timeline</option>
            <option value="place">Place / Setting</option>
            <option value="symbol">Symbol / Motif</option>
            <option value="lore">Lore &amp; Canon</option>
          </select>
        </div>
        <div class="form-group">
          <label>Key / Subject</label>
          <input type="text" v-model="newBibleEntry.key" class="modal-input" placeholder="e.g. Elysia Vance, Year 408" />
        </div>
        <div class="form-group">
          <label>Fact &amp; Lore Value</label>
          <textarea v-model="newBibleEntry.value" class="modal-textarea" rows="3" placeholder="Describe the immutable truth for your world…"></textarea>
        </div>
        <div class="modal-buttons">
          <button class="btn-primary btn-sm" @click="saveBibleEntry">Save to Story Bible</button>
          <button class="btn-close-modal" @click="showAddBibleModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Confirm Clear Modal -->
    <div v-if="showClearConfirm" class="modal-overlay" @click.self="showClearConfirm = false">
      <div class="modal-card" style="max-width:380px;">
        <h3 class="serif modal-title">Start Fresh?</h3>
        <p class="modal-desc">This will clear all sample chapters, story bible entries, and editor content. Your credits remain intact. Are you sure?</p>
        <div class="modal-buttons">
          <button class="btn-sm" style="background:#EF4444;color:#fff;border:none;border-radius:8px;padding:10px 20px;cursor:pointer;font-weight:700;" @click="confirmClear">Yes, Start Fresh</button>
          <button class="btn-close-modal" @click="showClearConfirm = false">Cancel</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { apiRequest, setAuthToken, getAuthToken } from '../services/api'

export default {
  name: 'PenqraftStudio',
  data() {
    return {
      // Auth
      user: { id: null, name: 'Author', email: '', role: 'user' },
      wallet: { balance_credits: 5000, balance_usd: 5.0 },

      // Project (starts empty — no sample data)
      currentProject: null,
      structuralUnits: [],
      selectedUnit: null,
      editorContent: '',
      activeWordCount: 0,
      activeSidebarTab: 'structure',
      selectedCategory: 'all',
      storyBibleEntries: [],
      activeAgentKey: 'drafting',
      agentPromptInput: '',
      isRunningAgent: false,
      isSaving: false,
      latestAgentOutput: null,
      activeRubricScore: null,
      versionHistory: [],

      // UI state
      leftOpen: true,
      rightOpen: true,
      isMobile: false,
      profileOpen: false,
      showTopupModal: false,
      showAddBibleModal: false,
      showClearConfirm: false,
      newBibleEntry: { category: 'character', key: '', value: '' },

      agentList: [
        { key: 'concept',        icon: '💡', name: 'Concept',     role: 'Themes & Comps',      description: 'Architects overarching narrative arguments, core conflicts, and literary hooks.',                        placeholder: 'Refine the core central dramatic question for chapter 3…' },
        { key: 'structure',      icon: '📐', name: 'Structure',   role: 'Beats & Pacing',      description: 'Constructs beat sheets, turning points, and chapter word count trajectories.',                        placeholder: 'Outline 5 key scene beats building toward the confrontation…' },
        { key: 'character_world',icon: '🎭', name: 'Character',   role: 'Psychology & Lore',   description: 'Develops flaws, desire-vs-need psychology, and sensory textures.',                                    placeholder: 'Deepen the antagonist internal conflict during this exchange…' },
        { key: 'drafting',       icon: '✍️', name: 'Drafting',   role: 'Prose Generation',    description: 'Generates publication-grade prose strictly conditioned on the Story Bible.',                          placeholder: 'Draft the tense confrontation in the rain at the top of the High Spire…' },
        { key: 'continuity',     icon: '📜', name: 'Continuity', role: 'Canon Auditor',       description: 'Cross-references drafts against the Story Bible to prevent plot contradictions.',                     placeholder: 'Audit this scene for timeline or character appearance errors…' },
        { key: 'editorial',      icon: '⚖️', name: 'Editorial',  role: 'Rubric Evaluator',    description: 'Evaluates prose on craft, voice, pacing, and emotional resonance.',                                   placeholder: 'Score the dialogue authenticity and sensory immersion…' },
        { key: 'style_voice',    icon: '🎻', name: 'Style',      role: 'Syntactic Rhythm',    description: 'Maintains authorial voice fingerprint, sentence cadence, and tone consistency.',                      placeholder: 'Elevate the metaphorical texture to match literary gothic fantasy…' },
        { key: 'export',         icon: '📦', name: 'Export',     role: 'Typesetting',         description: 'Compiles units into Standard Manuscript Format Markdown, Fountain, or EPUB.',                        placeholder: 'Format current project chapters for standard manuscript submission…' },
      ]
    }
  },

  computed: {
    selectedAgent() {
      return this.agentList.find(a => a.key === this.activeAgentKey) || this.agentList[3]
    },
    filteredBibleEntries() {
      if (this.selectedCategory === 'all') return this.storyBibleEntries
      return this.storyBibleEntries.filter(e => e.category === this.selectedCategory)
    },
    userInitial() {
      return this.user.name ? this.user.name.charAt(0).toUpperCase() : 'A'
    }
  },

  async mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)

    // On mobile start with both panels closed
    if (this.isMobile) {
      this.leftOpen = false
      this.rightOpen = false
    }

    await this.fetchUserData()
    await this.fetchProjectData()
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },

  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 768
      if (this.isMobile) {
        this.leftOpen = false
        this.rightOpen = false
      } else {
        this.leftOpen = true
        this.rightOpen = true
      }
    },

    closeDropdowns() {
      this.profileOpen = false
    },

    handleSignOut() {
      setAuthToken(null)
      this.$router.push('/login')
    },

    async fetchUserData() {
      try {
        const userRes = await apiRequest('/api/v1/auth/me')
        if (userRes?.user) {
          this.user = userRes.user
        }
      } catch (err) {
        console.warn('Using client auth state for studio.')
      }

      try {
        const walletRes = await apiRequest('/api/v1/wallet')
        if (walletRes?.data) {
          this.wallet.balance_credits = walletRes.data.balance_credits
          this.wallet.balance_usd = walletRes.data.balance_usd
        }
      } catch {
        // Default wallet
      }
    },

    async fetchProjectData() {
      try {
        const projectsRes = await apiRequest('/api/v1/projects')
        if (projectsRes?.data && projectsRes.data.length > 0) {
          this.currentProject = projectsRes.data[0]
          
          // Fetch units for current project
          const unitsRes = await apiRequest(`/api/v1/projects/${this.currentProject.id}/structural-units`)
          if (unitsRes?.data && unitsRes.data.length > 0) {
            this.structuralUnits = unitsRes.data
            this.selectUnit(this.structuralUnits[0])
          }
        }
      } catch {
        console.warn('No active project found on API, ready for creation.')
      }
    },

    loadSampleProject() {
      this.currentProject = {
        id: 1,
        title: 'The Obsidian Sovereign',
        synopsis: 'An exiled archivist uncovers a forbidden bronze cipher in the High Spire.',
        model_tier: 'balanced',
        project_type: { label: 'Novel', key: 'novel', structural_unit_label: 'Chapter' }
      }
      this.structuralUnits = [
        { id: 1, title: 'Chapter 1: The Inciting Incident', word_count: 0, status: 'draft' },
        { id: 2, title: 'Chapter 2: The Archive Infiltration', word_count: 0, status: 'draft' },
        { id: 3, title: 'Chapter 3: The Midnight Decryption', word_count: 0, status: 'draft' }
      ]
      this.storyBibleEntries = [
        { id: 1, category: 'character', key: 'Elysia Vance', value: 'Exiled archivist with cyan scar across right temple; carries bronze cipher.', supersedes_entry_id: null },
        { id: 2, category: 'timeline',  key: 'The Great Collapse', value: 'Occurred 40 years prior to the events of chapter 1.', supersedes_entry_id: null },
        { id: 3, category: 'place',     key: 'The High Spire', value: 'Tower of obsidian and brass overlooking the flooded lowlands.', supersedes_entry_id: null },
      ]
      this.editorContent = ''
      this.selectedUnit = this.structuralUnits[0]
      this.activeWordCount = 0
    },

    clearWorkspace() {
      this.profileOpen = false
      this.showClearConfirm = true
    },

    confirmClear() {
      this.structuralUnits = []
      this.storyBibleEntries = []
      this.selectedUnit = null
      this.editorContent = ''
      this.activeWordCount = 0
      this.currentProject = null
      this.latestAgentOutput = null
      this.activeRubricScore = null
      this.versionHistory = []
      this.showClearConfirm = false
    },

    clearEditor() {
      this.editorContent = ''
      this.updateWordCount()
    },

    selectUnit(unit) {
      this.selectedUnit = unit
      this.editorContent = ''  // start clean — agent or user fills it
      this.updateWordCount()
      // On mobile, close left drawer after selection
      if (this.isMobile) this.leftOpen = false
    },

    updateWordCount() {
      if (!this.editorContent) { this.activeWordCount = 0; return }
      const words = this.editorContent.trim().split(/\s+/)
      this.activeWordCount = words.filter(w => w.length > 0).length
      if (this.selectedUnit) this.selectedUnit.word_count = this.activeWordCount
    },

    addStructuralUnit() {
      if (!this.currentProject) {
        this.currentProject = {
          id: Date.now(),
          title: 'New Project',
          model_tier: 'balanced',
          project_type: { label: 'Novel', key: 'novel', structural_unit_label: 'Chapter' }
        }
      }
      const nextNum = this.structuralUnits.length + 1
      const newUnit = { id: Date.now(), title: `Chapter ${nextNum}: Untitled`, word_count: 0, status: 'draft' }
      this.structuralUnits.push(newUnit)
      this.selectUnit(newUnit)
    },

    saveUnitTitle() {},

    saveDraft() {
      this.isSaving = true
      setTimeout(() => {
        this.isSaving = false
        if (this.selectedUnit) this.selectedUnit.status = 'revised'
      }, 500)
    },

    async executeActiveAgent() {
      this.isRunningAgent = true
      this.latestAgentOutput = null
      this.activeRubricScore = null
      try {
        const payload = {
          agent_key: this.activeAgentKey,
          prompt: this.agentPromptInput || 'Execute standard pass for this chapter.',
          content: this.editorContent,
          structural_unit_id: this.selectedUnit ? this.selectedUnit.id : null
        }
        const resData = await apiRequest(`/api/v1/projects/${this.currentProject?.id || 1}/agents/${this.activeAgentKey}/run`, {
          method: 'POST',
          body: payload
        })
        if (resData?.data) {
          this.latestAgentOutput = resData.data
          if (resData.data.rubric_score) this.activeRubricScore = resData.data.rubric_score
          if (this.wallet.balance_credits >= 18) {
            this.wallet.balance_credits -= 18
            this.wallet.balance_usd = +(this.wallet.balance_credits / 1000).toFixed(2)
          }
        } else {
          this.simulateAgentResponse()
        }
      } catch (err) {
        this.simulateAgentResponse()
      } finally {
        this.isRunningAgent = false
      }
    },

    simulateAgentResponse() {
      setTimeout(() => {
        const outputText = `[${this.selectedAgent.name} Agent Output]\n\nThe cathedral corridor echoed with the cadence of impending conflict. The cipher glowed with faint indigo phosphorescence, responding to the ancient rune carved into the altar floor.`
        this.latestAgentOutput = { id: Date.now(), agent_key: this.activeAgentKey, content: outputText, status: 'pending_review', created_at: 'Just now' }
        this.activeRubricScore = {
          overall_score: 0.88, passed: true,
          criteria: [
            { name: 'Prose Craft', score: 0.90, feedback: 'Rich sensory language and compelling spatial geometry.' },
            { name: 'Voice & Cadence', score: 0.86, feedback: 'Dialogue is natural, sharp, and laden with subtext.' },
            { name: 'Pacing', score: 0.88, feedback: 'Tension modulates effectively toward the beat climax.' }
          ],
          revision_notes: 'Manuscript is strong and coherent with the Story Bible.'
        }
        if (this.wallet.balance_credits >= 15) {
          this.wallet.balance_credits -= 15
          this.wallet.balance_usd = +(this.wallet.balance_credits / 1000).toFixed(2)
        }
      }, 900)
    },

    approveAgentOutput() {
      if (this.latestAgentOutput?.content) {
        this.editorContent += (this.editorContent ? '\n\n' : '') + this.latestAgentOutput.content
        this.updateWordCount()
        this.latestAgentOutput.status = 'approved'
      }
    },
    rejectAgentOutput() { if (this.latestAgentOutput) this.latestAgentOutput.status = 'rejected' },

    topupAmount(usd) {
      this.wallet.balance_credits += usd * 1000
      this.wallet.balance_usd += usd
      this.showTopupModal = false
    },

    saveBibleEntry() {
      if (!this.newBibleEntry.key || !this.newBibleEntry.value) return
      this.storyBibleEntries.unshift({ id: Date.now(), ...this.newBibleEntry, supersedes_entry_id: null })
      this.newBibleEntry = { category: 'character', key: '', value: '' }
      this.showAddBibleModal = false
    },

    loadVersionHistory() {
      alert(`Version History for "${this.selectedUnit.title}":\n- v1 (Draft initialized)\n- v2 (Editorial revision pass completed)`)
    }
  }
}
</script>

<style scoped>
/* ===========================
   ROOT & LAYOUT
   =========================== */
.penqraft-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #090611;
  color: #FDFBF7;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  position: relative;
}

/* ===========================
   HEADER
   =========================== */
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
.panel-toggle:hover {
  background: rgba(98,16,204,0.2);
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

.project-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 1px solid #2A224D;
  padding-left: 12px;
  margin-left: 4px;
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
  font-size: 0.9rem;
  font-weight: 600;
  color: #FFF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
.tier-tag {
  font-size: 0.66rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(16,185,129,0.15);
  color: #10B981;
  border: 1px solid rgba(16,185,129,0.3);
  text-transform: uppercase;
}

/* ===========================
   WALLET PILL
   =========================== */
.wallet-pill {
  display: flex;
  align-items: center;
  gap: 5px;
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

/* ===========================
   PROFILE DROPDOWN
   =========================== */
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
  border: 1px solid #2A224D;
  border-radius: 12px;
  padding: 8px;
  min-width: 220px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.6);
  z-index: 200;
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
.dropdown-name { font-weight: 700; font-size: 0.9rem; color: #FFF; }
.dropdown-email { font-size: 0.75rem; color: #A19EB7; }

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

/* Dropdown transition */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }

/* ===========================
   STUDIO LAYOUT — 3 COLUMNS
   =========================== */
.studio-layout {
  display: grid;
  grid-template-columns: 280px 1fr 340px;
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* ===========================
   SIDEBAR (Left & Right)
   =========================== */
.sidebar {
  background: #0D0A1A;
  border-right: 1px solid #2A224D;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.25s ease;
}

.agent-deck {
  background: #0D0A1A;
  border-left: 1px solid #2A224D;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 14px;
  gap: 14px;
}

/* Mobile drawer */
.mobile-drawer {
  position: fixed !important;
  top: 56px;
  left: 0;
  bottom: 0;
  width: 290px !important;
  z-index: 100;
  box-shadow: 6px 0 30px rgba(0,0,0,0.7);
}
.mobile-drawer-right {
  left: auto !important;
  right: 0;
  box-shadow: -6px 0 30px rgba(0,0,0,0.7);
}

.drawer-overlay {
  position: fixed;
  inset: 56px 0 0 0;
  background: rgba(0,0,0,0.55);
  z-index: 90;
  backdrop-filter: blur(2px);
}

.drawer-close {
  position: absolute;
  top: 8px;
  right: 10px;
  background: rgba(255,255,255,0.07);
  border: 1px solid #2A224D;
  color: #FFF;
  width: 28px; height: 28px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  z-index: 101;
}
.drawer-close-right { right: auto; left: 10px; }

/* Panel slide transitions */
.slide-left-enter-active, .slide-left-leave-active { transition: all 0.25s ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); opacity: 0; }

.slide-right-enter-active, .slide-right-leave-active { transition: all 0.25s ease; }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); opacity: 0; }

/* ===========================
   SIDEBAR INNER
   =========================== */
.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid #2A224D;
  flex-shrink: 0;
}
.tab-btn {
  flex: 1;
  background: none; border: none;
  color: #A19EB7;
  padding: 11px 6px;
  font-size: 0.78rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 4px;
}
.tab-btn.active {
  color: #FFF;
  border-bottom: 2px solid #7C3AED;
  background: rgba(98,16,204,0.1);
}
.count-chip {
  background: #6210CC; color: #FFF;
  font-size: 0.6rem; font-weight: 700;
  padding: 1px 5px; border-radius: 8px;
}

.tab-pane { padding: 14px; overflow-y: auto; flex: 1; }

.section-actions { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.section-heading { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #A78BFA; letter-spacing: 0.06em; }
.icon-btn {
  background: rgba(255,255,255,0.06); border: 1px solid #2A224D;
  color: #FFF; width: 22px; height: 22px; border-radius: 6px;
  cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center;
}
.icon-btn:hover { background: rgba(98,16,204,0.3); border-color: #7C3AED; }

/* Welcome empty state */
.welcome-empty {
  text-align: center;
  padding: 24px 12px;
  color: #635F7E;
}
.welcome-empty-icon { font-size: 2rem; margin-bottom: 8px; }
.welcome-empty p { font-size: 0.82rem; line-height: 1.5; }
.welcome-empty strong { color: #A78BFA; }

.unit-list { display: flex; flex-direction: column; gap: 6px; }

.unit-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 9px 11px;
  background: rgba(18,14,34,0.6); border: 1px solid #2A224D;
  border-radius: 8px; cursor: pointer; transition: all 0.2s;
}
.unit-item:hover, .unit-item.active {
  border-color: #7C3AED; background: rgba(98,16,204,0.15);
}
.unit-title { display: block; font-size: 0.84rem; font-weight: 600; color: #FFF; }
.unit-meta { font-size: 0.72rem; color: #A19EB7; }

.status-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #F59E0B; flex-shrink: 0;
}
.status-dot.revised { background: #10B981; }
.status-dot.draft { background: #F59E0B; }

/* Story Bible */
.category-filters { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
.pill-filter {
  background: rgba(255,255,255,0.04); border: 1px solid #2A224D;
  color: #A19EB7; padding: 3px 7px; border-radius: 10px;
  font-size: 0.7rem; text-transform: capitalize; cursor: pointer;
}
.pill-filter.active { background: #6210CC; color: #FFF; border-color: #7C3AED; }
.bible-list { display: flex; flex-direction: column; gap: 8px; }
.bible-card {
  background: rgba(18,14,34,0.8); border: 1px solid #2A224D;
  border-left: 3px solid #7C3AED; border-radius: 8px; padding: 9px 11px;
}
.bible-card.character { border-left-color: #8B5CF6; }
.bible-card.timeline { border-left-color: #F59E0B; }
.bible-card.place { border-left-color: #10B981; }
.bible-card.symbol { border-left-color: #EC4899; }
.bible-header { display: flex; justify-content: space-between; margin-bottom: 3px; }
.entry-key { font-weight: 700; font-size: 0.82rem; color: #FFF; }
.entry-cat { font-size: 0.64rem; text-transform: uppercase; color: #A19EB7; }
.entry-value { font-size: 0.77rem; color: #D1D5DB; line-height: 1.4; }
.supersedes-tag { font-size: 0.66rem; color: #A78BFA; font-family: monospace; }

/* ===========================
   FRESH START WELCOME STATE
   =========================== */
.fresh-start {
  display: flex; align-items: center; justify-content: center;
  flex: 1; padding: 32px 20px;
}
.fresh-start-inner {
  text-align: center; max-width: 480px;
}
.fresh-logo-mark { display: flex; justify-content: center; margin-bottom: 20px; }
.fresh-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 700; color: #FFF; margin-bottom: 10px;
}
.fresh-subtitle { color: #A19EB7; font-size: 0.95rem; line-height: 1.5; margin-bottom: 28px; }
.fresh-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }
.btn-fresh-primary {
  padding: 12px 22px;
  background: linear-gradient(135deg, #6210CC, #7C3AED);
  border: none; border-radius: 10px; color: #FFF;
  font-size: 0.95rem; font-weight: 700; cursor: pointer;
  transition: all 0.2s; box-shadow: 0 4px 16px rgba(98,16,204,0.4);
}
.btn-fresh-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(98,16,204,0.6); }
.btn-fresh-secondary {
  padding: 12px 22px;
  background: rgba(255,255,255,0.06);
  border: 1px solid #2A224D; border-radius: 10px; color: #EDE9FE;
  font-size: 0.95rem; cursor: pointer; transition: all 0.2s;
}
.btn-fresh-secondary:hover { background: rgba(255,255,255,0.1); border-color: #7C3AED; }
.fresh-credits { font-size: 0.82rem; color: #635F7E; }

/* ===========================
   CENTER EDITOR
   =========================== */
.editor-canvas {
  background: #090611;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.canvas-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #2A224D;
  flex-shrink: 0;
  gap: 10px;
  flex-wrap: wrap;
}
.unit-header-details { display: flex; align-items: baseline; gap: 10px; min-width: 0; flex: 1; }
.unit-title-input {
  background: transparent; border: none;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.3rem; font-weight: 700; color: #FFF;
  outline: none; min-width: 0; flex: 1;
}
.word-count-badge { font-size: 0.76rem; color: #A19EB7; white-space: nowrap; }
.canvas-actions { display: flex; gap: 8px; }

.btn-sm {
  padding: 7px 13px; border-radius: 7px;
  font-size: 0.8rem; font-weight: 600; cursor: pointer; border: none;
}
.btn-ghost {
  background: rgba(255,255,255,0.05); color: #EDE9FE; border: 1px solid #2A224D;
  transition: all 0.2s;
}
.btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: #7C3AED; }
.btn-primary { background: linear-gradient(135deg, #6210CC, #7C3AED); color: #FFF; }

.canvas-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 20px;
}

.literary-editor {
  width: 100%; height: 100%;
  background: rgba(18,14,34,0.4); border: 1px solid #2A224D;
  border-radius: 12px; padding: 24px;
  color: #FDFBF7;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.1rem; line-height: 1.85;
  resize: none; outline: none;
  transition: border-color 0.2s;
}
.literary-editor:focus { border-color: rgba(124,58,237,0.6); }
.literary-editor::placeholder { color: #3D3660; }

.no-selection-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  flex: 1; text-align: center; color: #635F7E; gap: 8px;
}

.rubric-scorecard {
  padding: 14px 20px;
  border-top: 1px solid #2A224D;
  background: rgba(18,14,34,0.85);
  flex-shrink: 0;
}
.rubric-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.rubric-title { font-weight: 700; font-size: 0.86rem; color: #FFF; }
.rubric-score-badge {
  font-size: 0.75rem; font-weight: 700; padding: 3px 9px;
  border-radius: 5px; background: rgba(239,68,68,0.2); color: #F87171;
}
.rubric-score-badge.pass { background: rgba(16,185,129,0.2); color: #34D399; }
.rubric-criteria-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; margin-bottom: 8px; }
.criterion-item { background: rgba(0,0,0,0.2); padding: 7px 10px; border-radius: 6px; }
.crit-name { font-weight: 600; font-size: 0.75rem; color: #C4B5FD; display: block; }
.crit-feedback { font-size: 0.72rem; color: #A19EB7; }
.rubric-notes { font-size: 0.78rem; color: #EDE9FE; border-top: 1px solid #2A224D; padding-top: 7px; }

/* ===========================
   AGENT DECK
   =========================== */
.deck-header { border-bottom: 1px solid #2A224D; padding-bottom: 10px; }
.deck-title { display: block; font-weight: 700; font-size: 0.92rem; color: #FFF; }
.deck-subtitle { font-size: 0.72rem; color: #A19EB7; }

.agent-cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.agent-card {
  display: flex; align-items: center; gap: 7px; padding: 8px;
  background: rgba(18,14,34,0.6); border: 1px solid #2A224D;
  border-radius: 8px; cursor: pointer; transition: all 0.2s;
}
.agent-card:hover, .agent-card.active {
  border-color: #7C3AED; background: rgba(98,16,204,0.2);
}
.agent-icon { font-size: 1rem; }
.agent-name { display: block; font-size: 0.78rem; font-weight: 700; color: #FFF; }
.agent-role { display: block; font-size: 0.64rem; color: #A19EB7; }

.agent-console {
  background: rgba(18,14,34,0.8); border: 1px solid #3B2D6B;
  border-radius: 10px; padding: 13px;
}
.console-header { margin-bottom: 5px; }
.console-title { font-weight: 700; font-size: 0.86rem; color: #FFF; }
.console-desc { font-size: 0.76rem; color: #A19EB7; margin: 4px 0 10px; line-height: 1.4; }
.input-label { display: block; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: #C4B5FD; margin-bottom: 4px; }
.console-input {
  width: 100%; background: rgba(0,0,0,0.3); border: 1px solid #2A224D;
  border-radius: 7px; padding: 8px; color: #FFF; font-size: 0.8rem;
  outline: none; resize: none; margin-bottom: 10px;
  font-family: inherit;
}
.console-input:focus { border-color: #7C3AED; }

.btn-run-agent {
  width: 100%;
  background: linear-gradient(135deg, #6210CC, #7C3AED);
  border: none; color: #FFF; font-weight: 700; font-size: 0.84rem;
  padding: 10px; border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: all 0.2s;
}
.btn-run-agent:hover:not(:disabled) { box-shadow: 0 4px 16px rgba(98,16,204,0.5); }
.btn-run-agent:disabled { opacity: 0.5; cursor: not-allowed; }

.spinner {
  width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #FFF; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.latest-output-panel {
  background: rgba(18,14,34,0.9); border: 1px solid #2A224D;
  border-radius: 10px; padding: 11px;
}
.output-header { display: flex; justify-content: space-between; margin-bottom: 7px; }
.output-badge { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: #34D399; }
.output-time { font-size: 0.68rem; color: #635F7E; }
.output-preview {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 0.84rem; line-height: 1.5; color: #EDE9FE;
  max-height: 150px; overflow-y: auto; margin-bottom: 9px;
  padding: 6px; background: rgba(0,0,0,0.2); border-radius: 6px;
}
.output-actions { display: flex; gap: 7px; }
.btn-approve {
  flex: 1; background: #10B981; color: #FFF; border: none;
  padding: 6px; border-radius: 6px; font-size: 0.76rem; font-weight: 700; cursor: pointer;
}
.btn-reject {
  background: rgba(239,68,68,0.2); color: #F87171;
  border: 1px solid rgba(239,68,68,0.4); padding: 6px 10px;
  border-radius: 6px; font-size: 0.76rem; cursor: pointer;
}

/* ===========================
   MODALS
   =========================== */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 300; padding: 20px;
}
.modal-card {
  background: #120E22; border: 1px solid #3B2D6B;
  border-radius: 16px; padding: 26px;
  width: 100%; max-width: 480px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.7);
}
.serif { font-family: 'Fraunces', Georgia, serif; }
.modal-title { font-size: 1.3rem; color: #FFF; margin-bottom: 6px; }
.modal-desc { font-size: 0.84rem; color: #A19EB7; margin-bottom: 18px; line-height: 1.4; }

.topup-options { display: flex; flex-direction: column; gap: 9px; margin-bottom: 18px; }
.topup-tier-btn {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(255,255,255,0.04); border: 1px solid #2A224D;
  border-radius: 10px; padding: 13px; color: #FFF; cursor: pointer; transition: all 0.2s;
}
.topup-tier-btn:hover, .topup-tier-btn.featured {
  border-color: #7C3AED; background: rgba(98,16,204,0.15);
}
.tier-price { font-weight: 700; font-size: 1.05rem; }
.tier-credits { color: #C4B5FD; font-size: 0.84rem; }

.btn-close-modal {
  width: 100%; background: none; border: none;
  color: #A19EB7; padding: 10px; cursor: pointer; font-size: 0.86rem;
}
.form-group { margin-bottom: 13px; }
.form-group label { display: block; font-size: 0.76rem; font-weight: 600; color: #C4B5FD; margin-bottom: 4px; }
.modal-input, .modal-select, .modal-textarea {
  width: 100%; background: rgba(0,0,0,0.3); border: 1px solid #2A224D;
  border-radius: 8px; padding: 10px; color: #FFF; font-size: 0.86rem; outline: none;
  font-family: inherit;
}
.modal-input:focus, .modal-select:focus, .modal-textarea:focus { border-color: #7C3AED; }
.modal-buttons { display: flex; gap: 10px; margin-top: 18px; align-items: center; }

/* ===========================
   RESPONSIVE
   =========================== */
@media (max-width: 767px) {
  .studio-layout {
    grid-template-columns: 1fr;
  }
  .project-switcher { display: none; }
  .hide-sm { display: none; }
  .hide-xs { display: none; }
  .editor-canvas {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .app-header { padding: 0 10px; gap: 8px; }
  .brand-text { display: none; }
  .wallet-pill { padding: 4px 8px; }
  .canvas-toolbar { padding: 10px 14px; }
  .canvas-body { padding: 12px; }
  .literary-editor { font-size: 1rem; padding: 16px; }
}
</style>
