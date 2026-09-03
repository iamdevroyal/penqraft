<template>
  <aside class="sidebar" :class="{ 'mobile-drawer': isMobile }">
    <!-- Mobile close button -->
    <button v-if="isMobile" class="drawer-close" @click="$emit('close')">✕</button>

    <div class="sidebar-tabs">
      <button
        :class="['tab-btn', { active: activeSidebarTab === 'structure' }]"
        @click="activeSidebarTab = 'structure'"
      >
        📖 Manuscript
      </button>
      <button
        :class="['tab-btn', { active: activeSidebarTab === 'bible' }]"
        @click="activeSidebarTab = 'bible'"
      >
        📜 Story Bible <span class="count-chip">{{ storyBibleEntries.length }}</span>
      </button>
    </div>

    <!-- TAB 1: Manuscript Structure Tree -->
    <div v-if="activeSidebarTab === 'structure'" class="tab-pane">
      <div class="section-actions">
        <span class="section-heading">Structural Units</span>
        <button class="icon-btn" @click="$emit('add-unit')" title="Add Chapter / Unit">+</button>
      </div>

      <div v-if="structuralUnits.length === 0" class="welcome-empty">
        <div class="welcome-empty-icon">📄</div>
        <p>No chapters yet.<br>Click <strong>+</strong> to begin.</p>
      </div>

      <div class="unit-list">
        <div
          v-for="unit in structuralUnits"
          :key="unit.id"
          :class="['unit-item', { active: selectedUnit && selectedUnit.id === unit.id }]"
          @click="$emit('select-unit', unit)"
        >
          <div class="unit-info">
            <span class="unit-title">{{ unit.title }}</span>
            <span class="unit-meta">{{ unit.word_count || 0 }} words · {{ unit.status }}</span>
          </div>
          <span class="status-dot" :class="unit.status"></span>
        </div>
      </div>
    </div>

    <!-- TAB 2: Story Bible Canon Entries -->
    <div v-if="activeSidebarTab === 'bible'" class="tab-pane">
      <div class="section-actions">
        <span class="section-heading">Canon Entries</span>
        <button class="icon-btn" @click="$emit('open-add-bible')" title="Log Canon Fact">+</button>
      </div>

      <div class="category-filters">
        <button
          v-for="cat in ['all', 'character', 'timeline', 'place', 'symbol', 'lore']"
          :key="cat"
          :class="['pill-filter', { active: selectedCategory === cat }]"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div v-if="filteredBibleEntries.length === 0" class="welcome-empty">
        <div class="welcome-empty-icon">📚</div>
        <p>No canon entries yet.<br>Click <strong>+</strong> to log your first fact.</p>
      </div>

      <div class="bible-list">
        <div
          v-for="entry in filteredBibleEntries"
          :key="entry.id"
          :class="['bible-card', entry.category]"
        >
          <div class="bible-header">
            <span class="entry-key">{{ entry.key }}</span>
            <span class="entry-cat">{{ entry.category }}</span>
          </div>
          <p class="entry-value">{{ entry.value }}</p>
          <div class="bible-footer" v-if="entry.supersedes_entry_id">
            <span class="supersedes-tag">supersedes #{{ entry.supersedes_entry_id }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  structuralUnits: {
    type: Array,
    default: () => [],
  },
  storyBibleEntries: {
    type: Array,
    default: () => [],
  },
  selectedUnit: {
    type: Object,
    default: null,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select-unit', 'add-unit', 'open-add-bible', 'close'])

const activeSidebarTab = ref('structure')
const selectedCategory = ref('all')

const filteredBibleEntries = computed(() => {
  if (selectedCategory.value === 'all') return props.storyBibleEntries
  return props.storyBibleEntries.filter(e => e.category === selectedCategory.value)
})
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: #0D0A1A;
  border-right: 1px solid #2A224D;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  transition: width 0.25s ease;
}

.mobile-drawer {
  position: fixed !important;
  top: 56px;
  left: 0;
  bottom: 0;
  width: 290px !important;
  z-index: 100;
  box-shadow: 6px 0 30px rgba(0,0,0,0.7);
}

.drawer-close {
  position: absolute;
  top: 8px;
  right: 10px;
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

.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid #2A224D;
  flex-shrink: 0;
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  color: #A19EB7;
  padding: 11px 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.tab-btn.active {
  color: #FFF;
  border-bottom: 2px solid #7C3AED;
  background: rgba(98,16,204,0.1);
}

.count-chip {
  background: #6210CC;
  color: #FFF;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 8px;
}

.tab-pane {
  padding: 14px;
  overflow-y: auto;
  flex: 1;
}

.section-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.section-heading {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #A78BFA;
  letter-spacing: 0.06em;
}

.icon-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid #2A224D;
  color: #FFF;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.icon-btn:hover {
  background: rgba(98,16,204,0.3);
  border-color: #7C3AED;
}

.welcome-empty {
  text-align: center;
  padding: 24px 12px;
  color: #635F7E;
}
.welcome-empty-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}
.welcome-empty p {
  font-size: 0.82rem;
  line-height: 1.5;
}
.welcome-empty strong {
  color: #A78BFA;
}

.unit-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.unit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 11px;
  background: rgba(18,14,34,0.6);
  border: 1px solid #2A224D;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.unit-item:hover, .unit-item.active {
  border-color: #7C3AED;
  background: rgba(98,16,204,0.15);
}

.unit-info { min-width: 0; flex: 1; }
.unit-title {
  display: block;
  font-size: 0.84rem;
  font-weight: 600;
  color: #FFF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.unit-meta {
  font-size: 0.72rem;
  color: #A19EB7;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #F59E0B;
  flex-shrink: 0;
  margin-left: 8px;
}
.status-dot.revised { background: #10B981; }
.status-dot.approved { background: #6366F1; }
.status-dot.draft { background: #F59E0B; }

/* Category Filters */
.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 12px;
}
.pill-filter {
  background: rgba(255,255,255,0.04);
  border: 1px solid #2A224D;
  color: #A19EB7;
  padding: 3px 7px;
  border-radius: 10px;
  font-size: 0.7rem;
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.15s;
}
.pill-filter:hover {
  color: #FFF;
  border-color: #7C3AED;
}
.pill-filter.active {
  background: #6210CC;
  color: #FFF;
  border-color: #7C3AED;
}

.bible-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bible-card {
  background: rgba(18,14,34,0.8);
  border: 1px solid #2A224D;
  border-left: 3px solid #7C3AED;
  border-radius: 8px;
  padding: 9px 11px;
}
.bible-card.character { border-left-color: #8B5CF6; }
.bible-card.timeline { border-left-color: #F59E0B; }
.bible-card.place { border-left-color: #10B981; }
.bible-card.symbol { border-left-color: #EC4899; }
.bible-card.lore { border-left-color: #38BDF8; }

.bible-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
}
.entry-key {
  font-weight: 700;
  font-size: 0.82rem;
  color: #FFF;
}
.entry-cat {
  font-size: 0.64rem;
  text-transform: uppercase;
  color: #A19EB7;
}
.entry-value {
  font-size: 0.77rem;
  color: #D1D5DB;
  line-height: 1.4;
}
.supersedes-tag {
  font-size: 0.66rem;
  color: #A78BFA;
  font-family: monospace;
}
</style>
