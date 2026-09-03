<template>
  <DefaultLayout>
    <!-- Ambient Glowing Mesh Background -->
    <div class="glow-orb" />

    <!-- ===================== HERO SECTION ===================== -->
    <section class="hero-section">
      <div class="container hero-container">
        <!-- Top Badge -->
        <div class="badge-wrapper">
          <span class="badge-gradient">
            <span class="pulse-dot" />
            <span>Autonomous Long-Form Narrative Engine</span>
          </span>
        </div>

        <!-- Animated Hero Title with Hand & Pen Writing Effect -->
        <div class="hero-title-container">
          <h1 class="serif gradient-text hero-title">
            <span class="written-text">{{ displayedHeroText }}</span>
            <!-- Hand and Pen Writing Element -->
            <span class="pen-writer-anchor" :class="{ 'is-writing': isWritingHero }">
              <img
                src="/hand-pen.png"
                alt="Pen writing literary manuscript"
                class="hand-pen-img"
              />
              <span class="ink-glow-dot" />
            </span>
          </h1>
        </div>

        <!-- Hero Subtitle -->
        <p class="hero-subtitle">
          PenQraft orchestrates specialized AI agents across a persistent Story Bible, dynamic character lore, and an Evaluator-Optimizer revision engine to craft full-length novels and screenplays without context decay.
        </p>

        <!-- Hero CTA Buttons -->
        <div class="hero-actions">
          <router-link to="/app" class="btn-primary hero-btn-main">
            Enter PenQraft Studio &rarr;
          </router-link>
          <a href="#agents" class="btn-outline hero-btn-sub">
            Explore the 8 Agents
          </a>
        </div>

        <!-- Interactive Studio Mockup Window -->
        <div class="glass-card mockup-window">
          <!-- Window Header -->
          <div class="mockup-header">
            <div class="traffic-lights">
              <span class="light red" />
              <span class="light yellow" />
              <span class="light green" />
              <span class="mono mockup-title">project: "The Obsidian Throne" • chapter: 1</span>
            </div>

            <div class="demo-tabs">
              <button
                v-for="tab in demoTabs"
                :key="tab.id"
                class="demo-tab"
                :class="{ active: activeDemoTab === tab.id }"
                @click="switchTab(tab.id)"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Window Content Grid -->
          <div class="mockup-grid">
            <!-- Story Bible Sidebar -->
            <div class="mockup-sidebar">
              <div class="sidebar-header">
                <span class="flex-align">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  Story Bible Context
                </span>
                <span class="badge-gradient mini-badge">Active</span>
              </div>

              <div class="bible-items">
                <div class="bible-item active-item">
                  <div class="item-title">Elysia Vance (Protagonist)</div>
                  <div class="item-desc">Runic scar across right brow; master clockwork chronologist.</div>
                </div>
                <div class="bible-item">
                  <div class="item-title">Setting: Cathedral of Solitude</div>
                  <div class="item-desc">Crimson stained-glass dome beneath the midnight eclipse.</div>
                </div>
                <div class="bible-item">
                  <div class="item-title">Voice Profile: Literary Gothic</div>
                  <div class="item-desc">Sensory-dense, rhythmic clause variation, elevated cadence.</div>
                </div>
              </div>
            </div>

            <!-- Output Screen -->
            <div class="mockup-output">
              <div>
                <div class="output-header">
                  <span class="mono stream-status">
                    <span class="status-dot" />
                    {{ activeTabObj.status }}
                  </span>
                  <span class="mono iteration-tag">
                    Iteration: {{ activeTabObj.iteration }}
                  </span>
                </div>

                <div class="output-text-box serif">
                  <span>{{ streamingMockupText }}</span>
                  <span class="typing-cursor" />
                </div>
              </div>

              <div class="telemetry-bar mono">
                <div>Score: <strong style="color: #34D399;">{{ activeTabObj.score }}</strong> • Canon-Adherent</div>
                <div>Words: <span>{{ activeTabObj.words }}</span> • Metered: <span style="color: var(--color-accent);">{{ activeTabObj.credits }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== SECTION 2: 8-AGENT ENSEMBLE ===================== -->
    <section id="agents" class="section-divider">
      <div class="container">
        <div class="section-heading">
          <span class="badge-gradient">Specialized Intelligence</span>
          <h2 class="serif gradient-text section-title">
            An Ensemble of Dedicated Agents
          </h2>
          <p class="section-subtitle">
            No generic chatbot prompts. Every agent executes a rigorous craft discipline, passing structured artifacts and maintaining strict narrative coherence across 100,000+ words.
          </p>
        </div>

        <div class="agents-grid">
          <div
            v-for="agent in agentCards"
            :key="agent.id"
            class="glass-card agent-hover-card"
            :class="{ 'featured-agent': agent.id === '04' }"
          >
            <div class="agent-icon">{{ agent.icon }}</div>
            <div class="mono agent-code">Agent {{ agent.id }} • {{ agent.discipline }}</div>
            <h3 class="agent-name">{{ agent.name }}</h3>
            <p class="agent-desc">{{ agent.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== SECTION 3: STORY BIBLE & SUPERSESSION ===================== -->
    <section id="continuity" class="section-divider bg-dark-tint">
      <div class="container">
        <div class="two-col-grid">
          <div>
            <span class="badge-gradient">Zero Hallucinations</span>
            <h2 class="serif gradient-text section-title text-left">
              The Persistent Story Bible & Supersession Engine
            </h2>
            <p class="text-left-lead">
              Standard LLMs forget character eye colors, timeline rules, and geography after 20 pages. PenQraft maintains a structured canon ledger that injects exact context into every agent call.
            </p>
            <div class="feature-bullets">
              <div class="bullet-item">
                <span class="bullet-check">✓</span>
                <div>
                  <strong class="bullet-title">Immutable Supersession Chain</strong>
                  <p class="bullet-desc">When a plot decision changes, old facts are flagged superseded rather than overwritten, preserving narrative integrity and change logs.</p>
                </div>
              </div>
              <div class="bullet-item">
                <span class="bullet-check">✓</span>
                <div>
                  <strong class="bullet-title">Automated Fact Extraction</strong>
                  <p class="bullet-desc">As you draft, the Continuity Agent automatically extracts discovered lore and prompts you to confirm it into the Story Bible.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Supersession Demo Card -->
          <div class="glass-card ledger-card">
            <div class="ledger-header">
              <span class="mono ledger-tag">CANON TRACKER AUDIT TRAIL</span>
              <span class="badge-gradient mini-badge active-ledger">Active Ledger</span>
            </div>
            <div class="ledger-body">
              <!-- Superseded Record -->
              <div class="record-box superseded">
                <div class="record-top">
                  <span class="mono record-id strike">Record #11 • Character Lore</span>
                  <span class="status-pill superseded-pill">Superseded</span>
                </div>
                <p class="record-text strike">
                  "Elysia lost her right eye during the Siege of Valenor at age 19."
                </p>
              </div>

              <!-- Active Canonical Record -->
              <div class="record-box canonical">
                <div class="record-top">
                  <span class="mono record-id-active">Record #12 (Supersedes #11) • Character</span>
                  <span class="status-pill active-pill">Active Canon</span>
                </div>
                <p class="record-text-active">
                  "Elysia retains both eyes, but carries a runic clockwork scar over her right temple from the Artillery Explosion."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== SECTION 4: EVALUATOR-OPTIMIZER REVISION LOOP ===================== -->
    <section id="rubric" class="section-divider">
      <div class="container">
        <div class="section-heading">
          <span class="badge-gradient">Iterative Quality Assurance</span>
          <h2 class="serif gradient-text section-title">
            The Evaluator-Optimizer Revision Loop
          </h2>
          <p class="section-subtitle">
            When the Drafting Agent completes a scene, the Editorial Agent evaluates the draft against four weighted craft pillars. If any pillar scores below target thresholds, specific critique instructions trigger automated re-drafting passes until publication quality is achieved.
          </p>
        </div>

        <div class="rubric-grid">
          <div v-for="pillar in rubricPillars" :key="pillar.title" class="glass-card rubric-card">
            <div class="rubric-weight">{{ pillar.weight }}</div>
            <h4 class="rubric-title">{{ pillar.title }}</h4>
            <p class="rubric-desc">{{ pillar.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== SECTION 5: COMPARISON MATRIX ===================== -->
    <section id="comparison" class="section-divider bg-dark-tint">
      <div class="container">
        <div class="section-heading">
          <span class="badge-gradient">Architectural Difference</span>
          <h2 class="serif gradient-text section-title">
            Why Generic Chatbots Fail at Books
          </h2>
          <p class="section-subtitle">
            Single-prompt chatbots suffer from context collapse, generic tropes, and forgotten plot threads. PenQraft was purpose-built for multi-chapter coherence.
          </p>
        </div>

        <div class="glass-card table-card">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th class="generic-col">Generic Chatbot (ChatGPT / Claude)</th>
                <th class="penqraft-col">PenQraft Studio</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in comparisonData" :key="row.capability">
                <td class="capability-cell">{{ row.capability }}</td>
                <td class="generic-cell">{{ row.generic }}</td>
                <td class="penqraft-cell">{{ row.penqraft }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ===================== SECTION 6: PUBLISHING EXPORTS ===================== -->
    <section id="export" class="section-divider">
      <div class="container">
        <div class="section-heading">
          <span class="badge-gradient">Publishing Pipeline</span>
          <h2 class="serif gradient-text section-title">
            Direct Compilation into Industry Standards
          </h2>
          <p class="section-subtitle">
            Export with one click from chapter drafts into clean manuscript formats ready for literary agents, Amazon KDP, or Hollywood script readers.
          </p>
        </div>

        <div class="export-grid">
          <div v-for="format in exportFormats" :key="format.title" class="glass-card export-card">
            <div class="mono export-tag">{{ format.tag }}</div>
            <h3 class="export-title">{{ format.title }}</h3>
            <p class="export-desc">{{ format.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== SECTION 7: FAQ ACCORDION ===================== -->
    <section id="faq" class="section-divider bg-dark-tint">
      <div class="container faq-container">
        <div class="section-heading">
          <span class="badge-gradient">Questions & Answers</span>
          <h2 class="serif gradient-text section-title">
            Frequently Asked Questions
          </h2>
        </div>

        <div class="glass-card faq-card">
          <div
            v-for="(item, idx) in faqItems"
            :key="idx"
            class="faq-item"
            :class="{ open: openFaqIndex === idx }"
          >
            <button class="faq-question" @click="toggleFaq(idx)">
              <span>{{ item.question }}</span>
              <span class="faq-icon" :class="{ rotated: openFaqIndex === idx }">▾</span>
            </button>
            <div class="faq-answer" v-show="openFaqIndex === idx">
              {{ item.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== SECTION 8: BOTTOM CTA BANNER ===================== -->
    <section class="cta-banner-section">
      <div class="container">
        <div class="glass-card cta-banner-card">
          <h2 class="serif gradient-text cta-banner-title">
            Begin Architecting Your Masterpiece
          </h2>
          <p class="cta-banner-desc">
            Create a project, define your canon in the Story Bible, and start drafting scene by scene with 5,000 complimentary credits.
          </p>
          <div class="cta-actions">
            <router-link to="/register" class="btn-primary hero-btn-main">
              Launch PenQraft Studio &rarr;
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'

// ==================== HERO HANDWRITING ANIMATION ====================
const fullHeroText = 'Where Literary Masterpieces Are Architected by Agents'
const displayedHeroText = ref('')
const isWritingHero = ref(true)
let heroTypingTimer = null

function startHeroHandwriting() {
  let charIndex = 0
  displayedHeroText.value = ''
  isWritingHero.value = true

  if (heroTypingTimer) clearInterval(heroTypingTimer)

  heroTypingTimer = setInterval(() => {
    if (charIndex < fullHeroText.length) {
      displayedHeroText.value = fullHeroText.slice(0, charIndex + 1)
      charIndex++
    } else {
      clearInterval(heroTypingTimer)
      isWritingHero.value = false
      // Pause at full text for 5 seconds then restart writing smoothly
      setTimeout(() => {
        startHeroHandwriting()
      }, 5000)
    }
  }, 75)
}

// ==================== MOCKUP WINDOW DATA & TYPEWRITER ====================
const demoTabs = [
  { id: 'drafting', label: 'Drafting Agent' },
  { id: 'editorial', label: 'Editorial Evaluator' },
  { id: 'continuity', label: 'Continuity Auditor' },
]

const activeDemoTab = ref('drafting')

const tabData = {
  drafting: {
    status: 'Streaming Prose • Balanced Model Tier',
    iteration: '1/3',
    score: '0.94 / 1.00',
    words: '68 words',
    credits: '8 credits ($0.008)',
    text: 'Elysia adjusted the heavy collar of her archivist cloak, the bronze cipher cold against her collarbone. Rain pelted the stained glass of the High Spire, each drop fracturing the crimson moonlight into jagged prisms. "You were never meant to decipher the Third Chronicle," Lord Cassian whispered from the shadows beyond the cathedral tomb. "Some truths are buried because they burn."',
  },
  editorial: {
    status: 'Evaluating Draft Rubric • Senior Editorial Agent',
    iteration: '2/3',
    score: '0.98 / 1.00',
    words: '84 words',
    credits: '12 credits ($0.012)',
    text: '[CRITIQUE PASSED: Sensory 0.25, Stakes 0.25, Canon 0.25, Voice 0.23]\n"Revision directive applied: Strengthened the subtextual tension between Lord Cassian and Elysia. Introduced visceral chronomantic sensory details of gear friction and metallic resonance to reinforce chapter pacing."',
  },
  continuity: {
    status: 'Canon Verification Audit • Story Bible Tracker',
    iteration: '1/1',
    score: '1.00 / 1.00',
    words: '42 words',
    credits: '4 credits ($0.004)',
    text: '[AUDIT VERIFIED: 0 Contradictions Found]\n- Entity: Elysia Vance (Runic scar verified across right brow; eye color canonical)\n- Location: Cathedral of Solitude (Confirmed 3rd Era calendar entry)\n- Audit status: Canon Locked.',
  },
}

const activeTabObj = computed(() => tabData[activeDemoTab.value])
const streamingMockupText = ref('')
let mockupTypingTimer = null

function typeMockupText(text) {
  streamingMockupText.value = ''
  if (mockupTypingTimer) clearInterval(mockupTypingTimer)

  let i = 0
  mockupTypingTimer = setInterval(() => {
    if (i < text.length) {
      streamingMockupText.value += text.charAt(i)
      i++
    } else {
      clearInterval(mockupTypingTimer)
    }
  }, 16)
}

function switchTab(id) {
  activeDemoTab.value = id
  typeMockupText(tabData[id].text)
}

// ==================== 8 AGENT CARDS ====================
const agentCards = [
  { id: '01', discipline: 'Ideation', icon: '💡', name: 'Concept Agent', description: 'Translates raw premises into central dramatic arguments, core themes, high-concept hooks, and literary market comps.' },
  { id: '02', discipline: 'Architecture', icon: '📐', name: 'Structure Agent', description: 'Builds three-act structures, sequence breakdowns, scene beat sheets, target word counts, and cliffhanger trajectories.' },
  { id: '03', discipline: 'Lore & Canon', icon: '🌍', name: 'Worldbuilding Agent', description: 'Creates multi-dimensional characters (flaws, internal conflicts, needs), relationship matrices, sensory cultures, and geography.' },
  { id: '04', discipline: 'Prose Craft', icon: '✍️', name: 'Drafting Agent', description: 'Produces publication-grade prose strictly anchored in your Story Bible context and calibrated author voice profiles.' },
  { id: '05', discipline: 'Verification', icon: '📜', name: 'Continuity Agent', description: 'Scans newly generated prose against prior chapters, flagging character inconsistencies and logging newly discovered lore.' },
  { id: '06', discipline: 'Optimization', icon: '⚖️', name: 'Editorial Agent', description: 'Scores narrative tension, subtext, pacing, and dialogue authenticity, powering the automated self-revision loop.' },
  { id: '07', discipline: 'Tone Tuning', icon: '🎨', name: 'Stylist Agent', description: 'Tunes clause rhythm, vocabulary tier, metaphor density, and sentence variation to reflect distinctive prose voices.' },
  { id: '08', discipline: 'Publishing', icon: '📦', name: 'Export Agent', description: 'Compiles manuscripts into standard publishing formats: Markdown, Fountain Screenplay, EPUB e-books, and print-ready PDF.' },
]

// ==================== REVISION RUBRIC PILLARS ====================
const rubricPillars = [
  { weight: '0.25', title: 'Sensory Specificity', description: 'Concrete texture, visceral imagery, atmospheric temperature, and physical character reactions.' },
  { weight: '0.25', title: 'Dramatic Stakes', description: 'Clear scene conflicts, active protagonist agency, subtext in dialogue, and narrative momentum.' },
  { weight: '0.25', title: 'Canon Consistency', description: '100% adherence to established Story Bible traits, magical limitations, and chronological timelines.' },
  { weight: '0.25', title: 'Voice & Rhythm', description: 'Sentence variation, syntactic cadence, metaphor freshness, and fidelity to selected author styles.' },
]

// ==================== COMPARISON TABLE DATA ====================
const comparisonData = [
  {
    capability: 'Long-Form Memory',
    generic: 'Decays after ~15,000 words; hallucinates old details.',
    penqraft: '100,000+ words via Story Bible ledger.',
  },
  {
    capability: 'Canon Tracking',
    generic: 'None. Author must manually re-explain character facts.',
    penqraft: 'Automated audit trail with immutable supersession pointers.',
  },
  {
    capability: 'Quality Control',
    generic: 'Single-shot generation; relies entirely on author prompting.',
    penqraft: '4-pillar Evaluator-Optimizer loop with automated re-drafts.',
  },
  {
    capability: 'Author Voice Calibration',
    generic: 'Drifts into generic AI phrasing ("a testament to", "palpable").',
    penqraft: 'Extracted stylistic metrics (cadence, rhythm, metaphors).',
  },
  {
    capability: 'Publishing Exports',
    generic: 'Unformatted text copy-pasting.',
    penqraft: 'Markdown, Fountain Screenplay, EPUB, and print PDF.',
  },
]

// ==================== EXPORT FORMATS ====================
const exportFormats = [
  { tag: 'FORMAT 01', title: 'Standard Markdown', description: 'Clean headings, scene breaks, and YAML frontmatter ready for Obsidian, Scrivener, or Ulysses.' },
  { tag: 'FORMAT 02', title: 'Fountain Screenplay', description: 'Industry-standard script syntax formatted for Final Draft, Highland, and Fade In.' },
  { tag: 'FORMAT 03', title: 'EPUB 3.0 E-Book', description: 'Validated reflowable digital book format ready for Apple Books, Kobo, and Amazon Kindle.' },
  { tag: 'FORMAT 04', title: 'Typeset PDF', description: 'Formatted 6"x9" book interior with proper margins, running headers, and drop caps.' },
]

// ==================== FAQ ACCORDION ====================
const openFaqIndex = ref(0)

const faqItems = [
  {
    question: 'Who owns the copyright to manuscripts written with PenQraft?',
    answer: 'You retain 100% full legal copyright, commercial ownership, and publishing rights to all manuscripts, characters, and exports generated in PenQraft. We never claim ownership or train foundational models on your private drafts.',
  },
  {
    question: 'How does the credit system and USD metering work?',
    answer: '1,000 Credits equal exactly $1.00 USD. Every LLM token routed through your project is metered dynamically against frontier provider rates without predatory multipliers. On sign-up, you receive 5,000 complimentary welcome credits.',
  },
  {
    question: 'Can I import existing novels or story bibles?',
    answer: 'Yes. You can import existing manuscripts in Markdown or plain text. The Continuity and Worldbuilding Agents will read your import, extract characters and timeline facts, and populate your initial Story Bible automatically.',
  },
  {
    question: 'Which AI models power the agents?',
    answer: 'PenQraft uses a tri-tier model routing strategy: Economy tier (Claude 3 Haiku / GPT-4o-mini) for rapid ideation, Balanced tier (Claude 3.5 Sonnet) for evocative prose drafting, and Premium tier (Claude 3 Opus) for deep thematic architectural loops.',
  },
]

function toggleFaq(index) {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

onMounted(() => {
  startHeroHandwriting()
  typeMockupText(tabData.drafting.text)
})

onBeforeUnmount(() => {
  if (heroTypingTimer) clearInterval(heroTypingTimer)
  if (mockupTypingTimer) clearInterval(mockupTypingTimer)
})
</script>

<style scoped>
/* ==================== AMBIENT GLOW ==================== */
.glow-orb {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(300px, 65vw, 750px);
  height: clamp(300px, 65vw, 750px);
  background: radial-gradient(circle, rgba(98, 16, 204, 0.42) 0%, rgba(124, 58, 237, 0.18) 50%, transparent 70%);
  border-radius: 50%;
  filter: blur(85px);
  pointer-events: none;
  z-index: 0;
}

/* ==================== HERO SECTION (PERFECTLY CENTERED) ==================== */
.hero-section {
  padding: clamp(50px, 8vw, 100px) 0 clamp(40px, 6vw, 80px) 0;
  text-align: center;
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
}

.hero-container {
  max-width: 1040px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.badge-wrapper {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.badge-gradient {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 100px;
  background: rgba(98, 16, 204, 0.25);
  border: 1px solid rgba(167, 139, 250, 0.45);
  color: var(--color-accent);
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.pulse-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #A78BFA;
  box-shadow: 0 0 10px #A78BFA;
  animation: pulseDot 2s infinite;
}

/* ==================== HAND & PEN WRITING EFFECT ==================== */
.hero-title-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  max-width: 950px;
}

.hero-title {
  font-size: clamp(2.1rem, 5.5vw, 4.2rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.025em;
  text-align: center;
  margin: 0;
  position: relative;
  display: inline;
}

.written-text {
  display: inline;
}

.pen-writer-anchor {
  display: inline-block;
  position: relative;
  width: 0px;
  height: 0px;
  vertical-align: baseline;
  transition: transform 0.08s ease-out;
}

.hand-pen-img {
  position: absolute;
  bottom: -15px;
  left: 2px;
  width: clamp(75px, 12vw, 130px);
  height: auto;
  pointer-events: none;
  filter: drop-shadow(0 0 16px rgba(167, 139, 250, 0.65)) drop-shadow(0 12px 24px rgba(0, 0, 0, 0.9));
  transform-origin: bottom left;
  transform: rotate(-8deg);
  z-index: 10;
  user-select: none;
}

.is-writing .hand-pen-img {
  animation: penWritingSway 0.35s ease-in-out infinite alternate;
}

.ink-glow-dot {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #C4B5FD;
  box-shadow: 0 0 12px 4px rgba(167, 139, 250, 0.9), 0 0 20px 8px rgba(98, 16, 204, 0.7);
  pointer-events: none;
}

@keyframes penWritingSway {
  0% {
    transform: rotate(-10deg) translate(0px, 0px);
  }
  100% {
    transform: rotate(-6deg) translate(3px, -3px);
  }
}

.gradient-text {
  background: linear-gradient(135deg, #FFFFFF 0%, #E9D5FF 40%, #A78BFA 80%, #7C3AED 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.hero-subtitle {
  font-size: clamp(1rem, 2.2vw, 1.22rem);
  color: var(--color-text-muted);
  max-width: 760px;
  margin: 0 auto 38px auto;
  font-weight: 400;
  line-height: 1.65;
  text-align: center;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 56px;
  flex-wrap: wrap;
}

.hero-btn-main {
  font-size: 1.05rem;
  padding: 14px 34px;
}

.hero-btn-sub {
  font-size: 1.05rem;
  padding: 14px 28px;
}

/* ==================== MOCKUP WINDOW ==================== */
.mockup-window {
  text-align: left;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(98, 16, 204, 0.25);
  border-color: rgba(124, 58, 237, 0.4);
  width: 100%;
}

.mockup-header {
  background: rgba(11, 8, 20, 0.95);
  padding: 12px 18px;
  border-bottom: 1px solid var(--color-surface-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.traffic-lights {
  display: flex;
  align-items: center;
  gap: 8px;
}

.light {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.light.red { background: #EF4444; }
.light.yellow { background: #F59E0B; }
.light.green { background: #10B981; }

.mockup-title {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  margin-left: 10px;
}

.demo-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.demo-tab {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-surface-border);
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.demo-tab.active {
  background: var(--color-primary);
  border-color: var(--color-accent);
  color: #FFF;
}

.mockup-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 2fr);
  background: #0A0713;
}

@media (max-width: 820px) {
  .mockup-grid {
    grid-template-columns: 1fr;
  }
}

.mockup-sidebar {
  background: rgba(14, 9, 26, 0.9);
  border-right: 1px solid var(--color-surface-border);
  padding: 18px;
  font-size: 0.82rem;
}

.sidebar-header {
  text-transform: uppercase;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-align {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mini-badge {
  margin: 0;
  padding: 2px 7px;
  font-size: 0.65rem;
}

.bible-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bible-item {
  padding: 9px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.bible-item.active-item {
  background: rgba(98, 16, 204, 0.15);
  border-color: rgba(124, 58, 237, 0.3);
}

.item-title {
  font-weight: 600;
  color: #FFF;
  font-size: 0.8rem;
  margin-bottom: 2px;
}

.item-desc {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  line-height: 1.4;
}

.mockup-output {
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 320px;
}

.output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 8px;
}

.stream-status {
  font-size: 0.75rem;
  color: #34D399;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34D399;
  animation: pulseDot 1.5s infinite;
}

.iteration-tag {
  font-size: 0.72rem;
  color: var(--color-text-faint);
}

.output-text-box {
  font-size: clamp(0.92rem, 1.8vw, 1.05rem);
  line-height: 1.8;
  color: #F3F4F6;
  white-space: pre-line;
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: var(--color-accent);
  margin-left: 2px;
  vertical-align: middle;
  animation: typingBlink 0.9s infinite;
}

.telemetry-bar {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.73rem;
  color: var(--color-text-muted);
}

/* ==================== SECTIONS COMMON STYLES ==================== */
.section-divider {
  padding: clamp(50px, 7vw, 90px) 0;
  border-top: 1px solid var(--color-surface-border);
  position: relative;
}

.bg-dark-tint {
  background: rgba(14, 9, 24, 0.5);
}

.section-heading {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 56px auto;
}

.section-title {
  font-size: clamp(1.9rem, 4vw, 3rem);
  font-weight: 700;
  margin-top: 12px;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: clamp(0.92rem, 1.8vw, 1.05rem);
  color: var(--color-text-muted);
  line-height: 1.65;
}

/* ==================== AGENTS GRID ==================== */
.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.agent-hover-card {
  padding: 26px;
  cursor: default;
}

.agent-hover-card:hover {
  background: rgba(30, 23, 54, 0.95);
  border-color: rgba(167, 139, 250, 0.6);
  transform: translateY(-3px);
}

.featured-agent {
  border-color: rgba(124, 58, 237, 0.4);
  background: rgba(98, 16, 204, 0.1);
}

.agent-icon {
  font-size: 1.8rem;
  margin-bottom: 12px;
}

.agent-code {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-accent);
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.agent-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #FFF;
  margin-bottom: 8px;
}

.agent-desc {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

/* ==================== TWO COL STORY BIBLE ==================== */
.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(24px, 5vw, 56px);
  align-items: center;
}

@media (max-width: 860px) {
  .two-col-grid {
    grid-template-columns: 1fr;
  }
}

.text-left {
  text-align: left;
}

.text-left-lead {
  font-size: 1.02rem;
  margin-bottom: 24px;
  line-height: 1.65;
  color: var(--color-text-muted);
}

.feature-bullets {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bullet-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.bullet-check {
  color: var(--color-emerald);
  font-size: 1.1rem;
  font-weight: bold;
}

.bullet-title {
  color: #FFF;
  font-size: 0.95rem;
}

.bullet-desc {
  font-size: 0.86rem;
  margin-top: 2px;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.ledger-card {
  padding: 24px;
}

.ledger-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--color-surface-border);
  padding-bottom: 12px;
}

.ledger-tag {
  font-size: 0.78rem;
  color: var(--color-accent);
  font-weight: 600;
}

.active-ledger {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
  color: #34D399;
}

.ledger-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-box {
  padding: 12px 14px;
  border-radius: 8px;
}

.record-box.superseded {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.record-box.canonical {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.record-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.record-id.strike {
  font-size: 0.74rem;
  color: #F87171;
  text-decoration: line-through;
}

.record-id-active {
  font-size: 0.74rem;
  color: #34D399;
  font-weight: 600;
}

.status-pill {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
}

.superseded-pill {
  color: #EF4444;
}

.active-pill {
  color: #10B981;
}

.record-text.strike {
  font-size: 0.82rem;
  color: #FCA5A5;
  text-decoration: line-through;
}

.record-text-active {
  font-size: 0.84rem;
  color: #D1FAE5;
}

/* ==================== RUBRIC PILLARS ==================== */
.rubric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.rubric-card {
  padding: 24px;
  text-align: center;
}

.rubric-weight {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--color-accent);
  margin-bottom: 4px;
}

.rubric-title {
  font-size: 1.1rem;
  color: #FFF;
  margin-bottom: 8px;
}

.rubric-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

/* ==================== COMPARISON TABLE ==================== */
.table-card {
  overflow-x: auto;
  padding: 0;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
  min-width: 600px;
}

.comparison-table thead tr {
  border-bottom: 1px solid var(--color-surface-border);
  background: rgba(11, 8, 20, 0.9);
}

.comparison-table th {
  padding: 16px 20px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.comparison-table th.generic-col {
  color: #EF4444;
}

.comparison-table th.penqraft-col {
  color: var(--color-accent);
  font-weight: 700;
}

.comparison-table tbody tr {
  border-bottom: 1px solid rgba(42, 34, 77, 0.3);
}

.comparison-table td {
  padding: 16px 20px;
}

.capability-cell {
  font-weight: 600;
  color: #FFF;
}

.generic-cell {
  color: var(--color-text-muted);
}

.penqraft-cell {
  color: #34D399;
  font-weight: 600;
}

/* ==================== EXPORTS GRID ==================== */
.export-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.export-card {
  padding: 24px;
}

.export-tag {
  font-size: 0.75rem;
  color: var(--color-accent);
  margin-bottom: 8px;
}

.export-title {
  font-size: 1.15rem;
  color: #FFF;
  margin-bottom: 8px;
}

.export-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

/* ==================== FAQ ACCORDION ==================== */
.faq-container {
  max-width: 840px;
}

.faq-card {
  padding: clamp(16px, 4vw, 32px);
}

.faq-item {
  border-bottom: 1px solid var(--color-surface-border);
  padding: 20px 0;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  width: 100%;
  background: none;
  border: none;
  color: #FFF;
  font-family: var(--font-sans);
  font-size: 1.05rem;
  font-weight: 600;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: 16px;
}

.faq-icon {
  font-size: 1.2rem;
  color: var(--color-accent);
  transition: transform 0.3s ease;
}

.faq-icon.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  padding-top: 14px;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.65;
}

/* ==================== BOTTOM CTA BANNER ==================== */
.cta-banner-section {
  padding: clamp(60px, 8vw, 100px) 0;
}

.cta-banner-card {
  padding: clamp(36px, 6vw, 64px) 24px;
  text-align: center;
  background: radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.4) 0%, rgba(19, 14, 36, 0.95) 80%);
  border-color: rgba(167, 139, 250, 0.45);
  box-shadow: 0 20px 60px rgba(98, 16, 204, 0.3);
}

.cta-banner-title {
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 700;
  margin-bottom: 18px;
}

.cta-banner-desc {
  color: var(--color-text-muted);
  font-size: clamp(0.96rem, 2vw, 1.18rem);
  max-width: 620px;
  margin: 0 auto 36px auto;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* ==================== UTILITY & GLOBALS ==================== */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 640px) {
  .container {
    padding: 0 16px;
  }
}

.glass-card {
  background: var(--color-surface-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-surface-border);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.serif { font-family: var(--font-serif); }
.mono { font-family: var(--font-mono); }

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
  white-space: nowrap;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(98, 16, 204, 0.6);
  background: linear-gradient(135deg, #7014EA, #8B5CF6);
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
  white-space: nowrap;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

@keyframes typingBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
