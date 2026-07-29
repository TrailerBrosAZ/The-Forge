# The Forge Reinforcement Implementation Plan

**Prepared:** July 29, 2026  
**Scope:** The six approved improvements from the marketplace audit:

1. Guided first-run setup
2. Backup confidence and restore safety
3. Release/update regression protection
4. Time-aware food suggestions and meal copying
5. Human-readable CSV exports
6. Advanced workout structures, including supersets

## Outcome

This work should make Forge safer, easier to understand, faster in daily use, and more capable for real workout programming without changing its local-first, free, accountless identity.

The six improvements will not ship as one large release. They will be delivered through gated milestones so that data-safety infrastructure lands before higher-risk workout schema changes.

## Execution order

The safest implementation order is not exactly the numbered presentation order:

| Release | Scope | Reason |
|---|---|---|
| Foundation | Test fixtures, schema utilities, backup inspection | Establish safety tools before changing behavior |
| Release A | Improvements 2 and 3: backup confidence and regression gates | Protect current users and future releases first |
| Release B | Improvement 1: guided setup | Improve new-user understanding without affecting existing profiles |
| Release C | Improvement 4: food suggestions and meal copying | Low-risk, high-frequency usability improvement |
| Release D | Improvement 5: CSV exports | Add portability without changing canonical data |
| Release E1 | Improvement 6A: set types | Introduce additive workout metadata |
| Release E2 | Improvement 6B: supersets/circuits | Add grouped workout execution after set types are stable |
| Release E3 | Improvement 6C: timed/isometric sets if still needed | Isolate the most structurally different logging format |

Each release must pass its own unit, migration, browser-flow, mobile-layout, and regression gate before the next begins.

## Non-negotiable safety rules

1. **No destructive migrations.** Missing new fields receive defaults at read time.
2. **Stable plan identities remain unchanged.** Existing plan, week, day, exercise, and workout-log keys are preserved.
3. **JSON remains the canonical full backup.** CSV is an additional analysis format and cannot replace JSON restore.
4. **Existing profiles are not forced through onboarding.** They receive an optional “Finish setup” prompt and keep current targets.
5. **Advanced workout metadata is additive.** A plan without group or set-type fields behaves exactly as it does now.
6. **Every risky operation gets a preview or recovery path.**
7. **No API, subscription, account, or backend is added by this plan.**
8. **Production is deployed only from a tested, committed release state.**

---

# Foundation: safety and test infrastructure

This work begins before the visible improvements.

## A. Extract pure data modules

Move logic that can be tested without React into focused modules:

- `src/lib/backup.js`
  - create backup manifest
  - inspect and validate backup
  - summarize profiles and record counts
  - prepare restore operations
- `src/lib/profileSetup.js`
  - normalize profile preferences
  - determine whether setup is complete
  - validate setup answers
- `src/lib/foodHistory.js`
  - rank food suggestions
  - clone meal/day entries with fresh IDs
- `src/lib/csvExport.js`
  - CSV escaping
  - dataset-to-row conversion
  - file creation
- Extend `src/lib/workoutLogic.js`
  - normalize set types
  - normalize workout groups
  - advanced-set completion and scoring rules

React components should call these functions rather than duplicate business rules.

## B. Create representative test fixtures

Add versioned fixtures covering:

- Empty fresh install
- Existing profile created before onboarding fields existed
- Current multi-week plan with completed and partial workout history
- Repeating plan
- External, bodyweight, added-weight, and assisted exercises
- Cardio sessions
- Food diary with recipes, barcode foods, scanned-label foods, and servings
- Measurements, weights, Evolt metrics, and stored PDF metadata
- Version 1 and version 2 backups
- Future version 3 backup

The primary “populated profile” fixture should deliberately resemble a user in Week 2 with prior history. That directly guards against the progress-loss appearance previously reported.

## C. Split test layers

Use three layers:

1. **Pure Node tests**
   - Fast data-model, migration, ranking, CSV, and calculation tests
   - Extend the current `scripts/core-tests.mjs` approach or split it into focused scripts
2. **Browser end-to-end tests**
   - Seed localStorage and IndexedDB
   - Load the built PWA
   - Exercise setup, restore, food copying, CSV initiation, and workouts
