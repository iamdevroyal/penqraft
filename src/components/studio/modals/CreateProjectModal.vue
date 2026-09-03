<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <h3 class="serif modal-title">Start New Project</h3>
      <p class="modal-desc">Configure your narrative universe, structural type, and AI model tier.</p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Project Title *</label>
          <input
            type="text"
            v-model="form.title"
            class="modal-input"
            placeholder="e.g. The Obsidian Sovereign"
            required
            autofocus
          />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>Project Type</label>
            <select v-model="form.project_type" class="modal-select">
              <option value="novel">Novel (Chapters)</option>
              <option value="novella">Novella (Parts)</option>
              <option value="screenplay">Screenplay (Scenes)</option>
              <option value="short_story">Short Story (Beats)</option>
            </select>
          </div>

          <div class="form-group half">
            <label>Model Tier</label>
            <select v-model="form.model_tier" class="modal-select">
              <option value="balanced">Balanced (Sonnet / Pro)</option>
              <option value="premium">Premium (Opus / Ultra)</option>
              <option value="economy">Economy (Flash / Haiku)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Logline / Synopsis</label>
          <textarea
            v-model="form.synopsis"
            class="modal-textarea"
            rows="3"
            placeholder="An exiled archivist uncovers a forbidden bronze cipher in the High Spire…"
          ></textarea>
        </div>

        <div class="modal-buttons">
          <button type="submit" class="btn-primary" :disabled="isSubmitting || !form.title.trim()">
            <span v-if="isSubmitting" class="spinner"></span>
            {{ isSubmitting ? 'Creating Project…' : 'Create Project' }}
          </button>
          <button type="button" class="btn-close-modal" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'create'])

const isSubmitting = ref(false)
const form = reactive({
  title: '',
  project_type: 'novel',
  model_tier: 'balanced',
  synopsis: '',
})

async function handleSubmit() {
  if (!form.title.trim()) return
  emit('create', { ...form })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 400; padding: 20px;
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

.form-group { margin-bottom: 14px; }
.form-row { display: flex; gap: 12px; }
.form-group.half { flex: 1; }

.form-group label {
  display: block; font-size: 0.76rem; font-weight: 600; color: #C4B5FD; margin-bottom: 4px;
}
.modal-input, .modal-select, .modal-textarea {
  width: 100%; background: rgba(0,0,0,0.3); border: 1px solid #2A224D;
  border-radius: 8px; padding: 10px; color: #FFF; font-size: 0.86rem; outline: none;
  font-family: inherit; transition: border-color 0.2s;
}
.modal-input:focus, .modal-select:focus, .modal-textarea:focus {
  border-color: #7C3AED;
}
.modal-buttons {
  display: flex; gap: 10px; margin-top: 20px; align-items: center;
}
.btn-primary {
  padding: 10px 20px;
  background: linear-gradient(135deg, #6210CC, #7C3AED);
  border: none; border-radius: 8px; color: #FFF; font-weight: 700; font-size: 0.88rem;
  cursor: pointer; display: flex; align-items: center; gap: 8px;
}
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-close-modal {
  background: none; border: none; color: #A19EB7; padding: 10px; cursor: pointer; font-size: 0.86rem;
}
.btn-close-modal:hover { color: #FFF; }

.spinner {
  width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #FFF; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
