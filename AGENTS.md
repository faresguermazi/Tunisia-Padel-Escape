# Coding-agent instructions

## Product

Tunisia Padel Escape is a private presentation for 8 adults, 3-7 February 2027
(Wednesday-Sunday), four nights. It is a luxury digital brochure, not a booking
platform. Guests discuss choices in their existing private channel.

- No backend, CMS, database, authentication, payments, maps, forms, voting,
  dashboards, booking buttons, availability search or sales funnels.
- Prioritize photography, padel, Tunisian character, readable content and simple
  navigation. Use short highlights and clear tradeoffs, not long marketing copy.
- February is not a beach-holiday promise. Never invent weather, property facts,
  availability, media rights or confirmations. Proposed plans are not bookings.
- Never invent logos, monograms or favicons. The rejected padel-player image must
  not return. Keep the approved blue-door closing and "Good games. Even better
  company." The long Between Sessions chapter remains removed.

## Publication policy

Work locally by default. Do not publish after routine changes. The organizer will
explicitly request publication when a version is ready. This supersedes earlier
permission to refresh the review site automatically. Always verify mobile as well
as desktop, especially galleries, crops and navigation.

## Current presentation

- Five chapters: introduction, The escape, accommodation, packages, next steps.
- Editorial is the production default and preferred reference. Review mode offers Editorial, Petrol & cream and Rally (a bolder local study). Remove the old Tabbed, Sunlight and palette-selector UI. Only the collapsible comparison controls remain review-only.
- Centered villa-choice pills follow the Villas/Hotel tabs; no shared villa intro block. Galleries and concise
  highlights/pros/cons sit side by side on desktop, stacked on mobile.
- Current shortlist: La Marsa, Villa Verde, Four Seasons. EL Dar is removed from
  public content; its internal historical costs and empty media folder may remain.
- Villa Verde is the organizer's current recommendation. The preferred ID controls
  the badge and emphasis. A selected ID later narrows to one stay without comparison.
- Organizer-supplied provisional estimates on 8 November 2026: La Marsa EUR700,
  Villa Verde EUR800, Four Seasons EUR1100 per guest. They are editable estimates,
  not confirmations. EUR follows the existing project pricing context. Each stay
  owns its estimate; villa prices are no longer shared. Scope and exclusions still
  need review, so do not claim these are a finalized complete offer.
- Breakfast belongs in all proposed packages. Show the shared schedule note once;
  timings depend on preferences and club availability. Three padel mornings are
  proposed for 4-6 February. Airport transfers are proposed on travel days.
- Four Seasons opposite the intended club is organizer-provided research; verify
  pedestrian access. Official hotel facilities and February operations need checking.
- Next: private preferences, agreed reservations/confirmation, optional Beyond Padel
  discussions. Optional ideas are not scheduled or included activities.

## Architecture

- Git and project documents live at root; all npm/Vite/React code is in `frontend/`.
  No workspaces, Docker, CI, backend or speculative platform abstractions.
- `src/app/`: entry/composition. `src/features/<domain>/`: domain presentation.
- `src/content/`: typed source of facts, copy, estimates and media references.
  Keep trip facts out of JSX. Domain types belong here, not in shared.
- `src/shared/`: genuinely reusable UI, utilities and global styles. Strict TS,
  functional components, named exports (App default), relative imports, no barrels.
- `public/media/accommodations/<stable-id>/`: approved property galleries.
  `padel/`: padel imagery; `activities/`: future approved activity media;
  `backgrounds/`: Tunisia editorial photography; `fonts/`: self-hosted licensed fonts.
  IDs and ordered `mediaIds` stay in content, with alt text and source/license metadata.
- Never substitute editorial photos for property or club photography. Property-source
  URLs remain research metadata, not property UI links; preserve mandatory credits.
  Villa Verde's stable ID is `villa-verdi`; it is not Verdi Tunis Beach Resort.
- Private supplier inputs remain in `internal/package-costs.json`, never imported by
  the client. Local calculator blocks unknown costs and unreviewed scope. No automatic
  transfer to public estimates, no assumed zeros or exchange rates. Deploy only dist.
