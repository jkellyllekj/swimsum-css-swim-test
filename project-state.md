# SwimSum - CSS Swim Test - Project State

Last updated: 2026-03-28

## Product

- Name: **SwimSum - CSS Swim Test**
- Domain target: **CSSSwimTest.com**
- Relationship: SwimSum sub-product, standalone codebase/release.

## Scope (MVP)

1. Swim test input workflows (coach/swimmer friendly).
2. Computed outputs from test values.
3. Mobile-first UI.
4. Save/load recent entries locally.
5. Export/share result summary.
6. Basic SEO-ready website shell.

## Architecture decision

- Keep this as a separate project from `swimgen2`.
- Do not couple release cadence with existing SwimSum apps.

## Working model

- Use this file as the source of truth for this project only.
- Append updates; do not prune historical context.
- Keep steps practical and short (one concrete action at a time when needed).

## Related ecosystem (reference only)

- SwimSum main app (existing, separate project)
- SwimSum Coaches Stopwatch (existing, separate sub-app)
- Swimmer converter/calculator app(s) (planned)
- SwimSum - CSS Swim Test (this project)
- Broader **SwimSum family / swimmer-hub** intent (accounts, data, future apps): see append-only **Progress log** entry **2026-03-28 (later)** — not implemented in this repo.

## Next actions

1. Confirm exact MVP test formulas and required fields.
2. Choose initial stack (simple static app + JS logic).
3. Build first interactive screen + calculation output.
4. Define hosting/deploy path for `CSSSwimTest.com`.

---

## Progress log (append-only)

### 2026-03-27 — Stack, hosting, domain, and site implementation

**Stack**

- Static site: HTML, CSS, and vanilla JavaScript only.
- Source files live under `public/` (`index.html`, `styles.css`, `script.js`).
- Deploy target: **Firebase Hosting** via `firebase.json` (public directory: `public`).
- Firebase CLI: global install; project linked with `.firebaserc` default project **`cssswimtest`**.
- Default Firebase Hosting URL: `https://cssswimtest.web.app`
- Custom domain: **`cssswimtest.com`** registered at Porkbun; DNS updated per Firebase Hosting instructions (root `A` to Firebase IP, verification `TXT`; conflicting prior root `ALIAS` to Porkbun builder removed). Domain verified and site live on custom domain as of this session.

**Branding and content**

- Header uses SwimSum assets from production marketing site (same as `swimsum.com`): logo `https://swimsum.com/assets/swimsum-logo.png`, Google Play badge, App Store coming-soon badge; Play link uses package id `com.creativearts.swimsum`.
- Page structure: miniature marketing site — left column (stacked on mobile) explains Critical Swim Speed (CSS), test protocol (400m then 200m trials), engine profiles (Diesel / Balanced / Sprinter), benchmark text bands; right column sticky calculator on wide viewports.
- Footer-style section: “SwimSum App Family” placeholder cards (main app, Coaches Stopwatch, CSS Swim Test) for future copy and links.

**Calculator behavior**

- CSS pace per 100m: `(T400 − T200) / 2` seconds, displayed as `m:ss`.
- Estimated 1500m: CSS seconds × 15, displayed as `m:ss`.
- Engine profile from drop-off between CSS pace and average pace inside the 400 (`pace400 = T400/4`): Diesel if drop-off under 3 s; Sprinter if over 8 s; else Balanced.
- Time input: type `m:ss` (e.g. `6:40`) or total seconds; blur normalizes to `m:ss`. Per-field **−/+ 5s** nudge buttons for quicker adjustment.
- Validation: both times required; 200m must be faster than 400m total time.
- Visual comparison: horizontal pace bars (Pro ~1:00, Club ~1:20, Novice ~2:00) plus user bar scaled by pace (faster = wider bar in current mapping).
- Benchmark band card: classifies pace into World Class / Competitive / Intermediate / Novice style bands with short gap messaging (not medical advice; training-oriented copy).

**MVP scope — still open (not yet built)**

