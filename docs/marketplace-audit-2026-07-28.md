# The Forge Marketplace Audit

**Date:** July 28, 2026  
**Scope:** Product and feature audit against a representative set of widely used workout, nutrition, body-composition, health, and coaching apps.

## Executive conclusion

The Forge is already a strong personal fitness product. It is not merely a prototype and it is not meaningfully behind because it lacks a large commercial feature catalog.

For its intended audience—Colton, his wife, and a small group of friends and family—it scores approximately **84/100**. Against a broad consumer subscription-app standard, it scores approximately **73/100**. The difference is driven mainly by account-based continuity, cross-device sync, integrations, onboarding depth, and content scale—not by the quality of its core workout, body, or food logging.

Its strongest market position is:

> A private, free, low-friction fitness command center that combines serious strength tracking, editable programs, nutrition capture, and unusually deep Evolt body-scan tracking without ads, subscriptions, or account friction.

That combination is uncommon. Most strength apps are weak at body composition and nutrition. Most nutrition apps are weak at program execution. Health hubs aggregate data but do not provide a focused lifting workflow. The Forge has a coherent reason to exist.

The next milestone should **not** be another large feature expansion. It should be a **Trust and First-Run milestone**:

1. Make data loss much harder.
2. Make initial setup explain and personalize defaults.
3. Confirm backup/restore and update behavior with automated regression coverage.

After that, the best smaller additions are time-aware food suggestions, first-class advanced set structures, and portable CSV exports.

## Method and confidence

This audit used:

- A direct mobile-width walkthrough of the production app with existing data.
- An isolated fresh-install walkthrough with a new profile.
- Source inspection of the current implementation.
- Current official product pages and help documentation for representative category leaders.
- A feature rubric weighted for The Forge's intended household/friends-and-family use.

This is a product-capability audit, not a months-long retention study. Paid-only workflows and proprietary coaching quality were assessed from official documentation rather than extended subscriptions. Claims about The Forge were verified in the live UI or current source.

The comparison set is deliberately representative, not a literal App Store ranking:

- **Strength and workout logging:** Hevy, Strong, Fitbod, JEFIT, Boostcamp, Caliber, Alpha Progression, StrengthLog, Ladder, Peloton Strength+
- **Nutrition:** MyFitnessPal, Cronometer, MacroFactor, Lifesum, Lose It, Yazio, FoodNoms, RP Diet Coach
- **Body and health:** Apple Health, Evolt Active, Withings, Fitbit, Garmin Connect, Renpho Health
- **General training and coaching:** Nike Training Club, Freeletics, Peloton App, Apple Fitness+, Future

## Scorecard

| Dimension | Weight | Forge score | Assessment |
|---|---:|---:|---|
| Workout execution | 18% | 9.0/10 | Excellent set logging, rest timer, prescribed targets, history, guided/list modes, bodyweight modes, and completion flow |
| Program design and editing | 10% | 8.0/10 | Editable multi-week plans and exercise creation are strong; advanced set structures are not first-class |
| Progress intelligence | 10% | 8.5/10 | Last/best references, estimated-1RM-based load suggestions, PR callouts, volume, muscle heatmaps, and progress state |
| Nutrition capture | 14% | 8.0/10 | Manual, saved, recent, recipes, barcode lookup/photo decoding, label OCR, serving math, and copy-yesterday |
| Body composition | 12% | 9.5/10 | Evolt PDF import, scan history, segmental composition, trends, measurements, weight goals, and visual comparisons |
| Daily mobile UX | 10% | 8.0/10 | Clear, polished, focused, and free of commercial clutter; a few workflows remain denser than category specialists |
| Onboarding | 8% | 5.0/10 | No dead-end was reproduced, but setup asks only for a name and silently assigns targets, sex, and units |
| Data continuity and resilience | 10% | 4.0/10 | JSON export/restore is good, but persistence remains browser-local and backups depend on user discipline |
| Ecosystem integrations | 4% | 2.0/10 | No watch, Apple Health, wearable, or cross-app sync; acceptable now, limiting at mass-market scale |
| Privacy and cost fit | 4% | 10/10 | No account, no ads, no subscription, local-first records, and external food lookup only when requested |

### Overall result

- **Intended personal/family scope:** 84/100
- **Broad commercial fitness market:** 73/100

The commercial score should not become the product strategy. Closing every gap would add cost, fragility, support burden, and clutter. The intended-scope score is the more useful guide.

## Focused visual-design assessment

Forge is genuinely visually competitive. Its current interface merits an
overall visual-design score of approximately **8.1/10**.