- Preserve accessibility, visible focus, keyboard/swipe galleries, focus return and
  responsive layouts. Motion must respect reduced motion; content stays visible.
- No secrets or personal guest data in static assets. Unlisted URLs are not access control.

## Checks and handoff

Use Node24 from `frontend/`: `npm ci`, `npm run check`, `npm test`, `npm run build`.
In PowerShell use `npm.cmd` when npm.ps1 is blocked; do not change execution policy.
`npm run format` formats code and all three project documents. Preserve dependencies.
Browser QA: `scripts/browser-check.cmd` (or `npm run test:browser`). It owns servers
and cleanup. Use its narrow reusable command approval; do not regenerate temporary
QA scripts or install tools each session. Check all modes/palettes, mobile overflow,
galleries, reduced motion and production privacy when changing presentation.
Keep only README.md, AGENTS.md, docs/PROJECT.md as project documentation.
Report checks/limitations; never commit, publish or create a remote without a request.

An explicit review build (`npm run build:review`) outputs `frontend/dist-review/` with the direction controls, a short feedback prompt and noindex metadata. `npm run preview:review` previews it locally. It contains static assets only, never source or internal supplier costs. The normal `npm run build` remains selector-free. Share only a checked review build; noindex is not access control.

On 8 November 2026 the organizer approved public review hosting via Sites in a separate generated-files repository under ignored `share/hosted-review/`; do not commit or publish the working project repository. Reuse that hosting manifest for updates, never register another Site for this draft.

9 November refinement: Editorial is the preferred reference and default. Tabbed, Sunlight and the seven-palette strip were removed. A second review direction, Petrol & cream, uses the screenshot principles: navy/petrol, warm cream and a small lime accent, a compact five-day rhythm, photo-mosaic support and clear package links to the stays. Use only approved photos; do not copy unverified property/club images or the screenshot duplicate Saturday. Shared statuses are Included in the proposal (package scope, not a booking), Proposed (planned; details follow), Optional (group preferences). One concise proposal note carries the booking distinction; preserve material scope/availability/access caveats in details. The normal build has Editorial styling without review controls.

The organizer authorized the local villa pictures for draft use on 9 November 2026. The 27 supplied images are copied into the two stable villa media folders and registered in `src/content/propertyMedia.ts`; originals under `pictures/` remain untouched. Caption room numbers as photograph views rather than asserting separate rooms. Source/license links are optional for organizer-supplied property files; do not invent an open license or photographer. Keep original rights attribution. Four Seasons now has five temporary local portfolio photos, separate from organizer-supplied villa media.

Local-only work from 9 November 2026: do not publish after routine changes. The user will explicitly request publication when a version is ready. Prior hosting approval is not standing authorization for automatic updates. Always check mobile layouts and gallery behavior as well as desktop.

Four Seasons imagery is registered in `src/content/hotelMedia.ts` with `usage: temporary-local`, source attribution and no open-license claim. Five photos from the hotel design studio portfolio cover architecture at dusk, an illustrative suite bedroom, lounge, spa passage and lobby. Room imagery does not establish the package room category or seasonal facility access. Keep these local pending publication review; do not update the hosted draft automatically.

9 November compact refinement: prices belong only in Packages, never in stay chapters. Stays lead with photographs and icon-supported facts; show only two concise pros and two tradeoffs up front, retaining the full practical caveats in the disclosure. Petrol & cream removes duplicate highlight chips and supporting club copy, uses short session bullets and fixed-ratio daily images. Ending: Discuss, Choose, Confirm, Get ready under "Let's make it happen", preserving the approved final blue-door image and closing line. All changes remain local until explicit publication request.

