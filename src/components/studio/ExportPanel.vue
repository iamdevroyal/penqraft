<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card export-card">
      <div class="modal-header">
        <h3 class="serif modal-title">Compile &amp; Export Manuscript</h3>
        <button class="btn-close-x" @click="$emit('close')">✕</button>
      </div>
      <p class="modal-desc">
        Compile all structural units and story canon into publication-grade formats.
      </p>

      <div class="export-options">
        <div class="format-chips">
          <button
            v-for="fmt in formats"
            :key="fmt.key"
            :class="['format-chip', { active: selectedFormat === fmt.key }]"
            @click="selectedFormat = fmt.key"
          >
            <span class="fmt-icon">{{ fmt.icon }}</span>
            <span class="fmt-label">{{ fmt.label }}</span>
          </button>
        </div>

        <button
          class="btn-compile"
          :disabled="isExporting"
          @click="generateExport"
        >
          <span v-if="isExporting" class="spinner"></span>
          {{ isExporting ? 'Compiling Manuscript…' : 'Generate ' + activeFormatLabel + ' Export' }}
        </button>
      </div>

      <!-- Result preview & download -->
      <div v-if="exportResult" class="export-result-area">
        <div class="result-header">
          <span class="result-filename">📄 {{ exportResult.file_name || ('manuscript.' + selectedFormat) }}</span>
          <div class="result-actions">
            <button class="btn-copy" @click="copyContent">
              {{ copied ? '✓ Copied' : '📋 Copy' }}
            </button>
            <button class="btn-download" @click="downloadFile">
              ⬇ Download
            </button>
          </div>
        </div>

        <textarea
          class="export-preview-box"
          :value="exportResult.content"
          readonly
          rows="8"
        ></textarea>
      </div>

      <div class="modal-buttons" style="margin-top: 16px;">
        <button class="btn-close-modal" @click="$emit('close')">Done</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { apiPost } from '../../services/api'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  projectId: {
    type: [Number, String],
    default: null,
  },
})

defineEmits(['close'])

const selectedFormat = ref('markdown')
const isExporting = ref(false)
const exportResult = ref(null)
const copied = ref(false)

const formats = [
  { key: 'markdown', label: 'Markdown (.md)', icon: '📝' },
  { key: 'fountain', label: 'Fountain Screenplay', icon: '🎬' },
]

const activeFormatLabel = computed(() => {
  return formats.find(f => f.key === selectedFormat.value)?.label || 'Manuscript'
})

async function generateExport() {
  if (!props.projectId) return
  isExporting.value = true
  exportResult.value = null
  copied.value = false

  try {
    const res = await apiPost(`/api/v1/projects/${props.projectId}/export`, {
      format: selectedFormat.value,
    })
    if (res?.data) {
      exportResult.value = res.data
    } else if (res?.content) {
      exportResult.value = res
    }
  } catch (err) {
    console.error('Export compilation error:', err)
  } finally {
    isExporting.value = false
  }
}

function copyContent() {
  if (!exportResult.value?.content) return
  navigator.clipboard.writeText(exportResult.value.content)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function downloadFile() {
  if (!exportResult.value?.content) return
  const filename = exportResult.value.file_name || `manuscript_${Date.now()}.${selectedFormat.value === 'fountain' ? 'fountain' : 'md'}`
  const blob = new Blob([exportResult.value.content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 350; padding: 20px;
}
.export-card {
  background: #120E22; border: 1px solid #3B2D6B;
  border-radius: 16px; padding: 24px;
  width: 100%; max-width: 580px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.7);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.serif { font-family: 'Fraunces', Georgia, serif; }
.modal-title { font-size: 1.3rem; color: #FFF; margin: 0; }
.modal-desc { font-size: 0.84rem; color: #A19EB7; margin-bottom: 18px; line-height: 1.4; }

.btn-close-x {
  background: none; border: none; color: #A19EB7; font-size: 1.1rem; cursor: pointer;
}
.btn-close-x:hover { color: #FFF; }

.export-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.format-chips {
  display: flex;
  gap: 10px;
}
.format-chip {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255,255,255,0.04);
  border: 1px solid #2A224D;
  border-radius: 8px;
  padding: 10px;
  color: #EDE9FE;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}
.format-chip.active, .format-chip:hover {
  background: rgba(98,16,204,0.2);
  border-color: #7C3AED;
  color: #FFF;
}
.btn-compile {
  padding: 11px;
  background: linear-gradient(135deg, #6210CC, #7C3AED);
  border: none;
  border-radius: 8px;
  color: #FFF;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-compile:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #FFF; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.export-result-area {
  background: rgba(0,0,0,0.3);
  border: 1px solid #2A224D;
  border-radius: 10px;
  padding: 12px;
  margin-top: 14px;
}
.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.result-filename {
  font-size: 0.8rem;
  font-weight: 700;
  color: #34D399;
}
.result-actions { display: flex; gap: 8px; }
.btn-copy, .btn-download {
  background: rgba(255,255,255,0.08);
  border: 1px solid #2A224D;
  border-radius: 6px;
  color: #FFF;
  font-size: 0.75rem;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: 600;
}
.btn-copy:hover, .btn-download:hover {
  background: #7C3AED; border-color: #7C3AED;
}
.export-preview-box {
  width: 100%;
  background: rgba(0,0,0,0.2);
  border: 1px solid #2A224D;
  border-radius: 6px;
  color: #EDE9FE;
  font-family: monospace;
  font-size: 0.8rem;
  padding: 10px;
  resize: vertical;
  outline: none;
}
.btn-close-modal {
  width: 100%; background: none; border: none; color: #A19EB7; padding: 6px; cursor: pointer; font-size: 0.86rem;
}
.btn-close-modal:hover { color: #FFF; }
</style>
