<template>
  <aside class="agent-deck" :class="{ 'mobile-drawer mobile-drawer-right': isMobile }">
    <!-- Mobile close button -->
    <button v-if="isMobile" class="drawer-close drawer-close-right" @click="$emit('close')">✕</button>

    <div class="deck-header">
      <div class="deck-title-group">
        <span class="deck-title">Agent Command Deck</span>
        <span class="deck-subtitle">Ensemble Orchestration</span>
      </div>
      <div class="stream-indicator" v-if="isStreaming">
        <span class="live-dot"></span>
        <span>STREAMING</span>
      </div>
    </div>

    <!-- 8 Agents Grid -->
    <div class="agent-cards-grid">
      <div
        v-for="agent in agentList"
        :key="agent.key"
        :class="['agent-card', { active: activeAgentKey === agent.key }]"
        @click="$emit('update:activeAgentKey', agent.key)"
      >
        <span class="agent-icon">{{ agent.icon }}</span>
        <div class="agent-details">
          <span class="agent-name">{{ agent.name }}</span>
          <span class="agent-role">{{ agent.role }}</span>
        </div>
      </div>
    </div>

    <!-- Active Agent Console -->
    <div class="agent-console">
      <div class="console-header">
        <span class="console-title">{{ selectedAgent.name }} Console</span>
        <span class="console-cost-est">~15-25 Credits</span>
      </div>
      <p class="console-desc">{{ selectedAgent.description }}</p>

      <div class="console-input-group">
        <label class="input-label">Prompt / Directives</label>
        <textarea
          :value="promptInput"
          @input="$emit('update:promptInput', $event.target.value)"
          class="console-input"
          :placeholder="selectedAgent.placeholder"
          rows="3"
        ></textarea>
      </div>

      <button
        class="btn-run-agent"
        :disabled="isRunningAgent || isStreaming"
        @click="$emit('execute-agent')"
      >
        <span v-if="isRunningAgent || isStreaming" class="spinner"></span>
        {{ isStreaming ? 'Streaming Response…' : (isRunningAgent ? 'Orchestrating…' : 'Dispatch ' + selectedAgent.name) }}
      </button>
    </div>

    <!-- Agent Output Panel -->
    <div v-if="latestAgentOutput || streamingContent" class="latest-output-panel">
      <div class="output-header">
        <span class="output-badge">
          {{ latestAgentOutput?.agent_key || selectedAgent.key }} · {{ isStreaming ? 'Streaming' : (latestAgentOutput?.status || 'ready') }}
        </span>
        <span class="output-time">{{ latestAgentOutput?.created_at || 'Just now' }}</span>
      </div>

      <!-- Live streamed content or static output preview -->
      <div class="output-preview">
        {{ isStreaming ? streamingContent : (latestAgentOutput?.content || '') }}
        <span v-if="isStreaming" class="typing-cursor">▌</span>
      </div>

      <div class="output-actions" v-if="!isStreaming && latestAgentOutput?.status === 'pending_review'">
        <button class="btn-approve" @click="$emit('approve-output', latestAgentOutput.id)">
          ✓ Approve &amp; Commit
        </button>
        <button class="btn-reject" @click="$emit('reject-output', latestAgentOutput.id)">
          ✕ Reject
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  agentList: {
    type: Array,
    required: true,
  },
  activeAgentKey: {
    type: String,
    default: 'drafting',
  },
  promptInput: {
    type: String,
    default: '',
  },
  isRunningAgent: {
    type: Boolean,
    default: false,
  },
  isStreaming: {
    type: Boolean,
    default: false,
  },
  streamingContent: {
    type: String,
    default: '',
  },
  latestAgentOutput: {
    type: Object,
    default: null,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'update:activeAgentKey',
  'update:promptInput',
  'execute-agent',
  'approve-output',
  'reject-output',
  'close',
])

const selectedAgent = computed(() => {
  return props.agentList.find(a => a.key === props.activeAgentKey) || props.agentList[3]
})
</script>

<style scoped>
.agent-deck {
  width: 340px;
  background: #0D0A1A;
  border-left: 1px solid #2A224D;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 14px;
  gap: 14px;
  flex-shrink: 0;
  transition: width 0.25s ease;
}

