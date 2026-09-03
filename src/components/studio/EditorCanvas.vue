<template>
  <main class="editor-canvas">
    <!-- Welcome state for fresh users/projects with no units -->
    <div v-if="!selectedUnit && (!structuralUnits || structuralUnits.length === 0)" class="fresh-start">
      <div class="fresh-start-inner">
        <div class="fresh-logo-mark">
          <svg width="52" height="52" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="url(#logo-fresh-canvas)"/>
            <path d="M11 25C14.5 24 16 19 18 13C20 18 21.5 23 25 25" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="18" cy="10" r="2" fill="#A78BFA"/>
            <defs>
              <linearGradient id="logo-fresh-canvas" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stop-color="#6210CC"/><stop offset="1" stop-color="#9333EA"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2 class="fresh-title">Welcome to PenQraft Studio</h2>
        <p class="fresh-subtitle">Your ensemble literary workspace is ready. Begin by adding your manuscript chapter or creating a new project.</p>
        <div class="fresh-actions">
          <button class="btn-fresh-primary" @click="$emit('add-unit')">
            ✍️ &nbsp;Create First Chapter
          </button>
          <button class="btn-fresh-secondary" @click="$emit('open-create-project')">
            📖 &nbsp;Start New Project
          </button>
        </div>
        <div class="fresh-credits">
          <span>🪙 {{ Number(wallet?.balance_credits || 0).toLocaleString() }} credits available (${{ Number(wallet?.balance_usd || 0).toFixed(2) }} USD)</span>
        </div>
      </div>
    </div>

    <!-- Active Editor Toolbar -->
    <div v-else class="canvas-toolbar">
      <div class="unit-header-details" v-if="selectedUnit">
        <input
          type="text"
          v-model="localTitle"
          class="unit-title-input"
          @blur="onTitleBlur"
          placeholder="Untitled Chapter"
          title="Click to rename unit"
        />
        <span class="word-count-badge">{{ activeWordCount }} words</span>
      </div>
      <div v-else class="unit-header-details">
        <span class="no-unit-title">No Chapter Selected</span>
      </div>

      <div class="canvas-actions">
        <button
          class="btn-sm btn-ghost"
          @click="$emit('clear-editor')"
          v-if="selectedUnit && modelValue"
          title="Clear editor text"
        >
          🗑 Clear
        </button>
        <button
          class="btn-sm btn-ghost"
          @click="$emit('toggle-history')"
          v-if="selectedUnit"
          title="View Version History"
        >
          📜 History ({{ versionCount }})
        </button>
        <button
          class="btn-sm btn-primary"
          @click="$emit('save-draft')"
          :disabled="isSaving || !selectedUnit"
        >
          <span v-if="isSaving" class="spinner-small"></span>
          {{ isSaving ? 'Saving…' : '💾 Save Draft' }}
        </button>
      </div>
    </div>

    <!-- Editor Body -->
    <div class="canvas-body" v-if="selectedUnit || (structuralUnits && structuralUnits.length > 0)">
      <textarea
        v-if="selectedUnit"
        :value="modelValue"
        class="literary-editor"
        placeholder="Type your literary draft here, or dispatch an AI agent from the Command Deck →"
        @input="onInput"
        ref="editorRef"
      ></textarea>
      <div v-else class="no-selection-state">
        <h3 class="serif">Select or create a chapter from the Manuscript Tree</h3>
        <p>Your writing canvas and agent workspace will activate automatically.</p>
        <button class="btn-sm btn-primary" style="margin-top: 12px;" @click="$emit('add-unit')">
          + Add First Chapter
        </button>
      </div>
    </div>

    <!-- Evaluator Rubric Scorecard -->
    <div v-if="activeRubricScore" class="rubric-scorecard">
      <div class="rubric-header">
        <div class="rubric-header-left">
          <span class="rubric-icon">⚖️</span>
          <span class="rubric-title">Editorial Rubric Evaluation</span>
        </div>
        <div class="rubric-header-right">
          <span class="rubric-score-badge" :class="{ pass: activeRubricScore.passed }">
            {{ Math.round((activeRubricScore.overall_score || 0) * 100) }}/100 · {{ activeRubricScore.passed ? '✓ PASSED' : '↺ REVISING' }}
          </span>
          <button class="btn-close-rubric" @click="$emit('dismiss-rubric')" title="Dismiss Rubric">✕</button>
        </div>
      </div>
      <div class="rubric-criteria-grid" v-if="activeRubricScore.criteria && activeRubricScore.criteria.length">
        <div v-for="crit in activeRubricScore.criteria" :key="crit.name" class="criterion-item">
          <span class="crit-name">{{ crit.name }} ({{ Math.round((crit.score || 0) * 100) }}%)</span>
          <p class="crit-feedback">{{ crit.feedback }}</p>
        </div>
      </div>
      <div class="rubric-notes" v-if="activeRubricScore.revision_notes">
        <strong>Revision Direction:</strong> {{ activeRubricScore.revision_notes }}
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  selectedUnit: {
    type: Object,
    default: null,
  },
  structuralUnits: {
    type: Array,
    default: () => [],
  },
  activeWordCount: {
    type: Number,
    default: 0,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
  versionCount: {
    type: Number,
    default: 0,
  },
  activeRubricScore: {
    type: Object,
    default: null,
  },
  wallet: {
    type: Object,
    default: () => ({ balance_credits: 0, balance_usd: 0 }),
  },
})

