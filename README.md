# Tunisia Padel Escape

A private, static presentation for eight adults visiting Tunisia, 3–7 February 2027.
Four nights, three padel mornings and a choice of two villas or Four Seasons Hotel Tunis.
Guests discuss preferences privately. No booking, payment or submission workflows.

## Local preview

Use Node 24. All npm commands run from `frontend/`:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

On this Windows workstation, `scripts/preview.cmd` also finds the existing portable
Node 24 runtime when Node is not on PATH. It starts a local-only server.

Open http://127.0.0.1:5173/. Petrol & cream is the only presentation.
The alternate and comparison controls have been removed.

```powershell
npm.cmd run check          # TypeScript, ESLint, Prettier
npm.cmd test               # Content integrity and private calculator tests
npm.cmd run build         # Production build and privacy/media guard
npm.cmd run build:review  # Review build, noindex, no private costs
.\scripts\browser-check.cmd # Desktop/mobile, galleries, accessibility, both builds
npm.cmd run format        # Source and the three project documents
npm.cmd run estimate:packages # Private local costing only
```

Browser QA uses installed Edge and the existing Playwright tooling. Its stable
wrapper owns its servers and cleanup and prints the screenshot directory.

## Continue on another laptop

After connecting and pushing this folder to your private Git repository, install
Git and Node.js 24 on the other laptop, then run:

```powershell
git clone YOUR_PRIVATE_REPOSITORY_URL tunisia-padel-escape
cd tunisia-padel-escape/frontend
npm.cmd ci
npm.cmd run dev
```

Open http://localhost:5173/. On macOS/Linux, use `npm` instead of `npm.cmd`.
Open the repository root in your editor so AGENTS.md and docs/PROJECT.md are available.
For later updates, pull committed changes with `git pull` from the repository root.
The hosted-review checkout under ignored `share/` is separate from this source repo;
publishing remains an explicit step using the existing Site, not automatic on push.

## Project folders

- `frontend/src/app/`: composition and navigation.
- `frontend/src/content/`: typed trip facts, copy, estimates and media references.
- `frontend/src/features/`: domain presentation.
- `frontend/src/shared/`: reusable galleries, tabs, photography, motion and styles.
- `frontend/public/media/`: approved local imagery and self-hosted fonts.
- `frontend/internal/`: private supplier inputs; never imported into the client.
- `frontend/scripts/`: checks, preview, build guard and private costing.

Git and project documents live at root. No workspaces, backend or deployment pipeline.

## Content and media

`trip.ts` composes the content. `accommodations.ts` owns the villas and `hotel.ts`
owns Four Seasons. Per-guest organizer estimates remain EUR700 La Marsa, EUR800
Villa Verde and EUR1250 hotel, including the agreed transfer scope. The hotel was
updated on 11 November 2026 and includes three breakfasts and airport transfers. These are
editable estimates, not confirmed reservations. Villa Verde is recommended through
`preferredAccommodationId`; `selectedAccommodationId` can narrow the stay chapter.

The plan includes three breakfasts, two courts and two professional coaches.
4–5 February: 1.5 h coaching + 1.5 h friendly games. 6 February: 1 h coaching +
2 h Americano with local players. Afternoon ideas remain optional.

The presentation uses shared typed content for prices,
arrangements and property facts. It retains the approved blue-door closing.

Register approved photos with alt text, dimensions, source/rights metadata and
stable IDs. Editorial images never represent the proposed club or properties.
The five temporary hotel portfolio photographs remain development-only. Vite
excludes their files from both build folders, and the guard checks this explicitly.

## Publication

Work stays local unless the organizer explicitly requests publication. Only built
static assets may be deployed. Never upload source, internal costs or local-only
hotel images. Noindex and an unlisted URL are not access control.

The existing hosted review is https://tunisia-padel-escape-review.observantabbey.chatgpt.site.
Its generated-assets checkout and manifest are under ignored `share/hosted-review/`.
Reuse that Site for any explicitly authorized update; never create another Site
or commit the working project without a request. The hosted draft is not automatically
updated by local changes.

See [project direction](docs/PROJECT.md) and [agent instructions](AGENTS.md).

## Local identity study

The separate logo proposal is available only in development at
`http://127.0.0.1:5173/?study=identity`. It shows a minimal racket with outlined
Amiri Arabic lettering at large and small sizes, on petrol and cream. Use Play one
turn to inspect the finite motion. Reduced motion keeps it static. The presentation
header remains text-only, and neither production nor review builds includes the study.
