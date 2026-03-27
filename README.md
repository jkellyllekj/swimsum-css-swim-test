# SwimSum - CSS Swim Test

Standalone SwimSum sub-product for `CSSSwimTest.com`.

## Purpose

Build a focused swim test web app with a clean, mobile-first UX for swimmers and coaches.

## Status

The site is a **static miniature marketing + calculator** experience in `public/`, deployed with **Firebase Hosting** to project `cssswimtest` and custom domain **cssswimtest.com**.

- Explainer content (CSS meaning, test steps, engine types, benchmarks), SwimSum-branded header (logo + store badges from `swimsum.com` assets), app-family placeholder section.
- Calculator: `m:ss` or seconds input, ±5s nudges, CSS pace / estimated 1500m / engine profile, pace bar comparison, benchmark band summary.

Remaining MVP items from `project-state.md`: local save/load, export/share — not implemented yet.

See **`project-state.md`** for full product state, hosting notes, and append-only progress log.

## Quick start

1. Open this folder in Cursor as its own workspace:
   - `C:\Users\jesse\StudioProjects\SwimSum - CSS Swim Test`
2. Start a new agent chat in this workspace.
3. Paste your kickoff prompt and existing notes.

## Core docs in this project

- `project-state.md` (source of truth for this product)
- `WORKING-METHOD-CURSOR.md` (how we run sessions)
- `REFERENCE-LINKS.md` (links to related SwimSum docs)

## Deploy (Firebase Hosting)

1. Install Firebase CLI:
   - `npm install -g firebase-tools`
2. Login:
   - `firebase login`
3. Create/select Firebase project:
   - `firebase projects:create cssswimtest` (or use Console)
   - `firebase use --add`
4. Deploy hosting:
   - `firebase deploy --only hosting`
5. Add custom domain in Firebase Hosting UI and copy DNS records into Porkbun DNS.

