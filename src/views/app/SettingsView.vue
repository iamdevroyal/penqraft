<template>
  <div class="settings-view">
    <div class="view-header">
      <div class="header-titles">
        <h1 class="view-title serif">Studio Preferences</h1>
        <p class="view-subtitle">Customize editor typography, orchestration defaults, and craft environment.</p>
      </div>
    </div>

    <div class="settings-container">
      <!-- Section 1: Craft & Orchestration -->
      <div class="settings-card">
        <h3 class="card-title">Orchestration &amp; Models</h3>
        <p class="card-desc">Default AI model tiers and agent dispatch behaviors.</p>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Default Model Tier</span>
            <span class="setting-hint">Used for newly created projects and chapter drafting.</span>
          </div>
          <select v-model="settings.defaultModelTier" class="setting-select" @change="saveSettings">
            <option value="economy">Economy (Flash / Haiku) · Lowest cost</option>
            <option value="balanced">Balanced (Sonnet / Pro) · Recommended</option>
            <option value="premium">Premium (Opus / Ultra) · Maximum craft</option>
          </select>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Default Active Agent</span>
            <span class="setting-hint">Which agent starts selected when opening the studio.</span>
          </div>
          <select v-model="settings.defaultAgent" class="setting-select" @change="saveSettings">
            <option value="drafting">Drafting (Prose Generation)</option>
            <option value="concept">Concept (Themes &amp; Comps)</option>
            <option value="structure">Structure (Beats &amp; Pacing)</option>
            <option value="character_world">Character (Psychology &amp; Lore)</option>
            <option value="continuity">Continuity (Story Bible Auditor)</option>
            <option value="editorial">Editorial (Rubric Evaluator)</option>
            <option value="style_voice">Style (Syntactic Rhythm)</option>
          </select>
        </div>
      </div>

      <!-- Section 2: Editor Typography -->
      <div class="settings-card">
        <h3 class="card-title">Editor Typography</h3>
        <p class="card-desc">Configure the writing canvas for maximum literary immersion.</p>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Editor Font Family</span>
            <span class="setting-hint">Choose between bookish editorial serif or modern sans.</span>
          </div>
          <select v-model="settings.editorFontFamily" class="setting-select" @change="saveSettings">
            <option value="'Fraunces', Georgia, serif">Fraunces (Literary Serif)</option>
            <option value="'Outfit', sans-serif">Outfit (Clean Sans)</option>
            <option value="system-ui, sans-serif">System Default</option>
          </select>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Editor Font Size</span>
            <span class="setting-hint">Adjust prose text size in the center writing canvas.</span>
          </div>
          <select v-model="settings.editorFontSize" class="setting-select" @change="saveSettings">
            <option value="1rem">Standard (16px)</option>
            <option value="1.12rem">Comfortable (18px) · Recommended</option>
            <option value="1.25rem">Large (20px)</option>
          </select>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Line Spacing</span>
            <span class="setting-hint">Vertical breathing room for drafting.</span>
          </div>
          <select v-model="settings.editorLineHeight" class="setting-select" @change="saveSettings">
            <option value="1.6">Tight (1.6x)</option>
            <option value="1.85">Atmospheric (1.85x) · Recommended</option>
            <option value="2.1">Double Spaced (2.1x)</option>
          </select>
        </div>
      </div>

      <!-- Section 3: Autosave & System -->
      <div class="settings-card">
        <h3 class="card-title">Autosave &amp; Environment</h3>
        <p class="card-desc">Data persistence and local cache settings.</p>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Enable Autosave on Blur</span>
            <span class="setting-hint">Automatically saves chapter drafts whenever focus shifts away.</span>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.autoSaveOnBlur" @change="saveSettings" />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">Stream Token Output</span>
            <span class="setting-hint">Stream agent tokens token-by-token in real time.</span>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="settings.streamTokens" @change="saveSettings" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Toast Feedback -->
      <div v-if="savedFeedback" class="save-toast">
        ✓ Preferences saved locally.
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'

const savedFeedback = ref(false)

const settings = reactive({
  defaultModelTier: 'balanced',
  defaultAgent: 'drafting',
  editorFontFamily: "'Fraunces', Georgia, serif",
  editorFontSize: '1.12rem',
  editorLineHeight: '1.85',
  autoSaveOnBlur: true,
  streamTokens: true,
})

function loadSettings() {
  const stored = localStorage.getItem('penqraft_studio_settings')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      Object.assign(settings, parsed)
    } catch {
      // Use defaults
    }
  }
}

function saveSettings() {
  localStorage.setItem('penqraft_studio_settings', JSON.stringify(settings))
  savedFeedback.value = true
  setTimeout(() => { savedFeedback.value = false }, 2500)
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings-view {
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

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
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
  margin-bottom: 20px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-top: 1px solid rgba(42, 34, 77, 0.5);
  gap: 20px;
}
.setting-item:first-of-type { border-top: none; padding-top: 0; }

.setting-info { flex: 1; }
.setting-label {
  display: block; font-size: 0.9rem; font-weight: 600; color: #EDE9FE; margin-bottom: 2px;
}
.setting-hint {
  font-size: 0.78rem; color: #635F7E;
}

.setting-select {
  background: rgba(0,0,0,0.3);
  border: 1px solid #2A224D;
  border-radius: 8px;
  padding: 8px 12px;
  color: #FFF;
  font-size: 0.86rem;
  outline: none;
  min-width: 220px;
}
.setting-select:focus { border-color: #7C3AED; }

/* Switch Toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute; cursor: pointer; inset: 0;
  background-color: rgba(255,255,255,0.1);
  border: 1px solid #2A224D;
  border-radius: 24px;
  transition: 0.25s;
}
.slider:before {
  position: absolute; content: "";
  height: 16px; width: 16px; left: 3px; bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.25s;
}
input:checked + .slider {
  background-color: #6210CC;
  border-color: #7C3AED;
}
input:checked + .slider:before {
  transform: translateX(20px);
}

.save-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: rgba(16, 185, 129, 0.95);
  color: #FFF;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 10px 18px;
  border-radius: 30px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  animation: fadeIn 0.2s;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 640px) {
  .settings-view { padding: 20px 16px; }
  .view-title { font-size: 1.6rem; }
  .setting-item { flex-direction: column; align-items: flex-start; }
  .setting-select { width: 100%; }
}
</style>
