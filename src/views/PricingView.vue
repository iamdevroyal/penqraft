<template>
  <DefaultLayout>
    <section class="pricing-section">
      <div class="container">
        <span class="badge-gradient" style="margin-bottom: 16px;">Transparent Economics</span>
        <h1 class="serif gradient-text pricing-title">
          Predictable, USD-Pegged Credit Pricing
        </h1>
        <p class="pricing-subtitle">
          Every token is metered dynamically against direct provider rates with zero hidden markups. 1,000 Credits = $1.00 USD.
        </p>

        <div class="pricing-grid">
          <!-- Free / Starter Tier -->
          <div class="glass-card pricing-card">
            <div>
              <div class="tier-name">Free Starter</div>
              <div class="tier-price-row">
                <span class="tier-price">$0</span>
                <span class="tier-period">/ month</span>
              </div>
              <p class="tier-desc">
                Perfect for exploring narrative concepts, character worldbuilding, and short-form storytelling.
              </p>
              <div class="feature-list">
                <div class="feature-item"><span class="check-icon">✓</span> 5,000 Complimentary Welcome Credits</div>
                <div class="feature-item"><span class="check-icon">✓</span> Up to 3 Active Projects</div>
                <div class="feature-item"><span class="check-icon">✓</span> Economy & Balanced Model Tiers</div>
                <div class="feature-item"><span class="check-icon">✓</span> Story Bible & Continuity Tracker</div>
                <div class="feature-item"><span class="check-icon">✓</span> Standard Manuscript Export</div>
              </div>
            </div>
            <router-link to="/register" class="btn-outline full-width">
              Start Writing Free
            </router-link>
          </div>

          <!-- Pro Author Tier -->
          <div class="glass-card pricing-card featured-tier">
            <div class="popular-badge-wrap">
              <span class="badge-gradient popular-badge">Most Popular</span>
            </div>
            <div>
              <div class="tier-name">Pro Author</div>
              <div class="tier-price-row">
                <span class="tier-price">$19</span>
                <span class="tier-period">/ month</span>
              </div>
              <p class="tier-desc">
                For serious novelists, screenwriters, and studio authors publishing complete volumes.
              </p>
              <div class="feature-list">
                <div class="feature-item highlight"><span class="accent-check">✓</span> 25,000 Monthly Included Credits</div>
                <div class="feature-item"><span class="check-icon">✓</span> Up to 50 Concurrent Projects</div>
                <div class="feature-item"><span class="check-icon">✓</span> Access to Premium Frontier Models</div>
                <div class="feature-item"><span class="check-icon">✓</span> Automated Evaluator-Optimizer Loops</div>
                <div class="feature-item"><span class="check-icon">✓</span> Fountain Screenplay & EPUB Compilation</div>
                <div class="feature-item"><span class="check-icon">✓</span> Priority Agent Execution Queues</div>
              </div>
            </div>
            <router-link to="/register" class="btn-primary full-width">
              Upgrade to Pro &rarr;
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue'
</script>

<style scoped>
.pricing-section {
  padding: clamp(60px, 8vw, 100px) 0 clamp(40px, 6vw, 80px) 0;
  text-align: center;
}

.container {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 0 24px;
}

.serif {
  font-family: var(--font-serif);
}

.badge-gradient {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(98, 16, 204, 0.2);
  border: 1px solid rgba(167, 139, 250, 0.4);
  color: var(--color-accent);
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.gradient-text {
  background: linear-gradient(135deg, #FFFFFF 0%, #E9D5FF 40%, #A78BFA 80%, #7C3AED 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.pricing-title {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 700;
  margin-bottom: 18px;
}

.pricing-subtitle {
  color: var(--color-text-muted);
  font-size: clamp(1rem, 2vw, 1.15rem);
  max-width: 650px;
  margin: 0 auto 56px auto;
  line-height: 1.6;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  text-align: left;
}

.glass-card {
  background: var(--color-surface-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-surface-border);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.pricing-card {
  padding: clamp(24px, 4vw, 36px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.featured-tier {
  border-color: var(--color-primary-light);
  background: radial-gradient(circle at 100% 0%, rgba(98, 16, 204, 0.3) 0%, rgba(19, 14, 36, 0.95) 100%);
}

.popular-badge-wrap {
  position: absolute;
  top: -14px;
  right: 24px;
}

.popular-badge {
  background: var(--color-primary);
  color: #FFF;
  border-color: var(--color-primary-light);
  margin: 0;
  box-shadow: 0 4px 12px rgba(98, 16, 204, 0.4);
}

.tier-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #FFF;
  margin-bottom: 8px;
}

.tier-price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 16px;
}

.tier-price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #FFF;
}

.tier-period {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.tier-desc {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-bottom: 24px;
  line-height: 1.5;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 0.88rem;
  margin-bottom: 32px;
}

.feature-item {
  color: #E2E8F0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-item.highlight {
  color: #FFF;
  font-weight: 600;
}

.check-icon {
  color: var(--color-emerald);
}

.accent-check {
  color: var(--color-accent);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: #FFFFFF !important;
  font-weight: 600;
  padding: 12px 26px;
  border-radius: 10px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px var(--color-primary-glow);
  transition: all 0.25s ease;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text-main) !important;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid var(--color-surface-border);
  transition: all 0.2s ease;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.full-width {
  width: 100%;
}
</style>
