# Phase 8 Context — Legal Review & Remove DRAFT Banners

## Goal
Get Terms of Service and Privacy Policy reviewed by qualified counsel, apply their edits, and remove the `DRAFT — pending legal review` banners currently on both pages.

## Current state
- Terms + Privacy shipped in PR #14, rewritten as HK entity in PR #15 (Lifecycle Innovations Limited, BRN 76545088, HK office).
- Both pages visibly flag themselves as DRAFT at the top.
- Counsel not yet engaged for whoopgo.app specifically.

## Approach — reuse fiberwifi brief
- A legal review brief template already exists at `~/Projects/fiberwifi/.planning/phases/5-first-revenue-gtm/legal-review-brief.md`.
- Adapt that template for whoopgo.app's HK entity context: product is prepaid eSIM data plans, global customer base, Stripe payment processing, telecom resale via upstream aggregator (eSIMVault), no SIM card delivery, no voice service.
- Save adapted brief to `.planning/phases/08-legal-review/legal-review-brief.md` during planning (not context).

## Counsel
- Bjorn Schipper @ plusonelegal.nl — already engaged for Sam's other entities.
- Likely sublets HK-specific review to HK corresponding counsel; Bjorn can coordinate.
- Budget: expect €1.5k–€3k one-off for both docs.

## Success criteria
- Written legal sign-off (email or memo) on Terms + Privacy.
- Counsel edits merged.
- DRAFT banners removed from `src/pages/terms.tsx` and `src/pages/privacy.tsx`.
- `last_reviewed` date stamp added to each page footer.
- Jurisdiction + dispute resolution clauses confirm Hong Kong venue.

## Rough approach
1. Adapt the fiberwifi brief for whoopgo context.
2. Send brief + current docs + HK corporate details (BRN, registered address) to Bjorn.
3. Iterate on redlines (expect 1–2 rounds).
4. Apply final changes, remove DRAFT banners, update `last_reviewed`.
5. Log counsel memo to `.planning/phases/08-legal-review/legal-signoff.md` for audit trail.

## Out of scope
- Cookie banner / GDPR consent UI (separate phase if EU traffic grows).
- DPA templates for B2B resellers (no B2B pipeline yet).