Rally is a third, local experimental direction; retain Editorial as the default and Petrol & cream unchanged. It uses electric blue, ivory, flag-red and lime, an arched court image, Tunisian flag stamps, an animated ribbon and a padel-ball cursor for fine mouse pointers only. Motion can be paused and follows reduced-motion preferences; native cursors remain on touch, keyboard navigation and dialogs. The creative module/CSS are lazy and excluded from the normal guest build. The flag asset is public domain, sourced in `src/content/rallyStudy.ts`. Do not publish unless explicitly asked.

Transparent is a fourth local direction, with glass/ivory styling and a clear package/transport split. The organizer clarified that existing EUR700 La Marsa, EUR800 Villa Verde and EUR1100 Four Seasons totals already include transport. The proposed allowance is EUR90 per person, covering eight one-way journeys (two airport/stay and six stay/club). Subtract EUR90 to show EUR610/EUR710/EUR1010 before transport; adding it back preserves existing totals. Never add transport twice or silently round it to EUR100. Four Seasons is opposite the club, so airport-only scope needs review rather than an invented cheaper quote. Public amounts are guest-facing estimates, not private supplier costs; internal costing inputs are not updated automatically. Work remains local.

Latest local refinement: concise unnumbered section headings, no destination interlude or closing photographs. Keep the closing line, with optional Tunisia ideas as step five. The previous instruction to retain the closing blue-door image is superseded. Remove repeated package-scope summaries from the page; retain material details in disclosures. Petrol & cream and Transparent reuse the Rally mouse-ball interaction without its flag/ribbon visuals, respecting touch, keyboard, dialogs and reduced motion. Hotel pricing remains unchanged pending clarification of airport versus club transport. No publication.

Organizer clarification: keep Four Seasons EUR1100 per guest, with no club transfers needed. Transparent shows the EUR90 / eight-journey split for villas only; the hotel retains its single quoted total. Airport arrangements remain in practical details.

Current directions: only Petrol & cream (default/production) and Transparent remain. Editorial and Rally are removed. Transparent shares the Petrol & cream visual system, retaining the villa transport split and motion. It locally trials the approved Sidi Bou Said blue-door/flowers photograph at the end, with alternate closing copy and small Tunisian flags in the hero, optional fifth step and closing. Petrol & cream keeps its image-free ending. PadelPointer is the review-only mouse interaction; the old Rally visuals are removed. These instructions supersede earlier direction lists and closing-photo removal. Nothing is published automatically.

Latest closing refinement: step five is optional as a whole (typed optional flag), gently offering help with activities, local discoveries and reservations; no booking workflow. Transparent closing returns to centered italic "Good games. Even better company." over the lower blue-door/plant crop with date/signoff. Other flag studies stay in the hero and optional step.

The standalone status guide after the hero is removed: do not reintroduce the glossary or long proposal disclaimer. Preserve essential scope and availability information in relevant practical disclosures. Both directions now have the small Tunisian flag in the opening, including the default Petrol & cream.

Current review: Petrol & cream stays default, Transparent keeps its villa price split, and Court & culture is a third experimental direction (split photographic hero, padel/Tunisian character hook, same facts). All directions now use the approved blue-door closing image. Navigation uses "The journey". Header scene colors must fall back as a matched paper/ink pair for transparent sections; do not crossfade text/background through unreadable colors. The organizer explicitly requested publishing this completed review update; this does not authorize publishing future routine changes.

Publication review: temporary-local hotel portfolio photographs are excluded from built guest/review content and from the uploaded generated-assets checkout; they stay available in local development. Approved supplied villa photos remain in the shared review. Do not promote local-only image rights by publishing automatically.

10 November refinement: only Petrol & cream and Court & culture remain; Transparent and the EUR90 public split are removed. Guest-facing pricing is "Your escape", with the existing inclusive EUR700/EUR800/EUR1100 totals. One shared transport panel describes private premium transport with driver: airport minibus (luggage space), eight-passenger minivan for six one-way villa/club journeys, airport transfers only for Four Seasons. Coaching is offered at 1.5 h each morning and the Americano with local players is part of the programme, not a tentative extra; bookings are still not represented as confirmed. Optional extra court time/local games belong in afternoon cells. Only the discreet timing note follows the plan. No invented coach credentials, club photos or restaurant/fitness access: add when supplied/confirmed. No recurring header dates. Green gallery edges apply to every stay; Four Seasons is option 03. Keep changes local unless publication is requested again.