| Visual dimension | Score | Assessment |
|---|---:|---|
| Brand identity | 9.0 | The charcoal, warm amber, off-white, and restrained blue/pink palette feels intentional and recognizable |
| Hierarchy | 8.3 | Major actions, totals, active states, and workout prescriptions are easy to identify |
| Component consistency | 8.5 | Cards, pills, segmented controls, buttons, inputs, and navigation follow a coherent system |
| Typography and numbers | 7.8 | System typography is clean and numeric data benefits from monospace, though some secondary data is small and dense |
| Mobile scannability | 7.6 | Strong overall, but repeated card containers and badges create more vertical weight than necessary |
| Motion and tactile polish | 7.2 | Transitions, pressed states, tab entrance, and the workout-completion animation help; native leaders provide richer haptics and platform motion |
| Native-platform feel | 6.8 | It looks like a polished installed web app, but not quite like a fully native iOS/Android product |
| Distinctiveness | 8.7 | The body visualization and “forged” visual language are more memorable than many generic fitness dashboards |

### Visual competitive position

- **Against Strong:** Forge is at least as distinctive and feels more branded.
  Strong remains more mature in dense workout-table ergonomics and native
  platform behavior.
- **Against Hevy:** Forge is roughly one polish tier behind Hevy's current
  native navigation, haptics, motion, media, and 2026 platform-specific design
  work. The gap is not basic attractiveness; it is native refinement and years
  of interaction polish.
- **Against MacroFactor and FoodNoms:** Forge's overall shell is competitive,
  but its food diary is less information-efficient and context-aware. The
  leading nutrition apps fit more action and meaning into each vertical screen.
- **Against MyFitnessPal and Cronometer:** Forge is cleaner, calmer, more
  cohesive, and far less commercially cluttered. Those products expose more
  data, but do not necessarily look better.
- **Against device dashboards such as Garmin Connect:** Forge is more focused
  and easier to visually parse, while device platforms have deeper chart and
  metric systems.

### Strongest screens

1. **Training list:** clear prescription hierarchy, excellent amber active
   state, restrained history color, and highly legible exercise cards.
2. **Body:** the anatomical visualization gives Forge a visual signature that
   ordinary workout logs do not have.
3. **Home:** strong dashboard rhythm and a clear next-plan call to action.

### Visual weaknesses

- Repeated full card containers create excess vertical density.
- The Strength pill on every strength exercise is often redundant and consumes
  space that grouped-set or completion information could use.
- Some secondary labels and chart annotations are small or low-emphasis.
- Empty body and nutrition states can occupy a large amount of space without
  enough guidance.
- Data-entry modals are functional but more utilitarian than the primary
  dashboard screens.
- Charts are readable, but they lack some of the interaction, labeling, and
  comparative polish of mature health products.

### Design recommendation

Do not redesign Forge. Preserve its current identity and apply a measured
polish pass during the six reinforcement milestones:

- formalize type, spacing, radius, border, and elevation tokens
- reduce redundant card chrome and exercise badges
- improve empty-state guidance
- keep touch targets at least comfortably tappable on narrow phones
- give new setup, restore, copy, and advanced-set flows the same visual quality
  as the Home and Train screens
- add motion only where it clarifies state or rewards completion

The product already passes the “would this look credible beside a paid fitness
app?” test. The remaining visual gap is refinement, not legitimacy.

## What the fresh-install audit actually found

The reported post-profile “dead-end” or loop could not be reproduced. Creating a new profile correctly opened the dashboard, and selecting a preloaded plan correctly opened Week 1, Day 1.

The real first-run issue is subtler:

- A profile asks only for a name.
- The dashboard immediately presents nutrition targets of 2,400 calories, 180g protein, 250g carbs, and 80g fat without explaining where they came from.
- The body visualization defaults to male.
- Weight and measurement units are assumed rather than selected.
- The user is not guided to choose a plan, set a goal, import prior data, or understand backup responsibility.

This creates the appearance of a configured product before it has actually learned anything about the user. It is a trust and comprehension issue, not a navigation defect.

## Where Forge is already as good as or better than common alternatives

### Workout execution

Forge is already in the same practical tier as dedicated logging apps for the act of completing a prescribed lifting session:

- Sets, reps, load, RPE/percentage targets, notes, and rest periods
- Accurate deadline-based rest timing when the app backgrounds
- Last-session references while logging
- Best-set display and PR recognition
- History-informed suggested loads using estimated 1RM
- External weight, bodyweight-only, bodyweight-plus-added, and assisted modes
- Cardio entries alongside strength work
- Guided and list views
- Completed exercise/day/week progress and a workout-completion celebration
- Editable preloaded and custom multi-week plans