3. **Manual real-device smoke test**
   - Installed iPhone home-screen PWA
   - Standard Safari tab
   - Background timer
   - App update over existing data
   - File import/export through iOS share/download flows

Automated WebKit testing is useful, but it does not replace the final installed-iPhone smoke test.

---

# Improvement 2: backup confidence and restore safety

This lands first because local browser storage remains the largest product risk.

## Data model

Introduce backup format version 3:

```js
{
  app: "the-forge",
  version: 3,
  appRelease: "YYYY.MM.DD.N",
  exportedAt: "ISO timestamp",
  manifest: {
    profiles: 2,
    workoutSessions: 123,
    foodEntries: 456,
    weights: 20,
    measurements: 30,
    bodyScans: 4,
    scanDocuments: 4
  },
  data: { /* existing namespaced localStorage records */ },
  scanDocuments: [ /* existing IndexedDB documents */ ]
}
```

Version 1 and 2 restores remain supported.

Store lightweight backup metadata separately:

```js
{
  lastExportStartedAt: "ISO timestamp",
  lastSuccessfulRestoreAt: "ISO timestamp",
  meaningfulChangesSinceExport: 17
}
```

The UI should say “Last export started” rather than claiming the browser successfully saved the file; a web app cannot reliably verify that the user retained the download.

## Export flow

1. User opens Data Settings.
2. UI shows:
   - where records live
   - last export date
   - approximate record counts
   - whether a backup reminder is due
3. User taps Export.
4. Forge collects localStorage plus IndexedDB scan documents.
5. Forge validates its generated object before download.
6. Download begins.
7. Forge records `lastExportStartedAt` and resets the meaningful-change counter.
8. A success panel explains how to store the file safely.

## Reminder behavior

Use a non-blocking reminder when either condition is met:

- No export has ever been initiated and the profile has accumulated meaningful history; or
- More than 14 days or a defined number of meaningful mutations have occurred since the last export.

Meaningful mutations include:

- completed workout session
- food logging day
- weight/measurement entry
- imported scan
- edited active plan

Do not show a reminder on every launch. Dismissal should suppress it for several days.

## Restore preview and transaction flow

Current restore immediately removes Forge localStorage keys. Replace that with:

1. Read file.
2. Parse JSON.
3. Validate app identifier, supported version, key namespace, JSON values, and scan documents.
4. Build a preview:
   - export date and app release
   - profile names
   - workout, food, body, and PDF counts
   - warnings for older/newer formats
5. User confirms “Replace current Forge data.”
6. Capture the current Forge state as an in-memory rollback package.
7. Write restored localStorage.
8. Restore scan documents inside a single IndexedDB transaction.
9. Re-read and verify record counts.
10. If any stage fails, restore the captured state and report that no change was kept.
11. Reload only after verification succeeds.

The confirmation screen must clearly say that restore replaces current records. It must not use a vague “Import” label.

## Optional browser durability

From Data Settings, offer a user-initiated “Protect local storage” action using `navigator.storage.persist()` when supported. Treat browser support and success as advisory, never as a substitute for backups.

## Acceptance criteria

- V1, V2, and V3 valid backups restore correctly.
- Invalid or malformed backups make no changes.
- A failed IndexedDB write rolls localStorage back.
- Stored Evolt PDFs round-trip byte-for-byte.
- Restore preview counts match post-restore counts.
- Existing unrelated localStorage keys are untouched.
- Export/restore works from mobile Safari and the installed PWA.

---

# Improvement 3: release and update regression protection

## CI deployment gate

Update the GitHub Pages workflow so deployment requires:

1. `npm ci`
2. Pure data/unit tests
3. Production build
4. Browser smoke tests against the production build
5. Only then upload and deploy the Pages artifact

A failed test prevents deployment.

## Required automated scenarios

### Persistence and migration

- Load a legacy profile with missing new fields.
- Load a current populated profile.
- Load workout logs using both legacy and stable v2 keys.
- Confirm normalization does not alter stable identities.
- Confirm a current backup restores into the new release.

### Workout continuity

- Historical completed workouts remain green/completed.
- The plan header shows the correct logged count.
- The next incomplete workout opens.
- A partial workout resumes at the incomplete exercise/set.
- Editing a plan does not orphan prior logs.
- Bodyweight modes retain correct labels and scoring.
- Rest timer remains deadline-accurate after simulated background time.