.mobile-drawer {
  position: fixed !important;
  top: 56px;
  right: 0;
  bottom: 0;
  width: 310px !important;
  z-index: 100;
  box-shadow: -6px 0 30px rgba(0,0,0,0.7);
}

.drawer-close {
  position: absolute;
  top: 8px;
  left: 10px;
  background: rgba(255,255,255,0.07);
  border: 1px solid #2A224D;
  color: #FFF;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  z-index: 101;
}

.deck-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #2A224D;
  padding-bottom: 10px;
}
.deck-title {
  display: block;
  font-weight: 700;
  font-size: 0.92rem;
  color: #FFF;
}
.deck-subtitle {
  font-size: 0.72rem;
  color: #A19EB7;
}

.stream-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(16,185,129,0.15);
  border: 1px solid rgba(16,185,129,0.3);
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #34D399;
  letter-spacing: 0.05em;
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  animation: pulse 1.2s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

.agent-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}
.agent-card {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px;
  background: rgba(18,14,34,0.6);
  border: 1px solid #2A224D;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.agent-card:hover, .agent-card.active {
  border-color: #7C3AED;
  background: rgba(98,16,204,0.2);
}
.agent-icon { font-size: 1rem; }
.agent-name {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  color: #FFF;
}
.agent-role {
  display: block;
  font-size: 0.64rem;
  color: #A19EB7;
}

.agent-console {
  background: rgba(18,14,34,0.8);
  border: 1px solid #3B2D6B;
  border-radius: 10px;
  padding: 13px;
}
.console-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}
.console-title {
  font-weight: 700;
  font-size: 0.86rem;
  color: #FFF;
}
.console-cost-est {
  font-size: 0.68rem;
  color: #A78BFA;
  font-weight: 600;
}
.console-desc {
  font-size: 0.76rem;
  color: #A19EB7;
  margin: 4px 0 10px;
  line-height: 1.4;
}

.input-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #C4B5FD;
  margin-bottom: 4px;
}
.console-input {
  width: 100%;
  background: rgba(0,0,0,0.3);
  border: 1px solid #2A224D;
  border-radius: 7px;
  padding: 8px;
  color: #FFF;
  font-size: 0.8rem;
  outline: none;
  resize: none;
  margin-bottom: 10px;
  font-family: inherit;
  transition: border-color 0.2s;
}
.console-input:focus {
  border-color: #7C3AED;
}

.btn-run-agent {
  width: 100%;
  background: linear-gradient(135deg, #6210CC, #7C3AED);
  border: none;
  color: #FFF;
  font-weight: 700;
  font-size: 0.84rem;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: all 0.2s;
}
.btn-run-agent:hover:not(:disabled) {
  box-shadow: 0 4px 16px rgba(98,16,204,0.5);
}
.btn-run-agent:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #FFF;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.latest-output-panel {
  background: rgba(18,14,34,0.9);
  border: 1px solid #2A224D;
  border-radius: 10px;
  padding: 12px;
}
.output-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
}
.output-badge {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #34D399;
}
.output-time {
  font-size: 0.68rem;
  color: #635F7E;
}
.output-preview {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 0.86rem;
  line-height: 1.55;
  color: #EDE9FE;
  max-height: 180px;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 8px;
  background: rgba(0,0,0,0.25);
  border-radius: 6px;
  white-space: pre-wrap;
}

.typing-cursor {
  display: inline-block;
  color: #A78BFA;
  animation: blink 0.8s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.output-actions {
  display: flex;
  gap: 7px;
}
.btn-approve {
  flex: 1;
  background: #10B981;
  color: #FFF;
  border: none;
  padding: 7px;
  border-radius: 6px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-approve:hover { background: #059669; }
.btn-reject {
  background: rgba(239,68,68,0.2);
  color: #F87171;
  border: 1px solid rgba(239,68,68,0.4);
  padding: 7px 12px;
  border-radius: 6px;
  font-size: 0.76rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-reject:hover {
  background: rgba(239,68,68,0.3);
}
</style>