[Hevy](https://www.hevyapp.com/features/) and [Strong](https://www.strong.app/) add larger exercise libraries, social/watch integrations, and broader chart catalogs. [Fitbod](https://fitbod.me/) and [Alpha Progression](https://alphaprogression.com/en/) go further in algorithmically generating whole workouts. [Boostcamp](https://www.boostcamp.app/workout-tracker) and [JEFIT](https://www.jefit.com/use-case/workout-planner) provide very large program/exercise ecosystems. None of those differences invalidate Forge's core logger.

### Body composition

This is Forge's clearest differentiator.

It turns downloaded Evolt PDFs into structured history, graphs the changes, retains the source scan, visualizes segmental lean/fat mass, and combines scan data with manual weight, measurements, and training-volume heatmaps.

[Evolt Active](https://knowledge.evolt360.com/knowledge/how-to-download-the-evolt-active-app) provides native scan history and charts, but Forge brings those scans into the same place as the user's program and nutrition. Generic workout apps normally stop at weight, circumference, or progress photos. [Renpho Health](https://renpho.com/pages/renpho-health-introduction) and connected-scale apps provide automatic device sync and broad composition trends, but not Forge's integrated training context.

### Nutrition capture

The nutrition tab is no longer the clear weak link it was before the recent work. It now supports:

- Manual foods
- Saved and recent foods
- Recipes with serving math
- Barcode number lookup
- Barcode extraction from a photo
- On-device nutrition-label OCR with review before saving
- Portion/serving adjustment
- Daily macro history and adherence summaries
- Copying yesterday when starting an empty day

This is a credible, useful system. It avoids owning an unreliable food database and keeps label scanning functional without a paid OCR service.

[MyFitnessPal](https://support.myfitnesspal.com/hc/en-us/articles/360032624771-How-do-I-use-the-barcode-scanner-to-log-foods), [Cronometer](https://cronometer.com/features/track-food.html), [MacroFactor](https://help.macrofactorapp.com/en/articles/215-how-to-log-food-in-macrofactor), [Yazio](https://www.yazio.com/en/calorie-counter), and [FoodNoms](https://foodnoms.com/) still lead in database breadth, micronutrients, smart suggestions, integrations, or adaptive coaching. Forge is nevertheless competitive on the essential “get this packaged food into today's meal quickly” workflow.

### Product discipline

Forge has advantages that commercial products often trade away:

- No paywalls inside the core workflow
- No ads or upgrade prompts
- No forced account
- No social feed
- No generic content carousel
- No dependency on a paid AI or OCR API
- Clear review steps before imported nutrition or scan data becomes history

Those are features, not omissions, for the intended audience.

## Competitive capability matrix

| Product archetype | Representative leaders | What leaders do especially well | Forge position |
|---|---|---|---|
| Pure lifting log | Hevy, Strong, StrengthLog | Fast logging, large exercise catalogs, charts, watch support, sharing | Core logging is competitive; behind in catalog, watch, and social depth |
| Adaptive strength coach | Fitbod, Alpha Progression, Freeletics | Generate and adapt full workouts around recovery, equipment, and feedback | Forge suggests loads but does not autonomously redesign programming |
| Program marketplace | Boostcamp, JEFIT | Thousands of programs/exercises, creator ecosystems, demos | Forge has sufficient personal plan tools but intentionally lacks marketplace scale |
| Coach-led subscription | Ladder, Future, Peloton | Human/video coaching, accountability, classes, community | Outside Forge's cost-free self-serve mission |
| Macro logger | MyFitnessPal, Cronometer, Lose It | Huge searchable databases, barcode coverage, micronutrients, integrations | Forge has strong capture methods but not database or nutrient breadth |
| Adaptive nutrition coach | MacroFactor, RP Diet Coach | Dynamic expenditure and calorie/macronutrient adjustments | Forge tracks adherence but does not prescribe weekly target changes |
| Friction-first food diary | FoodNoms, Yazio, Lifesum | Time-aware suggestions, polished repeat logging, broader goals and insights | Forge is close on capture; smart recurrence and personalization are the main UX gap |
| Health data hub | Apple Health, Garmin Connect, Fitbit | Device aggregation, sensor data, long-term trends, sharing | Not a health-data platform; integrations are the major structural gap |
| Body composition companion | Evolt Active, Withings, Renpho | Automatic hardware/account sync and composition trends | Forge is unusually strong after import and better integrates training/nutrition context |
| Free workout content | Nike Training Club, Peloton App | Large professional video libraries and guided sessions | Deliberately not a content library |

[Nike Training Club](https://www.nike.com/gb/ntc-app) illustrates the scale of a free professional workout library. [Garmin Connect](https://connect.garmin.com/) illustrates the depth possible when an app is attached to a device ecosystem. [Apple Health](https://support.apple.com/en-la/104997) illustrates the value of system-level aggregation. These are useful reference points, but poor near-term build targets for a static, free PWA.

## Validated gaps and recommended roadmap

### Milestone 1 — Trust and first run

**Priority: now**

#### 1. Guided first-run setup

Add a short, skippable setup flow after profile creation:

1. Preferred units
2. Sex/body-model preference, with a neutral “choose later” option
3. Primary goal: maintain, lose, gain, or track only
4. Nutrition targets: enter my own, calculate a starting point, or skip
5. Choose/import a workout plan or continue without one
6. Explain that records are stored on this device and offer a first backup reminder

Do not pretend calculated nutrition targets are medical prescriptions. Label them as editable starting points and explain the assumptions.

#### 2. Backup confidence

Keep JSON export/restore as the canonical complete backup, but add:

- A visible “Last backup” date
- A non-blocking reminder after meaningful use if no recent backup exists
- A restore preview showing profiles and record counts before replacement
- A post-restore verification summary
- Automated round-trip tests covering plans, workout history, food, measurements, Evolt scans, and stored PDFs

This is the highest-value improvement because local browser storage is Forge's largest real product risk.

#### 3. Update-safety regression gate

Before each release, automatically test:

- Existing storage loads after the new build
- Historical plan progress remains visible
- The next incomplete workout opens
- Active/completed workout state survives reload
- Backup created by the previous release restores in the new release
- Service-worker updates do not delete local records

### Milestone 2 — Small daily-speed improvements

**Priority: after trust milestone**

#### 1. Time-aware food suggestions

Forge already has Recent, Saved, recipes, serving preferences, and Copy yesterday. The remaining high-value improvement is to rank recent foods by meal and time of day—for example, breakfast foods first in the morning—without adding a new API.

This can be entirely local and deterministic. [FoodNoms](https://foodnoms.com/help/about-foodnoms/) and [Yazio](https://www.yazio.com/en/calorie-counter) validate the value of time-aware suggestions.

#### 2. Copy a meal

Add “Copy from yesterday” or “Copy from another date” at the meal-section level. Whole-day copy already exists; meal-level copy handles common cases where breakfast repeats but dinner does not.

#### 3. Human-readable export

Keep JSON for full-fidelity restore and add CSV exports for:

- Workout sets
- Body measurements and weight
- Evolt scan metrics
- Daily calories/macros

CSV is for portability and analysis, not app restoration.

### Milestone 3 — Training structure

**Priority: useful, not urgent**

Forge can store notes such as “dropset,” but these constructs are not first-class:

- Warm-up versus working sets
- Supersets/circuits
- Drop sets
- AMRAP sets
- Timed strength/isometric sets

Implement only the structures actual users need. Start with set labels and simple exercise grouping rather than building a full programming language.

A plate calculator is a small optional convenience for barbell movements, but it ranks below the items above.

### Milestone 4 — Conditional productization

**Priority: only if the audience expands**

If Forge becomes a real distributed product, revisit:

- Optional encrypted cloud backup and cross-device sync
- Authentication/account recovery
- Native app packaging
- Apple Health/HealthKit and watch integrations
- Privacy policy, support process, telemetry, and migration operations

These are architectural commitments, not casual feature additions. A web app cannot directly provide full native HealthKit behavior without native packaging or an appropriate bridge.

## Do not build now

The audit does **not** recommend:

- A social feed, followers, challenges, or community marketplace
- A large exercise-video or instructor-class catalog
- A generalized AI coach or chatbot
- A proprietary food database
- A paid OCR, vision, or nutrition API while local/free fallbacks work
- Wearable integrations before deciding to build and maintain native apps
- Medical interpretations of body-composition data
- Dozens of new micronutrients unless users actually need them
- Subscription mechanics, ads, or gamification clutter

These would move Forge away from its strongest identity while creating recurring cost and maintenance exposure.

## Decision summary

### Build next

1. First-run setup and explicit defaults
2. Backup reminders, restore preview, and round-trip regression tests
3. Release/update data-safety checks
4. Time-aware local food suggestions
5. Meal-level copy
6. CSV export
7. First-class advanced set labels/grouping

### Preserve

- Local-first operation
- No account requirement
- No ads/subscription
- Editable plans
- History-based load guidance
- Bodyweight-aware logging
- Evolt PDF import and body trends
- Local label OCR and on-request barcode lookup
- Review-before-save import flows
- Focused four-tab navigation

### Reconsider only if Forge becomes a commercial product

- Cloud sync
- Native distribution
- Apple Health/watch integrations
- Large content or program libraries
- Human or AI coaching services

## Final product judgment

Forge does not need to imitate the top apps feature for feature. It already combines the most relevant parts of several categories in a way that serves its actual users unusually well.

The strongest next move is to make the product feel trustworthy from the first minute and resilient over years of use. Once users can understand their defaults and confidently preserve their history, Forge will have fewer consequential weaknesses than many commercial apps for this specific audience.
