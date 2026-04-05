# EduBridge - Ralph Mode: Overnight Autonomous Improvement

## Mission

You are building **EduBridge**, an offline-first AI math tutor for the **Gemma 4 Good Hackathon** (Kaggle, $200K prizes, deadline May 18 2026). The app must be incredible — award-winning level. Your job tonight is to maximize frontend quality, add missing features, and polish everything until it's Duolingo-quality.

**Judging criteria:**
- Impact & Vision (40pts): Real-world problem, inspiring vision
- Video Pitch (30pts): Engaging, compelling demo
- Technical Depth (30pts): Innovative use of Gemma 4 features

**Target tracks:** Main ($50K) + Future of Education ($10K) + Digital Equity ($10K) + Ollama ($10K) = up to $70K

---

## Project Context

**What it does:** An AI math tutor that runs on phones WITHOUT internet. Uses Gemma 4 (via Ollama locally or Google AI Studio cloud). Reads students' handwritten work via camera. Adapts difficulty to the student. Works in 6 languages. Nuri the owl is the mascot.

**Tech stack:**
- Next.js 16.2.2 (App Router, Turbopack)
- Tailwind CSS v4 (CSS-first config via @theme)
- Motion (framer-motion) v12 — import from `motion/react`
- Dexie.js v4 (IndexedDB)
- Zustand v5 (state)
- Recharts v3 (charts — installed but NOT yet used)
- Supabase (@supabase/ssr) — installed but NOT yet wired
- Serwist — installed but NOT yet configured
- Google AI via `@google/genai` (model: `gemma-3-27b-it`)
- Ollama for local inference (`gemma4`)

**API key:** Already configured in `.env.local` as `GOOGLE_AI_API_KEY`

---

## Current Architecture

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout (Inter + Funnel Sans + Geist Mono)
│   ├── error.tsx             # Error boundary
│   ├── manifest.ts           # PWA manifest
│   ├── globals.css           # Heritage Warmth color palette
│   ├── student/page.tsx      # Student entry point
│   ├── dashboard/page.tsx    # Parent/Teacher dashboard with AI insights
│   └── api/ai/
│       ├── chat/route.ts     # AI chat endpoint
│       ├── analyze/route.ts  # Handwriting analysis endpoint
│       └── generate/route.ts # Problem generation (JSON fallback for non-function-calling models)
├── components/
│   ├── onboarding/
│   │   ├── SplashLanguage.tsx      # Screen 1: Nuri + languages + "Works Offline" badge
│   │   ├── MeetMascot.tsx          # Screen 2: Name input
│   │   ├── AgeSelector.tsx         # Screen 3: Ages 5-16 (universal, no grades)
│   │   └── DiagnosticChallenge.tsx # Screen 4: One question at a time, 6 levels
│   ├── shared/
│   │   ├── Nuri.tsx                # SVG owl mascot (3 expressions: neutral/happy/thinking)
│   │   ├── SpeechBubble.tsx        # Typewriter text effect
│   │   ├── OfflineIndicator.tsx    # Online/offline status bar
│   │   └── LanguagePicker.tsx      # Language selector
│   └── tutor/
│       ├── Onboarding.tsx          # Orchestrates 4 onboarding screens
│       ├── TutorView.tsx           # Main tutor with 6 views: topic/problem/camera/thinking/feedback/mastery
│       ├── TopicPicker.tsx         # 7 topics grid with progress bars
│       ├── ProblemCard.tsx         # Problem display + answer input
│       ├── HandwritingCapture.tsx  # Camera capture + AI analysis
│       ├── NuriThinking.tsx        # "Nuri is checking..." interstitial
│       ├── FeedbackPanel.tsx       # Correct/Wrong feedback with Nuri speech
│       ├── MasteryCelebration.tsx  # Trophy + stats + region unlock
│       └── StatsBar.tsx            # Stars, streak, level display
├── lib/
│   ├── ai/                   # AI provider abstraction (Ollama + Cloud)
│   ├── adaptive/             # Engine (7 topics), diagnostic, level-map
│   ├── db/                   # Dexie schema (students, skills, sessions, answers, problems, achievements, syncQueue)
│   └── i18n/                 # 6 locales (en, es, hi, fr, ar, sw)
├── hooks/useOffline.ts
└── stores/student-store.ts   # Zustand: age, diagnosticLevel, totalStars, worldProgress
```

## Design System: Heritage Warmth

```css
--background: #F5F2E9    /* warm cream */
--foreground: #2D2926    /* dark brown */
--primary: #7D6B3D       /* gold-brown (CTAs, active states) */
--primary-light: #C4A96A /* light gold */
--primary-dark: #4A3F24  /* dark gold */
--secondary: #D4913A     /* warm amber */
--success: #4CAF50       /* vibrant green */
--danger: #B5493A        /* warm red */
--muted: #8C8782         /* gray-brown */
--card: #FFFFFF           /* white cards */
--border: #DCD8CB        /* warm border */
--surface-secondary: #E8E4D8  /* warm gray surfaces */
```

**Fonts:** Funnel Sans (headings, `font-display`), Inter (body, `font-sans`), Geist Mono (`font-mono`)
**Roundness:** 12px cards, 9999px pills/buttons, 50% circles
**Shadows:** `0 2px 4px #00000008, 0 12px 32px #0000000F`

