<template>
  <div class="wallet-view">
    <div class="view-header">
      <div class="header-titles">
        <h1 class="view-title serif">PenQraft Wallet &amp; Billing</h1>
        <p class="view-subtitle">Raw model metering at zero markup. 1,000 Credits = $1.00 USD.</p>
      </div>
    </div>

    <!-- Balance Banner -->
    <div class="balance-banner">
      <div class="balance-info">
        <span class="balance-sub">Current Credit Balance</span>
        <div class="balance-main">
          <span class="credit-sym">🪙</span>
          <span class="credit-amount">{{ Number(wallet.balance_credits || 0).toLocaleString() }}</span>
          <span class="credit-unit">Credits</span>
        </div>
        <span class="balance-usd">Equivalent to ${{ Number(wallet.balance_usd || 0).toFixed(2) }} USD</span>
      </div>

      <div class="balance-actions">
        <button class="btn-topup-main" @click="showTopup = true">
          <span>+</span> Top Up Credits
        </button>
      </div>
    </div>

    <div class="wallet-grid">
      <!-- Plan & Subscription Details -->
      <div class="wallet-card">
        <h3 class="card-title">Active Subscription Plan</h3>
        <div class="plan-details" v-if="plan">
          <div class="plan-header">
            <span class="plan-name">{{ plan.name ? plan.name.toUpperCase() : 'AUTHOR PLAN' }}</span>
            <span class="plan-price">${{ plan.price_usd ? plan.price_usd.toFixed(2) : '0.00' }} / mo</span>
          </div>
          <div class="plan-tier-list">
            <span class="tier-chip" v-for="t in (plan.allowed_model_tiers || ['economy', 'balanced'])" :key="t">
              ✓ {{ t }}
            </span>
          </div>
          <p class="plan-note">Unlimited manuscript projects, continuity lore storage, and 8-agent access.</p>
        </div>
        <div v-else class="loading-inline">Loading plan details…</div>
      </div>

      <!-- Quick Top-up Options -->
      <div class="wallet-card">
        <h3 class="card-title">Instant Volume Top-ups</h3>
        <div class="quick-topups">
          <div class="topup-box" @click="executeTopup(10)">
            <span class="topup-price">$10.00</span>
            <span class="topup-credits">10,000 Credits</span>
          </div>
          <div class="topup-box featured" @click="executeTopup(25)">
            <span class="topup-badge">POPULAR</span>
            <span class="topup-price">$25.00</span>
            <span class="topup-credits">25,000 Credits</span>
          </div>
          <div class="topup-box" @click="executeTopup(50)">
            <span class="topup-price">$50.00</span>
            <span class="topup-credits">50,000 Credits</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions Ledger -->
    <div class="ledger-section">
      <h3 class="serif section-title">Transaction History</h3>
      <div class="ledger-table-wrap">
        <table class="ledger-table" v-if="transactions.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Reference / Agent</th>
              <th>Amount (USD)</th>
              <th>Credits</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in transactions" :key="tx.id">
              <td>#{{ tx.id }}</td>
              <td>
                <span class="tx-type-pill" :class="tx.type">{{ tx.type }}</span>
              </td>
              <td>{{ tx.reference || 'Wallet Operation' }}</td>
              <td>${{ Number(tx.amount_usd || 0).toFixed(2) }}</td>
              <td class="credits-col" :class="{ positive: tx.credits > 0, negative: tx.credits < 0 }">
                {{ tx.credits > 0 ? '+' : '' }}{{ (tx.credits || 0).toLocaleString() }}
              </td>
              <td class="date-col">{{ formatDate(tx.created_at) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-ledger">
          No ledger transactions logged yet.
        </div>
      </div>
    </div>

    <!-- Topup Modal -->
    <TopupModal
      :show="showTopup"
      :is-submitting="isSubmitting"
      @close="showTopup = false"
      @topup="executeTopup"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiGet, apiPost } from '../../services/api'
import TopupModal from '../../components/studio/modals/TopupModal.vue'

const wallet = ref({ balance_credits: 0, balance_usd: 0 })
const plan = ref(null)
const transactions = ref([])
const showTopup = ref(false)
const isSubmitting = ref(false)

async function fetchWalletData() {
  try {
    const res = await apiGet('/api/v1/wallet')
    const wData = res?.data || res
    if (wData?.wallet) {
      wallet.value = {
        balance_credits: Number(wData.data?.balance_credits ?? wData.wallet.balance_credits ?? 0),
        balance_usd: Number(wData.data?.balance_usd ?? wData.wallet.balance_usd ?? 0),
      }
    } else if (wData?.balance_credits !== undefined) {
      wallet.value = {
        balance_credits: Number(wData.balance_credits),
        balance_usd: Number(wData.balance_usd || (wData.balance_credits / 1000)),
      }
    }

    plan.value = wData.plan || res.plan || null
    transactions.value = wData.recent_transactions || res.recent_transactions || []
  } catch (err) {
    console.error('Wallet fetch error:', err)
  }
}

async function executeTopup(amountUsd) {
  isSubmitting.value = true
  try {
    const res = await apiPost('/api/v1/wallet/topup', { amount_usd: Number(amountUsd) })
    showTopup.value = false
    await fetchWalletData()
  } catch (err) {
    alert(err.message || 'Top up failed.')
  } finally {
    isSubmitting.value = false
  }
}

function formatDate(str) {
  if (!str) return 'Recent'
  try {
    const d = new Date(str)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return str
  }
}

onMounted(() => {
  fetchWalletData()
})
</script>

<style scoped>
.wallet-view {
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

/* Balance Banner */
.balance-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(98, 16, 204, 0.25), rgba(18, 14, 34, 0.8));
  border: 1px solid #7C3AED;
  border-radius: 16px;
  padding: 28px 32px;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(98, 16, 204, 0.2);
  flex-wrap: wrap;
  gap: 20px;
}

