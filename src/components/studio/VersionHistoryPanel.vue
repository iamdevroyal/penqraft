<template>
  <div v-if="isOpen" class="version-history-drawer">
    <div class="vh-header">
      <div class="vh-title-group">
        <span class="vh-title">Version History</span>
        <span class="vh-subtitle" v-if="unitTitle">{{ unitTitle }}</span>
      </div>
      <button class="vh-close-btn" @click="$emit('close')">✕</button>
    </div>

    <div v-if="isLoading" class="vh-loading">
      <div class="spinner"></div>
      <span>Loading history from archive…</span>
    </div>

    <div v-else-if="!versions || versions.length === 0" class="vh-empty">
      <div class="vh-empty-icon">📜</div>
      <p>No prior versions archived yet.<br>Every saved draft and approved agent pass will be tracked here.</p>
    </div>

    <div v-else class="vh-list">
      <div
        v-for="ver in versions"
        :key="ver.id || ver.version_number"
        class="vh-card"
      >
        <div class="vh-card-header">
          <div class="vh-badge">v{{ ver.version_number }}</div>
          <div class="vh-meta">
            <span class="vh-agent" v-if="ver.generated_by_agent">{{ ver.generated_by_agent }}</span>
            <span class="vh-date">{{ formatDate(ver.created_at) }}</span>
          </div>
        </div>

        <div class="vh-preview-snippet">
          {{ getSnippet(ver.content) }}
        </div>

        <div class="vh-card-footer">
          <span class="vh-wordcount">{{ countWords(ver.content) }} words</span>
          <button class="btn-restore" @click="$emit('restore-version', ver)">
            ↺ Restore this Version
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  versions: {
    type: Array,
    default: () => [],
  },
  unitTitle: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close', 'restore-version'])

function getSnippet(content) {
  if (!content) return '(Empty draft)'
  const trimmed = content.trim()
  return trimmed.length > 140 ? trimmed.substring(0, 140) + '…' : trimmed
}

function countWords(text) {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

function formatDate(dateStr) {
  if (!dateStr) return 'Recent'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
.version-history-drawer {
  background: #120E22;
  border-bottom: 1px solid #3B2D6B;
  padding: 16px 20px;
  max-height: 280px;
  overflow-y: auto;
  box-shadow: 0 12px 30px rgba(0,0,0,0.5);
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.vh-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  border-bottom: 1px solid #2A224D;
  padding-bottom: 8px;
}

.vh-title-group {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.vh-title {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 700;
  font-size: 1rem;
  color: #FFF;
}
.vh-subtitle {
  font-size: 0.78rem;
  color: #A78BFA;
}

.vh-close-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid #2A224D;
  color: #A19EB7;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vh-close-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #FFF;
}

.vh-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #A19EB7;
  font-size: 0.84rem;
  padding: 20px 0;
}
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #7C3AED;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.vh-empty {
  text-align: center;
  padding: 20px;
  color: #635F7E;
}
.vh-empty-icon { font-size: 1.8rem; margin-bottom: 6px; }
.vh-empty p { font-size: 0.8rem; line-height: 1.4; }

.vh-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.vh-card {
  background: rgba(18,14,34,0.7);
  border: 1px solid #2A224D;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  transition: border-color 0.2s;
}
.vh-card:hover { border-color: #7C3AED; }

.vh-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.vh-badge {
  background: #6210CC;
  color: #FFF;
  font-weight: 700;
  font-size: 0.72rem;
  padding: 2px 7px;
  border-radius: 4px;
}
.vh-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}
.vh-agent {
  font-size: 0.68rem;
  color: #34D399;
  background: rgba(16,185,129,0.12);
  padding: 1px 5px;
  border-radius: 3px;
}
.vh-date {
  font-size: 0.68rem;
  color: #A19EB7;
}

.vh-preview-snippet {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 0.78rem;
  color: #EDE9FE;
  line-height: 1.4;
  background: rgba(0,0,0,0.25);
  padding: 6px 8px;
  border-radius: 6px;
  max-height: 56px;
  overflow: hidden;
}

.vh-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #2A224D;
  padding-top: 6px;
}
.vh-wordcount {
  font-size: 0.7rem;
  color: #635F7E;
}
.btn-restore {
  background: rgba(124,58,237,0.15);
  color: #C4B5FD;
  border: 1px solid rgba(124,58,237,0.3);
  border-radius: 5px;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-restore:hover {
  background: #7C3AED;
  color: #FFF;
}
</style>
