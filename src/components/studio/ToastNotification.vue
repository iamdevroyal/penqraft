<template>
  <transition name="toast-anim">
    <div v-if="visible" :class="['toast-pill', type]">
      <span class="toast-icon">
        <template v-if="type === 'success'">✓</template>
        <template v-else-if="type === 'error'">✕</template>
        <template v-else>ℹ</template>
      </span>
      <span class="toast-msg">{{ message }}</span>
      <button class="toast-close" @click="$emit('close')">×</button>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info', // success, error, info
  },
})

defineEmits(['close'])
</script>

<style scoped>
.toast-pill {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 30px;
  font-size: 0.86rem;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  backdrop-filter: blur(12px);
}

.toast-pill.success {
  background: rgba(16, 185, 129, 0.95);
  color: #FFFFFF;
  border: 1px solid rgba(52, 211, 153, 0.5);
}

.toast-pill.error {
  background: rgba(239, 68, 68, 0.95);
  color: #FFFFFF;
  border: 1px solid rgba(248, 113, 113, 0.5);
}

.toast-pill.info {
  background: rgba(98, 16, 204, 0.95);
  color: #FFFFFF;
  border: 1px solid rgba(167, 139, 250, 0.5);
}

.toast-icon {
  font-weight: 800;
  font-size: 0.9rem;
}

.toast-msg {
  max-width: 320px;
}

.toast-close {
  background: none;
  border: none;
  color: rgba(255,255,255,0.8);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
}
.toast-close:hover {
  color: #FFF;
}

.toast-anim-enter-active, .toast-anim-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-anim-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}
.toast-anim-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
</style>