### Nutrition

- Existing diary totals remain unchanged.
- Recipes and serving preferences survive update/restore.
- Barcode and label-imported foods still render and can be reused.

### Body

- Existing scans and PDF references load.
- Weight entries created from Evolt scans do not duplicate.
- Female/male front/back visual state remains centered and selectable.

### Service worker

- New shell/assets activate without deleting Forge records.
- An installed old release can update to the new release and reload.
- Offline shell still opens after one successful online load.

## Release checklist

For each milestone:

1. Export a production-like fixture before changes.
2. Run unit tests.
3. Run production build.
4. Run automated browser suite at mobile dimensions.
5. Perform read-only production sanity check.
6. Test the changed flow on isolated local data.
7. Test update over populated isolated data.
8. Test backup/restore round trip.
9. Review `git diff` for unrelated changes.
10. Commit and push only after all gates pass.
11. Verify GitHub Pages deployment and production asset version.
12. Perform an installed-iPhone smoke test for releases touching storage, service workers, files, timers, or camera/photo inputs.

## Rollback strategy

- Keep every release as a discrete commit.
- Never deploy a migration that makes the prior release unable to read existing core records.
- If production fails, revert the release commit and redeploy.
- If a new additive field exists, the prior build should ignore it without deleting it where possible.
- For the advanced workout release, require a fresh JSON backup before first use of the new editor.

---

# Improvement 1: guided first-run setup

## Profile data additions

Add optional fields:

```js
{
  setupVersion: 1,
  setupCompletedAt: "ISO timestamp",
  units: {
    weight: "lb",
    measurement: "in"
  },
  bodyModel: "male" | "female" | "unspecified",
  primaryGoal: "maintain" | "lose" | "gain" | "track",
  targetsSource: "manual" | "estimated" | "skipped"
}
```

Existing `targets`, `startWeight`, `goalWeight`, and `activePlanId` stay where they are for compatibility.

## Existing-user behavior

- Do not interrupt existing users with a mandatory wizard.
- Infer current display defaults only for presentation.
- Show a dismissible “Finish profile setup” card in Settings or Home.
- Preserve all existing target values and active-plan state.
- Completing setup must not overwrite targets unless the user explicitly chooses new ones.

## New-profile flow

### Step 1 — Identity and units

- Name
- Pounds/inches or kilograms/centimeters

### Step 2 — Body display

- Male
- Female
- Choose later

This controls visual defaults only and is not presented as a medical classification.

### Step 3 — Goal

- Maintain
- Lose
- Gain
- Track without a prescribed goal

### Step 4 — Nutrition

Offer:

- Enter my own targets
- Calculate an editable starting estimate
- Skip nutrition setup

If the estimate option is implemented, it must:

- show the inputs and assumptions
- identify the result as a starting estimate
- require user confirmation
- remain editable
- avoid medical or guaranteed-outcome language

The precise equation and goal adjustment must be documented and separately validated before implementation.

### Step 5 — Training

- Choose a preloaded plan
- Create/import a plan
- Continue without a plan

Plan selection should use the current safe “customize a copy” behavior for built-in multi-week plans.

### Step 6 — Data responsibility

Explain:

- records live on this device/browser
- home-screen removal or browser-data clearing can remove them
- JSON backup is the recovery mechanism

Offer:

- Open app
- Open Data Settings after setup

## Wizard behavior

- Back/next navigation preserves entered values.
- Skip is always available.
- No profile data is committed until final confirmation, except the initially reserved profile ID.
- Closing midway resumes setup rather than creating duplicate profiles.
- Accessibility labels, keyboard behavior, and 320–430px layouts are tested.

## Acceptance criteria

- A new user understands targets, units, body visualization, plan state, and storage responsibility.
- A user can complete setup without nutrition or training.
- Existing users retain every previous value.
- Setup can be edited later in profile settings.
- No default target is presented as personalized unless it was actually calculated or entered.

---

# Improvement 4: time-aware food suggestions and meal copying

This improvement remains fully local and does not add a food API.

## Suggestion engine

Create a pure deterministic ranking function:

```js
rankFoodSuggestions({
  dayLog,
  targetMeal,
  now,
  servingPreferences,
  limit
})
```

Each unique food receives a score based on:

- logged in the same meal section
- logged in a similar time/day context where timestamps exist
- frequency in recent history
- recency with gradual decay
- repeated serving preference
- exclusion or down-ranking if it is already logged in the target meal today

Because older entries do not have timestamps, meal section is the primary historical signal. New entries can add `loggedAt` without rewriting old entries.

## UI

When opening Add Food:

- Default to **Suggested** when useful suggestions exist.
- Show 4–8 ranked choices.
- Add small explanations such as:
  - “Often at breakfast”
  - “Logged 3 times this week”
  - “Last used yesterday”
- Keep Recent, Saved, Manual, Barcode, Scan label, and Recipe unchanged.
- Search continues to filter Recent and Saved.

The ranking should feel helpful but predictable. No claim of AI is needed.

## Meal-level copy

Add a copy action to each meal header:

- Copy latest breakfast/lunch/dinner/snacks
- Choose another recent date

Rules:

- Default source is the most recent non-empty instance of that same meal.
- Copied entries receive new IDs.
- Nutrition values and serving metadata remain unchanged.
- If the destination is empty, copy immediately after confirmation.
- If the destination already contains food, default to **Add copied items**, not replace.
- A separate explicit replace option may be offered with clear confirmation.
- Whole-day Copy Yesterday remains available.

## Acceptance criteria

- Suggestions are stable for the same history and time.
- Foods from the chosen meal rank above unrelated meal history.
- Copying cannot duplicate entry IDs.
- Copying a meal never alters its source date.
- Existing daily totals remain unchanged until the user confirms.
- Empty histories still show the current clean fresh state.

---

# Improvement 5: human-readable CSV exports

## Product behavior

Add an “Export spreadsheets” section under Data Settings. Keep it visually separate from “Full backup.”

Explain:

- JSON = full recovery
- CSV = human-readable analysis
- CSV cannot restore Forge

Use one user-initiated download per dataset to avoid mobile Safari blocking several automatic downloads.

## CSV datasets

### Workout history

Columns:

- profile
- date
- plan
- week
- block
- day
- focus
- exercise
- exercise_type
- load_mode
- set_number
- set_type
- weight
- reps
- duration_minutes
- target_reps
- target_rpe
- rest
- note
- completed_at

### Nutrition diary

Columns:

- profile
- date
- meal
- food
- servings
- serving_size
- calories
- protein_g
- carbs_g
- fat_g
- source
- barcode
- logged_at

### Weight and measurements

Columns:

- profile
- date
- record_type
- body_part
- measurement_kind
- value
- unit
- source

### Evolt scan metrics

Columns:

- profile
- scan_date
- scan_id
- source_filename
- metric_code
- metric_label
- region
- value
- unit
- original_value
- original_unit
- status
- confidence
- corrected_by_user

The original PDFs remain available only through the JSON backup/document store.

## CSV rules

- UTF-8 with BOM for Excel compatibility
- RFC 4180-style quoting
- ISO dates
- Stable column order
- One row per set, food entry, measurement, or scan metric
- Explicit units
- Formula-injection protection for text beginning with `=`, `+`, `-`, or `@`
- Empty values remain empty, not zero

## Acceptance criteria

- Commas, quotes, line breaks, and non-ASCII food/exercise names export correctly.
- Spreadsheet applications open files into the expected columns.
- Totals derived from nutrition rows match Forge totals.
- Workout row counts match logged sets.
- All profile data stays separated by a profile column.
- CSV export never mutates app state.

---

# Improvement 6: advanced workout structures and supersets

This is the highest-risk improvement and ships last.

## Schema strategy

Increment the workout schema only after all readers support the additive fields.

### Exercise grouping

Add optional fields to exercises:

```js
{
  groupId: "stable-group-id",       // absent for normal exercises
  groupType: "superset" | "circuit",
  groupPosition: 1                  // display hint; array order remains authoritative
}
```

Rules:

- Only adjacent exercises may form a group in the first version.
- Two exercises form a superset.
- Three or more form a circuit.
- Grouping does not replace exercise IDs.
- Each exercise keeps its current workout-log key and history.
- Ungrouping removes group metadata only.

### Set types

Add optional fields to logged and prescribed sets:

```js
{
  setId: "stable-set-id",
  kind: "working" | "warmup" | "drop" | "amrap",
  clusterId: "optional-shared-cluster-id",
  segmentIndex: 0,
  done: true
}
```

