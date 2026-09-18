# Zinaata — Android scan-app build process (context brief)

If you are a future Claude session reading this cold: this is a complete
record of how the Zinaata device-scanning interface got scoped, what got
built, what got tested, and exactly what's proven vs. still assumption.
Written specifically so this same process can be repeated for a different
target platform (PC/laptop) without re-deriving any of it. Captured
2026-09-18.

## Where this sits in the project

`YANTHROS CORE/` is the core formula-graph engine (`brain.py` +
`formulas.py`, ~333 physics/engineering formulas, see the parent folder's
own docs). `ZINAATA/` retargets that engine from industrial fault
diagnosis (the `faulter` project) to consumer electronics, starting with
phones. This file documents the *scanning-app side* of that work — the
piece that identifies what hardware a device has, so the right formula
subset can eventually be selected. See `README.md` and `FRAMEWORK.md` in
this same folder for the original method/scoping brief this work started
from.

## Step 1 — Component vocabulary table

File: `component_vocabulary.py`.

A controlled vocabulary of **35 phone hardware component types**, grouped
into 10 categories (Compute, Power, Display & Input, Camera, Motion & Env
Sensors, Audio & Haptics, Radios, Thermal, Chassis, Passive & Discrete),
each mapped to the physics-engine domains it pulls in from `formulas.py`
(the same mechanism as the industrial project's `COMPONENT_TYPE_TO_DOMAINS`
in `formula_selector.py`, not copied into this folder on purpose). Every
domain name used was checked against the real `FORMULA_DOMAINS` dict
before being used — nothing invented.

## Step 2 — Android API exposure audit

File: `android_api_exposure.md` (~36KB, written by a dedicated research
pass against developer.android.com, not from memory).

For each of the 35 component types: which Android SDK class/method
exposes it to a normal, non-rooted third-party app, what permission it
needs, exactly what fields come back (with units), and an exposure
verdict:

- **10 Full** — live runtime read gives everything needed.
- **15 Partial** — some fields live, others structurally unavailable.
- **3 OEM-varies** — API exists but real devices are inconsistent
  (battery `current_now`/`charge_counter`, haptic resonant frequency,
  GNSS raw measurements — null-check and fall back for these).
- **7 Not exposed, ever, on any standard app** — `voltage_regulator`
  (PMIC), `pcb_passive`, `mosfet_transistor`, `status_led`, `antenna`,
  `chassis_frame` (all six: zero API surface, direct or indirect — not a
  permission gate, a hard OS boundary), plus `fingerprint_sensor` raw
  data (blocked by design — biometric data never leaves the Trusted
  Execution Environment; only a pass/fail auth boolean is readable).

Key corrections this pass caught: no cycle count or true rated battery
capacity anywhere in the public API; GPU has no live telemetry API at
all, only a static vendor/renderer string via an active GL context;
per-component thermal (`HardwarePropertiesManager`) is privileged/system
only, not available to a normal app even though it exists; several
permissions (Wi-Fi SSID/BSSID, Bluetooth scan pre-Android-12, cellular
`getAllCellInfo()`) are gated behind `ACCESS_FINE_LOCATION` even though
they aren't location features from the user's point of view.

## Step 3 — Real-world component reference

File: `real_world_phone_components.md` (~53KB, ~416 named parts across
24 categories, web-researched across Samsung/Pixel/Xiaomi/OnePlus/
Motorola/Sony/Oppo/Vivo/Nothing/ASUS/Realme/Honor, flagship through
budget tiers, ~2015-2026). Built as the seed for a future device-model →
spec-sheet lookup table, to backfill the fields that can't be read live.
Only real, sourced part numbers — nothing invented where search turned
up nothing verifiable.

## Step 4 — Browser-based prototype (what actually got built)

Directory: `webapp/` (Flask + vanilla JS/HTML/CSS, no build step). Runs
locally at `http://localhost:5091` (launch config `zinata-webapp` in
`/Users/mac/Desktop/.claude/launch.json`, since `preview_start` resolves
`.claude/launch.json` from that root, not from inside this project
folder — worth remembering if this trips you up again).

**Why a web prototype first, not straight to native Android:** to get
the information architecture and interaction design right (what
categories, what layout, what states) before committing to Kotlin/Studio
build cycles. This was always understood to be a stand-in for the real
native app, not the deliverable itself.

**Architecture:**
- `app.py` — serves `CATALOG`, a hardcoded list of the same 35
  components from `component_vocabulary.py`, each tagged with a
  `status` (`live_candidate` / `android_only` / `spec_only`, matching the
  audit verdicts) and a `browser_key` for the ~12 fields a desktop
  browser tab can actually read live (CPU core count, GPU renderer
  string, RAM/storage estimates, display info, touch points, battery,
  accelerometer/gyroscope, mic/speaker device counts, network info).