Current direction: only the Petrol & cream reference remains. Court & culture and the visual selector are removed. Keep the padel mouse/motion behavior and shared blue-door ending. The preferred villa tab has a star and a persistent green treatment, including while La Marsa is selected; recommendation and selected-tab state are distinct. Work stays local until another explicit publication request.

Pricing copy stays minimal: no standalone indicative/per-guest subtitle or proposal/flights-to-confirm footer. Keep amounts, shared inclusions, a short Included disclosure and the useful private-transfer details. Estimate state/date/notes remain in content metadata; do not turn estimates into booking confirmations. Only render supplied exclusions rather than invented fallback copy.

Latest organizer update: 2 courts and 2 professional coaches. On 4 and 5 February: 1.5 h coaching + 1.5 h friendly games. On 6 February: 1 h coaching + 2 h Americano with local players. Use the same optional afternoon wording throughout: extra court time or games with local players, by advance arrangement. The stay includes 3 breakfasts (supersedes daily-breakfast copy). Villa tabs align left, preserving the persistent Villa Verde star/green recommendation. Transport is shown as a compact icon-led route summary, not a text-heavy panel. No flag in What?s next; opening flag remains. This update is explicitly authorized for publication after checks.

Stay pricing cards have no collapsible inclusions/details. Shared inclusions list carries nights, 3 breakfasts, 3 padel mornings, 2 professional coaches, 2 courts, Americano with local players and private transfers. Only the Four Seasons price card adds "Airport transfers only." Do not repeat the hotel transport exception below the transport routes; the heading is "Private transfers."

Editorial voice: write as the organizer speaking to friends. Warm, direct, short and specific; no forced luxury adjectives, sales copy or decorative "curated" language. Preserve the approved spice line and closing. Explain each fact where it helps a decision; avoid repeating room summaries/bathroom counts and comparison bullets in the practical disclosure. Keep bed-sharing, availability, access, seasonal facilities and extra-charge caveats. Preserve factual offers, estimates and prices; copy edits must not invent confirmations.

Opening line approved: "Premium padel, with a little Tunisian spice." It replaces both former hero supporting lines; do not add another sentence underneath. Closing replacement is still awaiting organizer choice. Journey has breakfast at the stay on each of the three padel days, and optional local experiences planned with guests alongside extra court time. No subtitle under Padel Gammarth.

11 November local comparison update: the organizer requested edits to the reference
and a separate creative version. The opening is now “Premium padel experience, with
a little Tunisian spice.” Section headings match navigation: The journey, Stays,
Your escape, What’s next. Breakfast follows the small Morning heading; Afternoon has
matching hierarchy. Rename the route summary Transport and explain the benefit of
a private driver for the planned transfers, without promising all-day availability.

Petrol & cream stays the default/production reference. The new After the rally study
is available at `?direction=cinematic` in development/review, with a collapsible
Compare designs control linking back to `?direction=reference`. The organizer
explicitly authorized creative layout experimentation and a short Beyond padel
passage in this alternate. Preserve the reference and shared facts. The alternate,
its CSS and comparison control must remain excluded from the normal production build.
Temporary hotel photos remain local development only; built catalogs and files must
exclude them. Keep both versions local until publication is explicitly requested.
11 November spacing and hotel-price refinement: put the sun icon directly beside
Afternoon and leave clear breathing room between Morning and breakfast. Transport
copy is simply “With a private driver.” Four Seasons is now EUR1250 per guest,
including breakfast and airport transfers, superseding EUR1100. Keep the existing
three-breakfast scope and provisional status; update public estimate metadata only,
not internal supplier costs. Apply the shared price/copy to both local directions.

11 November direction decision: the organizer rejected the second version. Remove
After the rally and the comparison control; Petrol & cream is the sole direction
in development, review and production. Retain the latest itinerary spacing,
“With a private driver.” and the EUR1250 Four Seasons estimate. No publication.

