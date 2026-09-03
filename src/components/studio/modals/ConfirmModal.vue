<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card confirm-card">
      <h3 class="serif modal-title">{{ title }}</h3>
      <p class="modal-desc">{{ message }}</p>

      <div class="modal-buttons">
        <button
          :class="['btn-action', danger ? 'btn-danger' : 'btn-primary']"
          @click="$emit('confirm')"
        >
          {{ confirmText }}
        </button>
        <button class="btn-close-modal" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Are you sure?',
  },
  message: {
    type: String,
    default: 'This action cannot be undone.',
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  danger: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close', 'confirm'])
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 450; padding: 20px;
}
.confirm-card {
  background: #120E22; border: 1px solid #3B2D6B;
  border-radius: 16px; padding: 24px;
  width: 100%; max-width: 400px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.7);
}
.serif { font-family: 'Fraunces', Georgia, serif; }
.modal-title { font-size: 1.25rem; color: #FFF; margin-bottom: 6px; }
.modal-desc { font-size: 0.84rem; color: #A19EB7; margin-bottom: 18px; line-height: 1.4; }

.modal-buttons {
  display: flex; gap: 10px; align-items: center;
}
.btn-action {
  padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 0.86rem;
  cursor: pointer; border: none;
}
.btn-primary {
  background: linear-gradient(135deg, #6210CC, #7C3AED); color: #FFF;
}
.btn-danger {
  background: #EF4444; color: #FFF;
}
.btn-danger:hover { background: #DC2626; }
.btn-close-modal {
  background: none; border: none; color: #A19EB7; padding: 10px; cursor: pointer; font-size: 0.86rem;
}
.btn-close-modal:hover { color: #FFF; }
</style>