---

## What Works Today

- 4-screen onboarding (language → name → age → diagnostic)
- 7 math topics including algebra with prerequisites
- AI problem generation (Gemma via Google AI Studio)
- Handwriting capture → AI analysis → feedback
- "Nuri is checking..." interstitial (AI visible in every interaction)
- Topic mastery celebration with trophy + region unlock
- +30 Stars scan bonus
- Parent dashboard with AI-generated insights
- 6 languages (EN, ES, HI, FR, AR, SW)
- Heritage Warmth color palette
- Motion animations on onboarding, feedback, mastery
- PWA manifest + service worker + offline detection

---

## What Needs Improvement (YOUR TODO LIST)

### Priority 1: Frontend Polish (make it Duolingo-quality)

- [ ] **Landing page redesign** — Current landing is generic. Make it match Heritage Warmth, show Nuri prominently, add animated feature cards, social proof section ("2.2B people without internet"), before/after illustrations
- [ ] **Smooth page transitions** — Use `AnimatePresence` on the student page for transitions between all views. Currently some transitions are abrupt.
- [ ] **Responsive design audit** — Test and fix all screens at 375px, 390px, 428px, 768px widths. The app is mobile-first but hasn't been tested for edge cases.
- [ ] **Dark mode** — The CSS has dark mode vars defined but they're not updated for Heritage Warmth. Implement a proper dark warm theme.
- [ ] **Loading skeletons** — Replace spinners with shimmer skeleton screens for problem loading and AI thinking.
- [ ] **Micro-interactions** — Add `whileTap={{ scale: 0.97 }}` to ALL buttons. Add hover states to cards. Add focus rings to inputs.
- [ ] **TopicPicker → World Map** — The TopicPicker is a flat grid. Transform it into an illustrated journey list with themed colors per topic (green for Addition, blue for Subtraction, purple for Multiplication, etc.), connectors between topics, lock states, and segmented progress dots.
- [ ] **Progress visualization** — The StatsBar is basic. Add a daily goal ring (SVG circle), animate star counter on change, add streak flame that grows.

### Priority 2: Missing Features

- [ ] **Daily Hub screen** — After onboarding, students should land on a hub with: "Continue Journey" CTA, "Scan My Work" button, "Quick Practice" button, Nuri's tip of the day, and a bottom tab bar (Home, Journey, Scan, Progress)
- [ ] **Bottom Tab Bar** — Implement a persistent bottom navigation: Home (hub), Journey (world map), Scan (camera), Progress (stats). Use pill-style tabs with active state.
- [ ] **Student Progress page** — A `/student/progress` page showing: total stars, streak history, per-topic mastery bars with colors, achievements list, time spent this week
- [ ] **Achievements system** — Wire the `achievements` table in Dexie. Create badges: "First Step" (1 problem), "On Fire" (streak 5), "Meadow Master" (complete addition), "Camera Pro" (5 scans), "Polyglot" (switch languages). Show in progress page.
- [ ] **Seed more curriculum** — Only grade-3.json exists. Add problems for all age groups and topics. Create at least 5 problems per topic per difficulty level.
- [ ] **Settings page** — Add a settings/profile page accessible from the hub: change name, age, language. Parent gate (solve a multiplication to access dashboard).
- [ ] **Offline sync celebration** — When going from offline to online, show a celebration: "You're back online! Syncing 23 stars, 12 problems..." Use the syncQueue table.

### Priority 3: Technical Excellence