- `templates/index.html` + `static/style.css` + `static/app.js` — the UI.
  `/api/components` serves the catalog as JSON; the page fetches it,
  attempts each `browser_key` reader, and falls back to a status label
  ("Android-only" / "Spec-sheet only") for anything it can't read from
  inside a browser tab — never fakes a value.

**UI decisions, in the order they were made (each one was a real fix,
not just polish — worth reading if repeating this for another
platform):**

1. **Theme**: black + whitish-gray only, per explicit instruction — no
   other colors anywhere, including status indicators (grayscale dots:
   filled = live, outlined = android-only, dim = spec-only, not
   red/green/yellow).
2. **Phone-frame mockup**: a fixed 390×844px bordered/shadowed frame,
   purely a desktop-preview convenience so the tester can see device
   boundaries while working on a laptop — **this frame never ships**; a
   real installed app has no bezel around itself. Early version dropped
   this frame at real mobile viewport widths (`@media max-width:460px`)
   on the theory that a real phone wouldn't need it — this was wrong for
   *this* use case: the point is desktop testing, so the frame needs to
   stay visible always, regardless of window width. Fixed by removing
   that media query.
3. **Bottom dock, not top**: category filter chips were originally a
   horizontal scrolling strip under the app bar. Moved to a fixed bottom
   navigation dock — thumbs reach the bottom of a phone, not the top.
4. **"Brick wall," not scrolling strip**: dock chips wrap (`flex-wrap`)
   into as many rows as needed so every category is visible at once, no
   horizontal scroll on the dock itself. The results list above it
   (`#cards`, inside `#results`/`main`) is the only thing that scrolls
   (`overflow-y: auto`, with `min-height: 0` on the flex parent — that
   `min-height: 0` is required for a flex child to actually shrink and
   scroll instead of overflowing its container; easy to forget).
5. **Bug: dock reshaped depending on what was selected.** Root cause:
   the active chip got `font-weight: 600` while inactive chips didn't —
   bold glyphs are wider, which shifted where `flex-wrap` broke lines,
   changing the row count depending on which chip was active. Fixed by
   locking `font-weight: 600` on all chips regardless of state, so
   glyph width — and therefore the wrap layout — never changes.
   Verified by scripting a click through all 11 chips and asserting the
   dock's rendered height was identical every time.
6. **Tight packing**: default category order left ragged gaps per row.
   Fixed by measuring actual rendered pixel width of every chip label
   in the live browser (`getBoundingClientRect().width` — don't
   estimate from character count, actual font metrics matter) and
   hand-packing a `DOCK_ORDER` array via greedy first-fit so the first
   N-1 rows fill edge-to-edge and the one label too wide to pack with
   anything ("Motion & Env Sensors" at the time, 229px of a 338px row)
   is deliberately isolated on the last row — intentional reserved
   space for future chips, not leftover waste.