const emit = defineEmits([
  'update:modelValue',
  'save-title',
  'save-draft',
  'clear-editor',
  'toggle-history',
  'add-unit',
  'open-create-project',
  'dismiss-rubric',
])

const editorRef = ref(null)
const localTitle = ref(props.selectedUnit?.title || '')

watch(
  () => props.selectedUnit,
  (newUnit) => {
    localTitle.value = newUnit?.title || ''
  },
  { immediate: true }
)

function onInput(e) {
  emit('update:modelValue', e.target.value)
}

function onTitleBlur() {
  if (props.selectedUnit && localTitle.value !== props.selectedUnit.title) {
    emit('save-title', localTitle.value)
  }
}
</script>

<style scoped>
.editor-canvas {
  background: #090611;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  transition: all 0.25s ease;
}

/* Canvas Toolbar */
.canvas-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #2A224D;
  flex-shrink: 0;
  gap: 12px;
  flex-wrap: wrap;
  background: #0B0816;
}

.unit-header-details {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.unit-title-input {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 4px 8px;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #FFF;
  outline: none;
  min-width: 0;
  flex: 1;
  transition: all 0.2s;
}
.unit-title-input:hover {
  background: rgba(255,255,255,0.03);
  border-color: #2A224D;
}
.unit-title-input:focus {
  background: rgba(255,255,255,0.05);
  border-color: #7C3AED;
}

.no-unit-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.15rem;
  color: #635F7E;
}

.word-count-badge {
  font-size: 0.76rem;
  color: #A19EB7;
  white-space: nowrap;
  background: rgba(255,255,255,0.04);
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid #2A224D;
}

.canvas-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-sm {
  padding: 7px 13px;
  border-radius: 7px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}
.btn-ghost {
  background: rgba(255,255,255,0.05);
  color: #EDE9FE;
  border: 1px solid #2A224D;
}
.btn-ghost:hover {
  background: rgba(255,255,255,0.1);
  border-color: #7C3AED;
}
.btn-primary {
  background: linear-gradient(135deg, #6210CC, #7C3AED);
  color: #FFF;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-small {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #FFF;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Canvas Body */
.canvas-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 20px;
  min-height: 0;
}

.literary-editor {
  width: 100%;
  height: 100%;
  background: rgba(18,14,34,0.4);
  border: 1px solid #2A224D;
  border-radius: 12px;
  padding: 24px;
  color: #FDFBF7;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.12rem;
  line-height: 1.85;
  resize: none;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.literary-editor:focus {
  border-color: rgba(124,58,237,0.6);
  box-shadow: 0 0 20px rgba(98,16,204,0.15);
}
.literary-editor::placeholder {
  color: #3D3660;
}

.no-selection-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  color: #635F7E;
  gap: 8px;
}
.serif { font-family: 'Fraunces', Georgia, serif; }

/* Fresh Start Screen */
.fresh-start {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 32px 20px;
}
.fresh-start-inner {
  text-align: center;
  max-width: 480px;
}
.fresh-logo-mark {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.fresh-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 700;
  color: #FFF;
  margin-bottom: 10px;
}
.fresh-subtitle {
  color: #A19EB7;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 28px;
}
.fresh-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.btn-fresh-primary {
  padding: 12px 22px;
  background: linear-gradient(135deg, #6210CC, #7C3AED);
  border: none;
  border-radius: 10px;
  color: #FFF;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(98,16,204,0.4);
}
.btn-fresh-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(98,16,204,0.6);
}
.btn-fresh-secondary {
  padding: 12px 22px;
  background: rgba(255,255,255,0.06);
  border: 1px solid #2A224D;
  border-radius: 10px;
  color: #EDE9FE;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-fresh-secondary:hover {
  background: rgba(255,255,255,0.1);
  border-color: #7C3AED;
}
.fresh-credits {
  font-size: 0.82rem;
  color: #635F7E;
}

/* Rubric Scorecard */
.rubric-scorecard {
  padding: 14px 20px;
  border-top: 1px solid #2A224D;
  background: rgba(18,14,34,0.92);
  flex-shrink: 0;
}
.rubric-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.rubric-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rubric-title {
  font-weight: 700;
  font-size: 0.86rem;
  color: #FFF;
}
.rubric-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rubric-score-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 5px;
  background: rgba(239,68,68,0.2);
  color: #F87171;
}
.rubric-score-badge.pass {
  background: rgba(16,185,129,0.2);
  color: #34D399;
}
.btn-close-rubric {
  background: none;
  border: none;
  color: #A19EB7;
  cursor: pointer;
  font-size: 0.9rem;
}
.btn-close-rubric:hover { color: #FFF; }

.rubric-criteria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  margin-bottom: 8px;
}
.criterion-item {
  background: rgba(0,0,0,0.25);
  padding: 8px 11px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.04);
}
.crit-name {
  font-weight: 600;
  font-size: 0.75rem;
  color: #C4B5FD;
  display: block;
  margin-bottom: 2px;
}
.crit-feedback {
  font-size: 0.72rem;
  color: #A19EB7;
  line-height: 1.35;
}
.rubric-notes {
  font-size: 0.78rem;
  color: #EDE9FE;
  border-top: 1px solid #2A224D;
  padding-top: 8px;
}

@media (max-width: 480px) {
  .canvas-toolbar { padding: 10px 14px; }
  .canvas-body { padding: 12px; }
  .literary-editor { font-size: 1rem; padding: 16px; }
}
</style>