- [ ] **Wire Recharts** — Use Recharts in the dashboard for: weekly activity bar chart, accuracy trend line chart, topic comparison radar chart
- [ ] **Wire Supabase** — Set up Supabase client, implement sync from IndexedDB to cloud when online. Add teacher login flow.
- [ ] **Error handling everywhere** — Every fetch should have try/catch with user-friendly errors. Never show blank screens.
- [ ] **Accessibility pass** — Add `aria-label` to all icons, `role="status"` to loading states, `aria-valuenow` to progress bars, ensure color contrast passes WCAG AA.
- [ ] **Performance optimization** — Lazy load the dashboard page. Prefetch problems while student is reading current problem. Minimize bundle size.

---

## Quality Standards

### Code Quality
- TypeScript strict mode — no `any` types
- All components must have proper props interfaces
- Use existing design tokens from globals.css (never hardcode colors)
- Import `motion` from `motion/react` (NOT `framer-motion`)
- Use Tailwind classes, not inline styles
- Every new component should work offline

### Visual Quality
- Every screen must feel warm, inviting, and premium
- Nuri must appear on every student-facing screen
- Consistent spacing: 24px or 32px content padding, 12-16px component gaps
- Cards: white bg, border-border, rounded-xl or rounded-2xl, shadow-sm
- Buttons: rounded-full, h-14, font-semibold
- Text hierarchy: Funnel Sans for headings, Inter for body, Geist for captions

### Animation Standards
```typescript
// Page transitions
<AnimatePresence mode="wait">
  <motion.div key={view} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}>

// Button press
<motion.button whileTap={{ scale: 0.97 }}>

// Celebration
<motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:260,damping:20}}>

// Stagger children
const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
```

---

## Agent Review Loop

**IMPORTANT:** After completing each major feature or group of changes, you MUST run a review cycle:

### Step 1: Build
Run `npm run build` and fix ALL errors before proceeding.

### Step 2: Self-Review
Read back your code and check:
- Does it match the Heritage Warmth design system?
- Does Nuri appear where appropriate?
- Are animations smooth and purposeful?
- Does it work offline?
- Is it accessible?

### Step 3: Launch Critic Agent
After every significant milestone, spawn an agent with this prompt:

```
You are a harsh but fair product design critic reviewing the EduBridge codebase at /Users/fran/Desktop/gemma4/edubridge/. 

Read the ACTUAL source files (not screenshots) and evaluate:
1. Visual consistency — are Heritage Warmth colors used everywhere? Any hardcoded colors?
2. Animation coverage — is motion/react used on all interactive elements?
3. Feature completeness — are there dead ends or unfinished flows?
4. Code quality — any TypeScript errors, dead code, missing error handling?
5. Accessibility — ARIA labels, contrast ratios, keyboard navigation?
6. Offline resilience — what breaks without internet?

Score each category 1-10 and give SPECIFIC file:line fixes.
```

### Step 4: Fix Issues
Address every issue the critic found. Then re-build and re-review.

### Step 5: Hackathon Judge
Once the critic scores 8+/10 on all categories, spawn the final judge:

```
You are a hackathon judge for the Gemma 4 Good Hackathon ($200K prizes). Read ALL source files at /Users/fran/Desktop/gemma4/edubridge/ and score:
- Impact & Vision: X/40
- Video/Demo Potential: X/30  
- Technical Depth: X/30
- Total: X/100

Previous best score was 86/100. Has this improved? What's still missing to win?
```

---

## Key Constraints

- **DO NOT break existing functionality.** Always run `npm run build` after changes.
- **DO NOT remove features.** Only add or improve.
- **DO NOT change the API key** or environment configuration.
- **DO NOT add unnecessary dependencies.** Use what's already installed.
- **DO NOT create documentation files** unless explicitly needed.
- **The model for Google AI is `gemma-3-27b-it`** (set in cloud-provider.ts). It does NOT support function calling — use JSON fallback.
- **Funnel Sans** is the display/heading font. **Inter** is the body font.
- **All text must use `fill` color** — never leave text without a color class.
- **Test every change** — if you can't test visually, at minimum ensure `npm run build` passes.

---

## Definition of Done

The overnight session is complete when:
1. `npm run build` passes with 0 errors
2. The critic agent scores 8+/10 on all 6 categories
3. The hackathon judge scores 90+/100
4. Every screen has Nuri, animations, and Heritage Warmth colors
5. At least 3 new features from the TODO list are implemented
6. The app feels like a product you'd download from the App Store, not a hackathon prototype

Go build something incredible.