7. **Settings + Admin**: two non-filtering "action" chips added into
   that reserved space. Visually distinct (`.chip-alt`, dashed outline)
   from the real category filters. Clicking either shows an honest
   in-canvas placeholder message ("not built yet, will do X once Y
   exists") rather than either faking functionality or silently
   breaking the filter (a naive implementation would try to match cards
   against a non-existent category and blank the whole screen with no
   explanation — avoid that).
8. **Label economy**: "Motion & Environmental Sensors" shortened to
   "Motion & Env Sensors", Settings became icon-only (⚙, with
   `aria-label="Settings"` kept for accessibility), chip padding/font
   shrunk slightly — specifically so Motion & Env Sensors + the
   Settings icon + Admin could all share one row instead of Admin
   wrapping alone with wasted space.
9. **Structural bug caught during the Settings/Admin change**: card
   re-render (`cards.innerHTML = ...` on every scan/rescan) was about to
   wipe out the placeholder element because it originally lived inside
   the same container being replaced. Fixed by splitting `#results`
   (the scrollable region, stays put) from `#cards` (only the card grid,
   gets replaced each scan) with `#placeholder` as a sibling of `#cards`
   — re-render the data, never the scroll container or the static UI
   chrome around it.

**Verification method used throughout**: never trust a screenshot alone
for layout-invariant claims. For "does the dock ever reshape" or "is the
filter logic actually correct," script it — click every chip
programmatically via `javascript_tool`, read back `getBoundingClientRect()`
/ `classList` / `dataset` state, and assert on the numbers. Screenshots
confirmed the visual result; the DOM assertions confirmed correctness
that a screenshot at one point in time can't prove.

## Open questions answered along the way (don't re-litigate these)

**Will packaging this as an Android app auto-fetch everything shown?**
No, not automatically, and not with this build as-is. This prototype is
a browser page; wrapped in a bare WebView it inherits a browser's
ceiling — roughly the same ~12 live fields it already gets on desktop,
nothing from the "Android-only" tier. Three real paths forward, in
increasing effort: (A) WebView wrapper — fast, but capped at
browser-level data; (B) WebView + a native JS bridge
(`addJavascriptInterface`) feeding real `SensorManager`/`BatteryManager`/
etc. data into this same JS — full data, keeps this UI; (C) full native
rewrite (Kotlin/Compose, this UI as the design reference) — full data,
Android's own layout system handles multi-device sizing for free, this
HTML isn't reused directly. None of these three has been started.

**Will the current fixed-size CSS frame work on a real phone?** The
decorative bezel never ships (see point 2 above), so that part is fine.
But `.device`'s fixed 390×844px box, if ever shipped as literal
production CSS (e.g. inside a WebView), would not adapt to real phones'
varying screen sizes and would need to become fluid (`100vw`/`100vh`)
first — not done yet, flagged as a pre-ship requirement, not urgent
while this stays a desktop-only preview tool.

**Are Android permissions automatic?** No. Every one has to be
explicitly declared in the manifest and explicitly requested at runtime;
the OS only prompts because app code asked first. The exact permission
list needed maps 1:1 to `android_api_exposure.md`'s per-component
findings (`RECORD_AUDIO`, `VIBRATE`, `CAMERA`, `ACCESS_FINE_LOCATION`,
`BLUETOOTH_SCAN`/`CONNECT`, `NFC`, `READ_PHONE_STATE`, `USE_BIOMETRIC`).
Broad file-system/storage permission doesn't apply — this app reads live
telemetry, it doesn't write files.

**Even with full native code and every permission granted, can we get
all 35 fields?** No — ceiling is 28 of 35. The same 7 fields the audit
found "not exposed" stay not exposed regardless of permissions, because
they have zero API surface by OS design, not a permission gate. Of
those 7, public spec-sheet lookup (keyed by detected device model
string) can genuinely backfill 3: chassis material, antenna band
support, fingerprint sensor type/vendor — all commonly published. The
other 4 have no public data anywhere, for any phone, ever: PMIC exact
rail ratings, individual PCB passives, individual MOSFETs, and true raw
fingerprint biometric data. That's not a research gap — it's
confidential OEM bill-of-materials data that manufacturers don't
publish, occasionally leaked piecemeal by teardown sites (iFixit,
TechInsights) for a handful of flagship phones only, never
systematically.

**Why can't the "missing 4" ever be found, concretely?** Because 3 of
them aren't single components — they're category buckets standing in
for a population that runs into the hundreds or low thousands per
phone. A real published teardown (Sony Xperia Z) counted 979 individual
components on the main PCB alone, 1,218 across the whole device; modern
smartphones commonly carry 800-1,500 individual MLCCs (multi-layer
ceramic capacitors) alone, more on 5G/flagship devices. No spec sheet
for any consumer phone lists resistors/capacitors/inductors or MOSFETs
individually — that data category doesn't exist publicly for any phone,
not just ones we haven't looked hard enough for.

**Backend/hosting plan (scoped, not built):** Railway hosts the API
(GitHub push → auto-deploy, standard Railway behavior, no custom CI
needed for a basic Flask app); Supabase provides Postgres + auth + RLS
for multi-user data isolation. Intended flow: Android app scans → POSTs
to the Railway API → stored in Supabase → pulled down to a local machine
running `brain.py` for the actual diagnostic/formula work. Sequencing
note: this shouldn't be built before the native Android data-access
layer exists, since there's no real data to pipe through it yet.

## Reuse note (why this file exists)

This whole sequence — (1) build a component vocabulary table for the
target platform, (2) audit exactly what the platform's own OS APIs
expose live vs. never, checked against real docs, (3) build a real-world
parts reference for spec-sheet backfill, (4) prototype the scan UI in a
fast, disposable medium before committing to a native build, (5) iterate
the UI with scripted DOM verification, not just screenshots — is the
general method, not something specific to phones. Repeating it for
PC/laptop means step 2 changes target (Windows WMI/PowerShell, macOS
IOKit/`system_profiler`, Linux `/sys` and `/proc`, each with their own
"what's actually readable by an unprivileged process" boundary to audit
the same way `android_api_exposure.md` did for Android) and step 3's
component vocabulary shifts to PC-relevant categories (motherboard,
PSU, cooling, storage controllers, GPU, expansion slots, etc.) — but the
shape of the process carries over directly.