Missing `kind` means `working`.

Missing `clusterId` means the row is an ordinary independent set. Multiple
consecutive rows with the same `clusterId` are segments of one set cluster,
such as a working segment immediately followed by a drop segment. The cluster
counts once toward the prescribed working-set count even though every segment
can contribute appropriate analytics.

Timed/isometric sets should be a later sub-release:

```js
{
  kind: "timed",
  durationSeconds: 45
}
```

They should not be forced into a fake reps field.

## Concrete drop-set reference: Jeff Nippard Supinated EZ Bar Curl

The built-in Jeff Nippard program already contains the reference exercise:

- Exercise: Supinated EZ Bar Curl
- Prescription: 3 sets
- Reps: 15/15
- Instruction: perform 15 reps, reduce the weight by approximately 50%, then
  immediately perform another 15 reps
- Rest: after the reduced-weight segment, not between the two segments

This should become a permanent migration and UI test fixture.

Each of the three prescribed sets is represented as one cluster with two flat
segments:

```js
[
  {
    setId: "curl-1a",
    clusterId: "curl-cluster-1",
    segmentIndex: 0,
    kind: "working",
    targetReps: "15",
    weight: "40",
    reps: "15",
    done: true
  },
  {
    setId: "curl-1b",
    clusterId: "curl-cluster-1",
    segmentIndex: 1,
    kind: "drop",
    targetReps: "15",
    prescribedLoadRatio: 0.5,
    weight: "20",
    reps: "15",
    done: true
  }
]
```

The next two working-set clusters use the same structure with new IDs.

### Drop-set logging behavior

1. Forge presents “Set 1A · Working · 15 reps.”
2. After 1A is completed, focus advances immediately to “Set 1B · Drop · 15 reps.”
3. The drop weight is suggested as approximately 50% of the actual 1A weight,
   rounded to the exercise's normal increment.
4. The user can override the suggestion.
5. No rest timer begins between 1A and 1B.
6. Completing 1B completes working-set cluster 1 and begins the prescribed
   rest timer.
7. The exercise completes after three clusters, not after three individual
   rows.

### Drop-set analytics behavior

- Both working and drop segments count toward training volume.
- Only the working segment is eligible for the normal best-set/PR comparison.
- Drop segments do not feed the next-session working-weight suggestion.
- Drop-segment performance can be shown in exercise history without being
  compared as though it were a normal working set.
- CSV contains both rows with the shared `clusterId` and their segment labels.

This flat linked-segment representation preserves the current session `sets`
array, remains exportable, and avoids introducing nested objects into every
existing workout calculation.

## Progress and analytics rules

Define these rules before building UI:

| Set type | Counts for exercise completion | Counts in training volume | Eligible for PR/best-set | Used for load suggestions |
|---|---|---|---|---|
| Working | Yes | Yes | Yes | Yes |
| Warm-up | Optional/not required | No by default | No | No |
| Drop | Yes as part of its prescribed cluster | Yes | No by default | No |
| AMRAP | Yes | Yes | Yes | Yes, with safeguards |
| Timed | Yes | Separate duration metric | No load PR unless explicitly designed | No |

Superset/circuit grouping does not change whether a day is complete; each exercise must still satisfy its own required sets.

For clustered drop sets, completion counts completed clusters rather than raw
set rows. Historical flat sets without cluster IDs continue to count one row
as one set.

## Plan editor UX

### Set types

- Each strength exercise keeps the simple Sets/Reps/RPE/Rest fields.
- An “Advanced sets” expansion allows:
  - add warm-up sets
  - mark final set AMRAP
  - add a drop segment and specify its target reps and suggested load reduction
- Simple exercises remain visually simple.

### Supersets

For the first release:

- Add “Pair with next exercise” to an exercise action menu.
- Paired rows receive A1/A2 labels and a shared visual bracket.
- Three adjacent grouped exercises become A1/A2/A3 and are labeled Circuit.
- Add “Ungroup.”
- Allow a shared “Rest after round” value.
- Preserve the existing per-exercise rest field as the fallback for ungrouped exercises.

Avoid unrestricted drag-and-drop grouping initially; it adds mobile complexity without improving the data model.

## Workout-list UX

