# The Forge Premium Design Roadmap

**Prepared:** July 29, 2026  
**Timing:** Begin after completion and stabilization of the six functional reinforcement improvements  
**Objective:** Raise Forge's visual and experiential quality from approximately 8.1/10 to at least 9.3/10

## Outcome

Forge should feel like a premium training instrument: focused, deliberate,
responsive, data-rich, and unmistakably its own product.

The goal is not to imitate Apple Health, Hevy, MacroFactor, or Evolt screen for
screen. It is to combine Forge's training, nutrition, body, and scan data into
a clearer personal story than any one of those category-specific products can
provide.

The premium-design program should deliver:

- a formal design system rather than repeated one-off inline treatments
- a calmer information hierarchy with fewer nested cards
- a unified chart and metric language
- useful connections between training, nutrition, weight, measurements, and
  Evolt scans
- more confident typography and spacing
- polished empty, partial, loading, success, warning, and error states
- purposeful motion and richer completion feedback
- a mobile experience that feels intentionally installed rather than merely
  responsive

## Target scorecard

| Visual dimension | Current | Target |
|---|---:|---:|
| Brand identity | 9.0 | 9.6 |
| Information hierarchy | 8.3 | 9.4 |
| Component consistency | 8.5 | 9.6 |
| Typography and numbers | 7.8 | 9.2 |
| Mobile scannability | 7.6 | 9.3 |
| Charts and data storytelling | 7.4 | 9.4 |
| Motion and tactile polish | 7.2 | 9.1 |
| Native-platform feel | 6.8 | 8.6 |
| Accessibility | 7.8 | 9.3 |
| Distinctiveness | 8.7 | 9.7 |

The PWA architecture creates a practical ceiling on native-platform feel.
Reaching 9.3 overall does not require pretending that limitation does not
exist. Forge can compensate through brand coherence, data storytelling,
interaction quality, and excellent mobile ergonomics.

---

# Design north star

## “Forged Instrument Panel”

The visual direction should feel:

- serious but not clinical
- strong but not aggressive
- technical but understandable
- premium but not ornamental
- dark and focused without becoming muddy
- rewarding without becoming gamified

The existing charcoal, warm amber, off-white, blue, pink, green, and red
palette should remain. The amber accent is Forge's signature and should become
more disciplined—not more common.

Use amber for:

- primary actions
- active navigation
- selected state
- meaningful achievement
- current position

Do not use amber for every border, icon, label, and decoration. Premium design
comes from contrast and restraint.

## What premium does not mean

Avoid:

- glass effects on every surface
- gradients on every component
- excessive shadows
- metallic textures or literal flames
- dense “command center” dashboards
- animated charts on every load
- decorative gauges without decisions attached
- synthetic readiness or health scores unsupported by real data
- color used as the only indication of status

---

# Design-system foundation

This phase happens before redesigning individual screens.

## 1. Move from scattered inline treatments to tokens

Create:

- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/theme/chartTokens.js`
- reusable UI components under `src/components/ui/`

Recommended token groups:

### Color

```css
--forge-bg-0
--forge-bg-1
--forge-surface-1
--forge-surface-2
--forge-surface-raised
--forge-border-subtle
--forge-border-strong
--forge-text-primary
--forge-text-secondary
--forge-text-muted
--forge-amber
--forge-blue
--forge-pink
--forge-green
--forge-red
```

Metric colors must be stable across the entire app:

- calories: amber
- protein: blue
- carbohydrates: secondary amber/orange
- fat: pink
- body weight: off-white or teal
- lean mass: blue
- fat mass/body-fat percentage: pink
- workout volume: amber
- completed: green

### Typography

Retain system fonts for performance and native familiarity.

Define roles:

- display
- screen title
- section title
- card title
- body
- secondary
- label
- metric large
- metric medium
- tabular detail

Use tabular/monospace figures only where alignment improves comprehension.
Exercise names, explanations, and actions should remain in the body typeface.

Use fluid sizes carefully with `clamp()` while preserving readable minimums.

### Spacing

Use a four-point scale:

```text
4, 8, 12, 16, 20, 24, 32, 40
```

Every page should use the same horizontal gutter and vertical section rhythm.

### Shape

Limit the radius system:

- 8px: compact controls
- 12px: ordinary content surfaces
- 16px: important cards and bottom sheets
- full radius: pills/avatars only

### Elevation

Use three surface levels:

1. Page background
2. Standard content surface
3. Raised/temporary surface for sheets, dialogs, and hero actions

Most standard cards should use border and tonal contrast, not a large shadow.

## 2. Reusable premium primitives

Build and adopt:

- `PageHeader`
- `SectionHeader`
- `Surface`
- `MetricTile`
- `MetricStrip`
- `SegmentedControl`
- `RangeSelector`
- `StatusBadge`
- `ProgressRing`
- `Sparkline`
- `ChartCard`
- `InsightCard`
- `EmptyState`
- `InlineNotice`
- `BottomSheet`
- `ConfirmSheet`
- `Toast`
- `UndoToast`
- `StickyActionBar`

The purpose is not abstraction for its own sake. A shared primitive ensures
that spacing, touch size, type, disabled state, motion, and accessibility stay
consistent.

## 3. Flatten the interface

Current Forge frequently places a card inside a card-like page section beside
another card. The premium pass should:

- use page sections without containers when grouping is already obvious
- reserve cards for interactive or conceptually distinct content
- use dividers and whitespace for simple lists
- avoid more than two visible surface levels
- reduce repeated borders around controls already inside a bordered surface

This will make more information fit on screen while feeling calmer.

---

# Unified metric and chart strategy

Charts are the largest opportunity to move from 8.1 to 9.3.

## Guiding rule: overview, explanation, detail

Every metric should have three levels:

1. **Overview:** current value and direction
2. **Explanation:** what changed and over what period
3. **Detail:** the full chart, underlying entries, and filters

The Home screen shows the overview. The relevant tab explains. A detail sheet
or screen provides the complete history.

## Do not use misleading combined charts

Do not overlay unrelated units on an unlabeled dual-axis chart merely because
the data exists.

Preferred pattern:

- synchronized small charts sharing the same date axis
- one highlighted time range
- aligned vertical crosshair
- one shared comparison summary

An overlay is appropriate only when values share a meaningful unit, such as:

- body weight, lean mass, and fat mass in pounds
- calories consumed and calorie target
- prescribed and completed workout counts

## Shared chart grammar

All charts should use:

- consistent 4W, 12W, 6M, and All range controls where applicable
- consistent metric colors
- a goal/reference line style
- a current-value endpoint
- press/drag crosshair and tooltip
- explicit units
- readable start/end labels
- no unnecessary axis clutter
- accessible text summary
- graceful one-point and no-data states

Charts should not redraw with a dramatic animation every time the user changes
tabs. Use a subtle 180–260ms transition when the selected range changes.

## Recommended reusable chart primitives

Keep Forge self-contained by building a small tested SVG chart layer:

- `LineSeries`
- `AreaSeries`
- `BarSeries`
- `GoalLine`
- `GoalBand`
- `EventMarker`
- `Crosshair`
- `Tooltip`
- `Sparkline`
- `CalendarHeatmap`
- `ComparisonLegend`

This avoids a large charting framework while removing the duplicated scaling,
labeling, and range logic currently embedded in individual screens.

---

# New premium data experiences

## 1. Weekly Forge Brief

The Home screen should tell one weekly story using three pillars:

### Training

- program workouts completed
- working sets completed
- volume versus the previous comparable week
- recent PR

### Nutrition

- days logged
- average calorie-target difference
- protein-target consistency

### Body

- latest weight change
- latest scan or measurement change
- days since the last body entry

This is not a single invented “Forge Score.” Each pillar retains its real unit
and meaning.

The brief ends with one evidence-based sentence, for example:

- “You completed 4 workouts and hit protein on 5 of 7 logged days.”
- “Training volume increased 8% while body weight stayed within 0.6 lb.”
- “Your latest scan shows lean mass up 1.2 lb since June.”

Use factual language. Do not imply nutrition caused a training or body change.

## 2. Consistency matrix

Create a compact 7- or 14-day matrix:

| Row | Daily state |
|---|---|
| Training | workout completed or rest/no entry |
| Calories | within chosen target band |
| Protein | target reached |
| Weight | entry recorded |

This provides a more useful habit view than a generic streak number.

Color must be supplemented by icons or patterns.

## 3. Body recomposition story

Combine:

- frequent manual body weight
- Evolt scan weight
- lean body mass
- body fat mass
- body-fat percentage

Recommended presentation:

1. Main mass chart: weight, lean mass, and fat mass in the same selected unit
2. Smaller synchronized chart: body-fat percentage
3. Scan markers on the timeline
4. “Change since” selector:
   - previous scan
   - first scan
   - custom date

Show scan-derived values only on actual scan dates. Do not interpolate them as
though daily composition measurements exist.

## 4. Training progression story

Per exercise:

- estimated 1RM trend
- heaviest working set
- volume trend
- rep PRs
- program week markers
- drop-set segments visibly differentiated

Provide a compact sparkline on the exercise-history card and the complete chart
in a detail view.

For bodyweight movements:

- reps trend
- added weight or assistance trend
- best set

Never display a meaningless estimated 1RM for a reps-only movement.

## 5. Program progress timeline

Replace a purely numerical logged count with:

- week/block position
- completed days
- current day
- upcoming day
- program-completion percentage
- expandable previous weeks

This should feel like a training journey rather than a folder browser.

## 6. Nutrition adherence chart

Use synchronized daily bars:

- calories versus target
- protein versus target

Optional smaller indicators:

- carbs
- fat
- days with incomplete logging

Incomplete days should not be presented as confirmed zero-consumption days.

## 7. Scan comparison

Create a deliberate comparison mode:

- choose Scan A and Scan B
- headline changes in weight, lean mass, fat mass, body-fat percentage, and
  visceral metric
- body callouts show segmental lean/fat deltas
- green/amber coloring is contextual, not automatically “weight loss good”
- original PDFs remain one tap away

## 8. Cross-domain comparison

Only unlock this after enough data exists.

Recommended minimum:

- at least four comparable weeks
- sufficient nutrition logging coverage
- at least two workouts in each compared week

Use synchronized small multiples:

- workout volume
- protein-target percentage
- body weight

Copy should say:

> “In logged weeks…”  

It must not say:

> “Eating more protein caused…”

---

# Screen-by-screen redesign recommendations

## Home

### Current strengths

- strong greeting and brand tone
- clear calorie/macronutrient overview
- visible active plan
- useful highlights

### Recommended structure

1. **Compact header**
   - profile
   - greeting
   - settings/backup state
2. **Today**
   - next workout
   - calories remaining
   - protein remaining
   - one primary action
3. **This week**
   - Training, Nutrition, Body pillar strip
4. **Forge Brief**
   - one or two evidence-based insights
5. **Progress**
   - synchronized compact chart or consistency matrix

### Visual improvements

- Replace the large full-width amber warning with a smaller contextual insight
  unless immediate action is needed.
- Reduce the number of separate metric cards.
- Use one dominant hero action rather than several equally weighted panels.
- Give backup status a quiet but visible place.

## Train

### Plan overview

- Add the program timeline described above.
- Make completed, current, and upcoming states visually unmistakable.
- Keep week navigation compact.
- Show plan editing as a secondary action, not a competing hero.

### Day list

- Remove the repeated Strength pill when every visible item is strength.
- Use the freed space for:
  - completion status
  - A1/A2 superset position
  - warm-up/drop/AMRAP summary
  - last/best compact reference
- Use dividers or flatter grouped rows rather than a heavy card for every
  exercise.

### Active logging

- Create a sticky active-set bar near the bottom:
  - current exercise/set
  - rest timer
  - next action
- Make working, warm-up, drop, and AMRAP states distinct but restrained.
- Present previous and suggested values directly beside the input, not in
  separate decorative containers.
- Keep notes and history progressively disclosed.

### Supersets

- Show a shared group rail/bracket with A1/A2 labels.
- Animate focus from A1 to A2 with a short directional transition.
- Show “Rest after round” only after the final active group member.
- Keep list mode visually stable for users who dislike guided sequencing.

### Completion

Retain the forged stamp and glow. Enhance with:

- completed sets
- total volume
- PRs
- duration when available
- next scheduled workout
- a shareable card only if requested later

Avoid confetti that conflicts with the Forge identity.

## Body

### Recommended information architecture

Use three internal views:

1. **Overview**
   - current weight and goal
   - recomposition story
   - latest measurements
   - latest scan summary
2. **Body map**
   - Training and Scan modes
   - front/back and body model controls
   - segment callouts
3. **History**
   - weight
   - measurements
   - scan metrics
   - comparison mode

### Body-map polish

- Increase figure contrast slightly without making it bright.
- Reduce empty vertical space when no heat is present.
- Move legend and controls into a tighter, more deliberate frame.
- Use animated but subtle interpolation when changing front/back or range.
- Keep labels readable without crowding the silhouette.

### Measurement entry

- Use a bottom sheet after tapping a body region.
- Preselect the tapped region.
- Show prior value and date.
- Offer circumference/mass only when relevant.
- Confirm with a small anchored success state.

## Food

### Daily summary

- Keep the calorie ring but simplify its surrounding chrome.
- Add a seven-day strip above or below it.
- Show remaining protein more prominently because it is often the actionable
  daily number.

### Meals

- Use flatter expandable meal sections.
- Show 1–2 top food rows before expansion.
- Put Add, Copy, and Suggested actions in a consistent contextual menu.
- Preserve the prominent quick-add entry point.

### Add-food sheet

- Default to Suggested when available.
- Keep Barcode and Scan Label visually prominent.
- Group Manual and Recipe under secondary creation actions.
- Show source/serving confidence quietly during review.
- Use a persistent bottom “Add” action after food selection.

### History

- Replace four isolated statistic blocks with:
  - calorie adherence chart
  - protein adherence chart
  - logging coverage
  - one useful summary sentence

## Settings and setup

- Use clear grouped sections:
  - Profile
  - Units and goals
  - Nutrition
  - Training
  - Data and backup
  - About/build
- Backup status should have a visible healthy/due state.
- Restore remains visually cautious and distinct from ordinary import.

---

# Interaction and motion system

## Timing

Recommended durations:

- press feedback: 100–140ms
- selection/change: 160–200ms
- card expand/collapse: 200–240ms
- bottom sheet: 240–300ms
- chart range transition: 200–260ms
- major completion moment: 500–800ms

## Motion rules

- Animate state change, not decoration.
- Do not stagger every card on every tab visit.
- Keep the active bottom-navigation transition subtle.
- Use directional movement for forward/back workout flow.
- Use number interpolation only for meaningful changed totals.
- Preserve and expand the existing reduced-motion support.

## Feedback

Add:

- short success toast after saving
- Undo after removing a food or measurement where feasible
- explicit saved state for plan edits
- clear processing state for PDF/OCR/barcode work
- progress indication for long local OCR
- anchored validation near the relevant input

Native haptics cannot be relied on consistently in the PWA. Visual feedback
must remain complete without them.

---

# Copy and tone

Forge's best language is concise, confident, and earned.

Use:

- “Workout secured.”
- “Next: Week 3 · Day 2.”
- “Protein target hit 5 of 7 logged days.”
- “1.2 lb lean mass gained since the previous scan.”

Avoid:

- exaggerated motivational slogans
- judgmental nutrition language
- fake certainty
- medical conclusions
- generic AI-style paragraphs

Every insight should answer:

1. What happened?
2. Over what period?
3. What can the user inspect next?

---

# Accessibility as premium quality

Premium quality requires:

- WCAG AA contrast for normal text
- minimum comfortable 44×44px primary touch targets
- no essential information communicated by color alone
- meaningful button and chart labels
- logical focus order
- visible focus treatment
- layouts that survive larger text
- chart summaries for screen readers
- reduced-motion behavior
- labels that remain understandable without icons

Test at:

- 320px
- 390px
- 430px
- 200% text scaling where feasible

---

# Phased implementation

## Premium Phase 0 — Design specification

Deliver:

- token inventory
- component inventory
- annotated Home, Train, Body, and Food wireframes
- chart grammar
- seeded design-test states
- final target score rubric

No production UI changes in this phase.

## Premium Phase 1 — Foundation and navigation

Implement:

- tokens and global styles
- reusable primitives
- page gutters/type hierarchy
- bottom navigation refinement
- sheets, notices, toasts, and empty states

Migrate one screen at a time while preserving behavior.

## Premium Phase 2 — Home and Weekly Forge Brief

Implement:

- Today hero
- three-pillar weekly status
- consistency matrix
- factual insight cards
- compact active-plan treatment

Audit empty, partial, and rich-history states.

## Premium Phase 3 — Chart system and combined metrics

Implement reusable chart primitives, then:

1. body recomposition
2. nutrition adherence
3. exercise progression
4. scan comparison
5. qualified cross-domain comparisons

Do not implement all chart types independently.

## Premium Phase 4 — Train

Implement:

- flatter exercise list
- program timeline
- sticky active-set controls
- advanced set/superset visualization
- refined completion summary

This phase occurs after advanced workout structures are already functionally
stable.

## Premium Phase 5 — Body and Food

Implement:

- Body Overview/Map/History organization
- measurement bottom sheets
- tighter body-map frame
- flatter meals
- suggested-food priority
- nutrition history charts

## Premium Phase 6 — Motion and final polish

Implement:

- final transitions
- processing feedback
- success/undo behavior
- long-name and edge-case polish
- reduced-motion verification

## Premium Phase 7 — Design QA and scoring

Run:

- screenshot comparison at standard widths
- empty/partial/populated fixture review
- accessibility review
- complete task walkthrough
- installed-iPhone PWA review
- performance/build-size review
- final scorecard

Do not declare the 9.3 target achieved based on a single attractive Home
screen. Every major workflow must meet the bar.

---

# Measurable definition of 9.3

Forge reaches the target when:

- all screens use the formal token and component system
- no primary workflow feels visually unrelated to another
- Home tells a useful weekly story in one viewport plus one short scroll
- charts share controls, colors, typography, interaction, and accessibility
- training, nutrition, and body data can be compared without misleading axes
- common workout and food actions require less vertical travel
- advanced set types and supersets look native to the design
- empty states explain the next useful action
- all primary actions have clear pressed, disabled, processing, success, and
  error behavior
- seeded screenshots are polished at 320px, 390px, and 430px
- the installed PWA survives update and retains its visual state
- the final visual scorecard averages at least 9.3 with no major dimension
  below 8.6

## Recommended first premium milestone

After the six functional improvements are complete, begin with:

> **Premium Phase 0 + Phase 1: design specification, tokens, reusable
> primitives, and navigation.**

That foundation prevents the Home, chart, workout, body, and food redesigns
from becoming another collection of one-off styles.
