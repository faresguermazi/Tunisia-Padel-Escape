# Project direction

## Current state — 11 November 2026

Tunisia Padel Escape is a personal digital invitation for eight adults, 3–7 February 2027. The experience should combine padel, Tunisian character and time with friends.
It is a presentation, not a booking platform. No forms, accounts, payments or backend.

Petrol & cream is the only direction. The organizer rejected the second version;
the After the rally study and comparison control have been removed. Development
and review retain the mouse-ball interaction. Nothing is published automatically.

## Shared facts and voice

- Four nights and three breakfasts, at the stay on the three padel mornings.
- Padel Gammarth; two courts and two professional coaches.
- 4 and 5 February: 1.5 h coaching and 1.5 h friendly games.
- 6 February: 1 h coaching and 2 h Americano with local players.
- Optional afternoons: extra court time/local games by advance arrangement and
  local experiences planned with the guests.
- Private driver for the planned transfers. Airport minibus with luggage space;
  eight-passenger minivan for six one-way villa/club journeys. Four Seasons has
  airport transfers only. No all-day driver availability is promised.
- Times, availability, room sharing, access and seasonal facilities still need agreement.

Write as the organizer speaking to friends: warm, concise and specific. Preserve
facts and caveats without a repeated disclaimer. Do not promise February beach
weather, invent property facts, coach credentials, media rights or confirmations.

The opening is “Premium padel experience, with a little Tunisian spice.”
The blue-door closing retains “Good games. Even better company.”

## Reference: Petrol & cream

Five chapters: introduction, The journey, Stays, Your escape, What’s next. Visible
section titles match navigation. The journey has small Morning and Afternoon headings;
breakfast sits below Morning. Prices have no “included” suffix in the section title.
The route summary is called Transport, with the concise line “With a private driver.”

Keep the petrol/cream system, restrained lime accents, opening flag, left-aligned
villa pills, persistent green/star recommendation and side-by-side gallery/copy on
desktop. Use two pros and two tradeoffs up front and retain practical disclosures.
Prices appear only in Your escape, with shared inclusions. Only the hotel price
adds “Airport transfers only.” No repeated transfer exception under the route summary.

## Stays and estimates

| Stay                       | Estimate per guest | Position               |
| -------------------------- | ------------------ | ---------------------- |
| Villa Verde                | EUR800             | Current recommendation |
| Escaliers vers Marsa Plage | EUR700             | La Marsa alternative   |
| Four Seasons Hotel Tunis   | EUR1250            | Hotel alternative      |

Villa estimates are dated 8 November 2026. The hotel estimate was updated on
11 November 2026 to EUR1250, including three breakfasts and airport transfers.
These organizer figures include the agreed transfers and
remain provisional. No public EUR90 transport split. Do not automatically calculate
public estimates from private supplier costs or invent exclusions.

Villa Verde has stable ID `villa-verdi`; it is not Verdi Tunis Beach Resort. EL Dar
is absent from public content. Property links stay research metadata. Confirm bed
sharing, access, addresses, availability and winter facility use before reservations.

## Media, accessibility and build boundaries

The 27 organizer-supplied villa photos remain in their stable folders with rights
metadata; originals in `pictures/` are untouched. Caption numbered bedroom photographs
as views rather than proof of separate rooms. Destination/padel editorial media never
stands in for property or actual club photography.

The five hotel portfolio photographs are temporary local references. They are excluded
from production/review catalogs and build files; the build guard rejects their paths.
Development still shows them. Built hotel content uses a photography-pending state.

Keep keyboard and swipe galleries, dialog focus return, mobile navigation, readable
contrast and reduced-motion preferences. The local mouse-ball interaction respects
keyboard, touch and dialogs. Content stays visible without motion.

## Verification and publication

Use the existing Node 24 checks and browser wrapper documented in README. Browser QA
covers Petrol & cream at mobile/tablet/desktop widths, links, tabs,
galleries, accessibility, reduced motion and production/review boundaries.

Work remains local. On an explicit publication request, reuse the existing Site and
`share/hosted-review/.openai/hosting.json`, deploying only checked generated assets.
No automatic publication, repository commits or new remote repositories.

## Local identity exploration

The approved direction is now integrated beside the header name: a solid padel
racket with Arabic calligraphy, perforations, a throat and wrapped grip. BrandMark
uses `public/media/branding/tunis-racket.png` as an alpha mask in the current header
ink colour. This AI-generated refinement of the organizer-approved concept is a
transparent raster web asset, not a print-ready vector master or licensed font.
Its single 4.8-second turn respects reduced motion and the review motion toggle.
Work remains local. The earlier study below is retained only as historical exploration.

The rejected illustrated logo has been removed. The organizer approved a separate
study of a minimal racket with finer Arabic typography, accessible in development
at `?study=identity`. That earlier design is not the current header mark. Amiri Regular
lettering is converted to vector outlines; its source and OFL license are retained
with the study. The Arabic now sits inside the racket face. The complete emblem
performs one user-triggered five-second gentle turn and return, always facing forward.
Reduced motion disables the turn. Both deployable
builds exclude the study; this is not a second website direction.

Latest copy refinement: each stay has one two-sentence personal perspective instead of a Proposed badge and separate pros/cons lists. The recommendation label shares the property-kind line. The footer repeats the approved mark without animation; the closing connects padel progress with discovering Tunisia. The final references disclosure is removed, with source metadata retained.

The latest stay treatment supersedes the opinion paragraphs: two short plus/minus lines, with bed sharing no longer framed as a drawback. Closing trial: On court together. / Out exploring Tunisia.

Padel Gammarth now has a compact chapter before The journey, with club-owned research in src/content/padelClub.ts. Photography is explicitly editorial pending approved club images. Coaching copy remains generic until the team is supplied; extra facilities are not claimed as included. Claude's explore/creative-directions branch is merged: development/review links are ?direction=order-of-play and ?direction=blue-door. Both share the club content, styled to their own direction. The normal production build remains the reference without the version switcher. Publication is still deferred.

Current comparison: Reference, Petrol & doors (?direction=petrol-door), and The blue door. Order of play is removed. The hybrid reuses reference components and the shared Blue door hero/stays/closing, with scoped palette overrides and package-to-stay deep-link handling. Padel content is unchanged. Work remains local.