- Group cards visually but preserve individual exercise completion indicators.
- Show A1/A2 or circuit position badges.
- Show shared round rest.
- Tapping any group member opens the group-aware logger at the next incomplete set.

## Guided-workout UX

For a two-exercise superset:

1. A1 set 1
2. A2 set 1
3. Rest after round
4. A1 set 2
5. A2 set 2
6. Continue until required sets are complete

Rules:

- If exercises have unequal set counts, completed members are skipped in later rounds.
- The user can navigate backward and edit a completed set.
- Rest timer begins after the final active exercise in the round.
- Leaving and reopening resumes the correct exercise and round.
- List mode remains available as a non-sequenced fallback.

## Historical compatibility

- Existing exercises have no group metadata and render exactly as before.
- Existing sets without `kind` normalize to working sets.
- Existing workout keys are never renamed.
- Editing a plan to add a superset preserves both exercises' IDs.
- Removing a superset preserves all exercise history.
- Old backup versions restore and normalize correctly.

## Advanced workout test matrix

Test:

- ordinary ungrouped workout
- two-exercise superset
- three-exercise circuit
- unequal set counts
- bodyweight plus external-weight superset
- cardio adjacent to a superset
- warm-up + working sets
- working + drop set
- the Jeff Nippard 3 × 15/15 curl with a 50% drop in each set cluster
- AMRAP set
- partial group resume after reload
- timer backgrounding between rounds
- plan edit, group, ungroup, and reorder
- historical progress after grouping
- PR and volume calculations by set type
- workout-completion celebration after grouped day

## Release E gates

Before deploying supersets:

1. Back up the production-like fixture.
2. Run legacy and new workout tests.
3. Load an existing multi-week plan and group exercises without changing IDs.
4. Complete a superset in list and guided modes.
5. Reload halfway through and resume.
6. Confirm historical day/week progress remains unchanged.
7. Confirm ungrouping leaves logs intact.
8. Restore a pre-superset backup.
9. Verify mobile UI at narrow iPhone dimensions.
10. Perform an installed-PWA workout smoke test.

---

# Milestone audits

At the conclusion of every release:

## Functional audit

- Verify every acceptance criterion for that release.
- Exercise both empty and populated profiles.
- Check the changed feature through a complete user journey.

## Regression audit

- Home dashboard
- Profile switching
- Active-plan selection and editing
- Next-workout routing
- List and guided workout logging
- Rest timer
- Completion celebration
- Bodyweight modes
- Evolt import and stored PDF access
- Manual body measurements and weight
- Food manual/recent/saved/barcode/label/recipe flows
- Backup and restore
- Offline reload

## Data audit

- Compare record counts before and after update.
- Compare representative workout totals and food totals.
- Confirm stable IDs and log keys.
- Export and restore the post-change backup.
- Verify no unrelated browser storage was touched.

## UI audit

- 320px, 390px, and 430px widths
- Safe-area/top/bottom navigation spacing
- Modal scrolling
- Keyboard and numeric inputs
- Long plan, exercise, food, and profile names
- Male/female front/back body views
- Empty, loading, success, warning, and error states

## Release audit

- Clean build
- Tests pass locally and in GitHub Actions
- Pages deployment completes
- Production references the new asset bundle and release number
- Existing installed PWA updates without removal/reinstallation

---

# Definition of completion

The six-improvement program is complete when:

- New profiles receive understandable, optional setup.
- Existing profiles remain unchanged unless their users opt in.
- Backups show useful status, restore through a preview, and roll back on failure.
- Deployment cannot proceed past failing core or browser regression tests.
- Food suggestions become context-aware and meals can be copied independently.
- Workout, nutrition, body, and scan history can be exported to usable CSV files.
- Warm-up/working/drop/AMRAP sets and supersets work in plan editing, list logging, guided logging, history, analytics, backup, restore, and partial-workout resume.
- The installed mobile PWA updates without deleting local user data.

## Recommended first execution milestone

Begin with the **Foundation + Backup/Regression release**. It creates the safety net required for everything that follows and provides immediate value even before any new workout or food capability ships.

After all six improvements are stable, continue with the separate
[Premium Design Roadmap](./premium-design-roadmap-2026-07-29.md). The design
program deliberately follows the functional work so its new components and
charts are built on final, tested behavior.