.balance-sub {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #C4B5FD;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
.balance-main {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.credit-sym { font-size: 1.8rem; }
.credit-amount {
  font-size: 2.8rem;
  font-weight: 800;
  color: #FFF;
  letter-spacing: -0.02em;
}
.credit-unit {
  font-size: 1.1rem;
  color: #A19EB7;
}
.balance-usd {
  font-size: 0.95rem;
  color: #34D399;
  font-weight: 600;
  display: block;
  margin-top: 4px;
}

.btn-topup-main {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #6210CC, #7C3AED);
  color: #FFF;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(98, 16, 204, 0.4);
}
.btn-topup-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(98, 16, 204, 0.6);
}

/* Grid */
.wallet-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 36px;
}
@media (max-width: 860px) {
  .wallet-grid { grid-template-columns: 1fr; }
}

.wallet-card {
  background: rgba(18, 14, 34, 0.7);
  border: 1px solid #2A224D;
  border-radius: 14px;
  padding: 24px;
}
.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #FFF;
  margin-bottom: 16px;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}
.plan-name { font-size: 1.2rem; font-weight: 800; color: #A78BFA; }
.plan-price { font-size: 1.1rem; font-weight: 700; color: #FFF; }
.plan-tier-list {
  display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;
}
.tier-chip {
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.15);
  color: #34D399;
  padding: 3px 8px;
  border-radius: 5px;
  text-transform: capitalize;
}
.plan-note { font-size: 0.85rem; color: #A19EB7; line-height: 1.4; }

.quick-topups {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.topup-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid #2A224D;
  border-radius: 10px;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.topup-box:hover {
  border-color: #7C3AED;
  background: rgba(98, 16, 204, 0.2);
  transform: translateY(-2px);
}
.topup-box.featured {
  border-color: #7C3AED;
  background: rgba(98, 16, 204, 0.15);
}
.topup-badge {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: #6210CC;
  color: #FFF;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}
.topup-price { display: block; font-weight: 800; font-size: 1.15rem; color: #FFF; margin-bottom: 2px; }
.topup-credits { font-size: 0.72rem; color: #C4B5FD; }

/* Ledger Table */
.section-title { font-size: 1.35rem; color: #FFF; margin-bottom: 14px; }
.ledger-table-wrap {
  background: rgba(18, 14, 34, 0.7);
  border: 1px solid #2A224D;
  border-radius: 12px;
  overflow-x: auto;
}
.ledger-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.ledger-table th {
  padding: 12px 18px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #A78BFA;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #2A224D;
}
.ledger-table td {
  padding: 14px 18px;
  font-size: 0.86rem;
  border-bottom: 1px solid rgba(42, 34, 77, 0.5);
  color: #EDE9FE;
}
.tx-type-pill {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(255,255,255,0.06);
}
.tx-type-pill.topup { background: rgba(16, 185, 129, 0.2); color: #34D399; }
.tx-type-pill.usage { background: rgba(124, 58, 237, 0.2); color: #C4B5FD; }
.credits-col.positive { color: #34D399; font-weight: 700; }
.credits-col.negative { color: #F87171; font-weight: 700; }
.date-col { color: #A19EB7; font-size: 0.8rem; }
.empty-ledger { padding: 32px; text-align: center; color: #635F7E; font-size: 0.9rem; }

@media (max-width: 640px) {
  .wallet-view { padding: 20px 16px; }
  .view-title { font-size: 1.6rem; }
  .balance-main .credit-amount { font-size: 2.2rem; }
}
</style>
