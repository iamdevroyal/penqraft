<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <h3 class="serif modal-title">Top Up PenQraft Wallet</h3>
      <p class="modal-desc">Credits are pegged to USD at 1,000 Credits = $1.00 USD. Direct provider token metering, zero markup.</p>

      <div class="topup-options">
        <button
          class="topup-tier-btn"
          :disabled="isSubmitting"
          @click="$emit('topup', 10)"
        >
          <div class="tier-left">
            <span class="tier-price">$10.00</span>
            <span class="tier-credits">10,000 Credits</span>
          </div>
          <span class="tier-arrow">&rarr;</span>
        </button>

        <button
          class="topup-tier-btn featured"
          :disabled="isSubmitting"
          @click="$emit('topup', 25)"
        >
          <div class="tier-left">
            <span class="tier-price">$25.00</span>
            <span class="tier-credits">25,000 Credits · Most Popular</span>
          </div>
          <span class="tier-badge">FEATURED</span>
        </button>

        <button
          class="topup-tier-btn"
          :disabled="isSubmitting"
          @click="$emit('topup', 50)"
        >
          <div class="tier-left">
            <span class="tier-price">$50.00</span>
            <span class="tier-credits">50,000 Credits</span>
          </div>
          <span class="tier-arrow">&rarr;</span>
        </button>
      </div>

      <div class="custom-topup-row">
        <label>Custom USD Amount:</label>
        <div class="custom-input-wrap">
          <span class="dollar-sign">$</span>
          <input
            type="number"
            min="5"
            step="5"
            v-model.number="customAmount"
            class="modal-input custom-input"
            placeholder="20"
          />
          <button
            class="btn-custom-topup"
            :disabled="isSubmitting || !customAmount || customAmount <= 0"
            @click="$emit('topup', customAmount)"
          >
            Add
          </button>
        </div>
      </div>

      <button class="btn-close-modal" @click="$emit('close')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close', 'topup'])

const customAmount = ref(15)
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

.topup-options { display: flex; flex-direction: column; gap: 9px; margin-bottom: 16px; }
.topup-tier-btn {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(255,255,255,0.04); border: 1px solid #2A224D;
  border-radius: 10px; padding: 13px 16px; color: #FFF; cursor: pointer; transition: all 0.2s;
  text-align: left;
}
.topup-tier-btn:hover, .topup-tier-btn.featured {
  border-color: #7C3AED; background: rgba(98,16,204,0.15);
}
.tier-price { font-weight: 700; font-size: 1.05rem; display: block; }
.tier-credits { color: #C4B5FD; font-size: 0.82rem; }
.tier-badge {
  font-size: 0.64rem; font-weight: 700; background: #6210CC; color: #FFF;
  padding: 3px 8px; border-radius: 6px;
}
.tier-arrow { color: #A19EB7; font-size: 1.1rem; }

.custom-topup-row {
  border-top: 1px solid #2A224D;
  padding-top: 14px;
  margin-bottom: 14px;
}
.custom-topup-row label {
  font-size: 0.75rem; color: #A19EB7; font-weight: 600; display: block; margin-bottom: 6px;
}
.custom-input-wrap {
  display: flex; align-items: center; gap: 8px; position: relative;
}
.dollar-sign {
  position: absolute; left: 10px; color: #A19EB7; font-weight: bold;
}
.custom-input {
  padding-left: 24px; flex: 1;
}
.modal-input {
  background: rgba(0,0,0,0.3); border: 1px solid #2A224D;
  border-radius: 8px; padding: 10px; color: #FFF; font-size: 0.86rem; outline: none;
}
.btn-custom-topup {
  padding: 10px 18px; background: #6210CC; border: none; border-radius: 8px;
  color: #FFF; font-weight: 700; cursor: pointer;
}
.btn-custom-topup:hover { background: #7C3AED; }

.btn-close-modal {
  width: 100%; background: none; border: none;
  color: #A19EB7; padding: 8px; cursor: pointer; font-size: 0.86rem;
}
.btn-close-modal:hover { color: #FFF; }
</style>