11 November logo integration: the organizer explicitly authorized the existing
AnimatedLogo study from the other session beside the header wordmark. Keep it a
small supporting signature (48px desktop, 38px mobile), with responsive wordmark
sizing and room for the mobile menu. Keep the finite five-second introduction,
stationary Arabic lettering and reduced-motion/pause behavior. Do not repeat the
logo in the hero, chapter headings or closing. This authorization supersedes the
older blanket prohibition on logos for this supplied study only. Work stays local.

11 November logo review: the organizer rejected the illustrated animated logo’s
finish. Remove that study and restore the clean text-only header. Do not reintroduce
its metallic gradients, orbit or typeset Arabic approximation. A future replacement
needs a separately reviewed, precise minimal racket and refined lettering; no new
logo has been approved. Keep the current presentation local.

11 November identity study: the organizer authorized developing a separate minimal
racket/Arabic-lettering concept after rejecting the previous logo. The local-only
study is at `?study=identity` in development. Keep the actual presentation header
text-only. The study uses Amiri Regular, shaped into vector outlines, with its OFL
license retained; describe it as typography, not custom calligraphy. The racket
makes one user-triggered five-second turn; lettering remains still and reduced
motion disables animation. The study is excluded from both deployable builds.

11 November integrated identity refinement: the organizer prefers تونس inside the
racket. The separate study now uses a broader face with open space around the Arabic,
fine contour lines and one lime point. No perforation pattern behind the lettering.
The whole emblem gently turns and returns together; no full spin or mirrored Arabic.
Large, paper and realistic header-size proofs use the same integrated mark. The
actual site header remains text-only. This supersedes the separate-lettering study.

11 November approved identity: the organizer approved the generated solid racket
with integrated Arabic calligraphy, perforations and wrapped grip for refinement
and integration. The header now uses BrandMark with a transparent PNG alpha mask,
following the scene ink colour. One gentle 4.8-second turn settles upright; reduced
motion and the review motion switch disable it. This supersedes text-only header
instructions. The earlier thin-line identity study is historical, not the selected
mark. The generated raster is a web asset, not a production vector master for merch.
No publication is authorized by this change.

11 November stay copy refinement: replace the Proposed badge and pros/cons grids with two personal sentences per stay, covering the appeal and tradeoff. Villa Verde recommendation sits inline beside Private villa without another icon. Preserve practical access, sharing, availability and seasonal caveats. Organizer describes Four Seasons as five-star seaside comfort around five minutes on foot from padel; pedestrian access remains to check. Closing now reads More confidence on court. / A little more Tunisia to take home. Footer includes the approved racket mark, still. Remove the final Photography & references disclosure; source and rights metadata stay in content. All changes local.

Latest organizer refinement: stay comparisons use two short lines with restrained plus/minus symbols, showing one appeal and one meaningful tradeoff. Bed sharing is accepted and must not be presented as a disadvantage. Closing trial: On court together. / Out exploring Tunisia. This supersedes the previous closing and opinion paragraphs. Local only.

Recommendation placement: remove the label beside Private villa. The preferred stay now has a small cream-and-olive star on the main gallery image, with an accessible recommendation label. Preserve the existing recommended villa tab. Local only.

Recommendation badge refinement: trial a muted gold coin with a small embossed star, replacing cream/olive. Keep it static and discreet.

Closing cleanup: remove the combined date/signoff line over the closing photograph. Publication and Git handoff were requested, then paused by the organizer pending connection to their personal Git. Prepare and check locally; do not publish, commit or push until resumed.

Padel club introduction: a compact Padel Gammarth chapter precedes The journey, with labelled editorial photography pending approved club media. Club-owned sources support seaside setting, restaurant/terrace and fitness/pools; February access and charges remain unconfirmed and not included. Coach copy describes the planned experience, not invented identities or credentials. The organizer authorized fetching, merging and pushing Claude's creative versions together with this addition; publication remains deferred.
