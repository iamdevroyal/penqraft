<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <h3 class="serif modal-title">Log Story Bible Fact</h3>
      <p class="modal-desc">
        Record immutable world facts, character psychology, and lore to maintain narrative continuity across agents.
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Category</label>
          <select v-model="form.category" class="modal-select">
            <option value="character">Character (Psychology, Arc, Flaw)</option>
            <option value="timeline">Timeline (Key Dates &amp; Events)</option>
            <option value="place">Place / Setting (Atmosphere &amp; Geography)</option>
            <option value="symbol">Symbol / Motif</option>
            <option value="lore">Lore &amp; Canon (Laws, Magic, Tech)</option>
          </select>
        </div>

        <div class="form-group">
          <label>Key / Subject *</label>
          <input
            type="text"
            v-model="form.key"
            class="modal-input"
            placeholder="e.g. Elysia Vance, Year 408"
            required
            autofocus
          />
        </div>

        <div class="form-group">
          <label>Fact &amp; Lore Value *</label>
          <textarea
            v-model="form.value"
            class="modal-textarea"
            rows="4"
            placeholder="Describe the immutable truth for your world…"
            required
          ></textarea>
        </div>

        <div class="modal-buttons">
          <button type="submit" class="btn-primary" :disabled="!form.key.trim() || !form.value.trim()">
            Save to Story Bible
          </button>
          <button type="button" class="btn-close-modal" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  category: 'character',
  key: '',
  value: '',
})

function handleSubmit() {
  if (!form.key.trim() || !form.value.trim()) return
  emit('save', { ...form })
  form.key = ''
  form.value = ''
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
.form-group label {
  display: block; font-size: 0.76rem; font-weight: 600; color: #C4B5FD; margin-bottom: 4px;
}
.modal-input, .modal-select, .modal-textarea {
  width: 100%; background: rgba(0,0,0,0.3); border: 1px solid #2A224D;
  border-radius: 8px; padding: 10px; color: #FFF; font-size: 0.86rem; outline: none;
  font-family: inherit; transition: border-color 0.2s;
}
.modal-input:focus, .modal-select:focus, .modal-textarea:focus { border-color: #7C3AED; }

.modal-buttons {
  display: flex; gap: 10px; margin-top: 20px; align-items: center;
}
.btn-primary {
  padding: 10px 20px;
  background: linear-gradient(135deg, #6210CC, #7C3AED);
  border: none; border-radius: 8px; color: #FFF; font-weight: 700; font-size: 0.88rem;
  cursor: pointer;
}
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-close-modal {
  background: none; border: none; color: #A19EB7; padding: 10px; cursor: pointer; font-size: 0.86rem;
}
.btn-close-modal:hover { color: #FFF; }
</style>