- Local persistence (save/load recent trials).
- Export or share result summary (e.g. copy text, share URL fragment, or simple download).
- Any backend or user accounts (explicitly out of scope for current static MVP).

**Operational notes**

- Porkbun DNS panel may show “Powered by Cloudflare” while nameservers remain Porkbun; propagation for `TXT` verification can lag after `A` is detected.
- Firebase free tier used; multiple small Hosting projects are generally fine; confirm quotas in Google Cloud / Firebase console if scaling.

**Repository**

- Git initialized in this project folder; default branch **main**.
- Remote: **https://github.com/jkellyllekj/swimsum-css-swim-test** (`origin`). Initial commit pushed 2026-03-27.

### 2026-03-28 — Demo times, clearer validation, UI evolution notes

**Calculator demo behaviour**

- Inputs ship with **real default values** in the `value` attribute (not only `placeholder`): **400 m = 6:40**, **200 m = 3:10**. That way a first tap on **Calculate CSS** always runs the full result path; newcomers were previously seeing validation errors because empty fields do not satisfy `parseTimeInput`.
- Copy explains that these are **example trials**; users replace with their own pool times after seeing the flow.
- Error strings were clarified for bad format, zero times, and 200 m not faster than 400 m total.

**Product direction (not implemented)**

- **SwimSum sign-in ecosystem (future):** intent is for one account to eventually hold saved **CSS test history**, **timer / stopwatch data**, and **generated workouts**, unified across apps. This static Firebase page has **no backend or auth** yet; a short on-page note sets that expectation without promising dates.

**Recent UX (since earlier March log)**

- Layout widened (wrap ~1024px), SwimSum app screenshots moved **below** the calculator with explicit “instant workouts” copy.
- Results replace the form in one card; **skyline-style** reference towers and positive tier messaging replaced older “novice band” wording and horizontal bar comparison.

### 2026-03-28 (later) — Skyline copy + swimmer-centric ecosystem notes

**Skyline UX (site behaviour)**

- Static **“what you’re looking at”** bullets before the chart: height = speed, colours = separate fiction examples (not leagues), green outline = user, hover/long-press for longer hints.
- Each reference tower gets a **short subtitle** (`tagline`) under the pace; full text in `title` / aria-label for accessibility.
- After calculate, a **green narration box** under the chart states in plain language: fictional examples, taller = faster, user’s CSS, and **nearest reference column** by seconds.
- Purpose: reduce “pretty but meaningless” — swimmers and coaches see **what the graphic is telling them** without assuming colours are competitive divisions.

**Ecosystem vision (product / architecture intent — not implemented)**

- **Swimmer-centred hub (parallel idea to patient-centred records):** long-term goal is that **one swimmer identity** (account / profile) anchors data: CSS test history over time, fastest times from timing/stopwatch apps, workouts generated or logged, optional video references, season plans (e.g. tri vs pool), and future tools. **This CSS site** is today a standalone **static web calculator** with no auth; native **CSS Swim Test app** is not shipped yet.
- **App family (current or planned names, separate codebases where noted):**
  - **SwimSum main app** — workout generator (`swimsum.com`, Android; email list / marketing underway).
  - **SwimSum Coaches Stopwatch** — deck timer / lanes (existing sub-project under main SwimSum repo elsewhere).
  - **CSS Swim Test** — this Firebase-hosted site (`cssswimtest.com`); future app + saved history TBD.
  - **Swimmer calculator / converter (planned)** — distance, time, yards, metres, tables; **masters qualifying** or federation times where we can source reliable data; **UK / legacy conversion** ideas (e.g. different pool lengths affecting qualifying standards in historical national systems) flagged for **future research** — verify current rules before building.
- **Commerce / identity:** aspiration that **buying one SwimSum-family app** could eventually **unlock or bundle** siblings (policy TBD — Play billing, account linking, legal). **Central data store** would aggregate only with explicit user consent and privacy design; no shared backend exists for CSS site yet.
- **Cross-project references:** Capisco and other non-SwimSum products mentioned by stakeholders are **out of scope** for this repository; analogy only (“everything hangs off the swimmer”) is captured here for planning, not as technical coupling.


