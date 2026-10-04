# Coach photo provenance — investigation findings

Status: **investigation complete.** No images were changed, moved, or deleted.
Scope owner: `orch-main`. This file is additive documentation only.

## Summary

All 8 coach photos are **wired and live on production**, but **none of them carries any
usable licensing or attribution metadata**. They are byte-identical copies of files in
the gitignored `unused-photos/` staging folder, so their origin is recoverable by
inspection but not from the images themselves.

## How the photos are actually wired

Two separate mechanisms exist. This is easy to misread, so both are documented:

1. **Live path — per-schedule `coachImage` field.** Each of the 8 entries in
   `SCHEDULES` (`src/data/dreamlineData.ts:291-445`) sets its own `coachImage`, e.g.
   `coachImage: '/coaches/royal-star-vip.jpg'`. This is what renders.
   Consumed at `src/components/NextBusesBoard.tsx:212` and `src/BookingPage.tsx:98`.

2. **Dead fallback — `COACH_IMAGES` map.** `src/data/dreamlineData.ts:131-135` is
   declared but **all three entries are commented out** and its keys
   (`'VIP 2x1 Recliner'`, `'Executive Luxury 2x2'`, `'First Class Sleeper'`) do not match
   the actual photo filenames. It is reached only as a fallback in
   `bus.coachImage ?? coachImageFor(bus.coachType)`, and since every schedule supplies
   `coachImage`, that fallback never fires. Effectively dead code.

Note the README (lines 60-62) still says *"The map is intentionally empty: candidate photos
must clear the quality bar before being wired."* That statement is **stale** — photos
are wired via mechanism 1.

## Metadata scan results

Method: raw-byte scan of each JPEG for embedded ASCII runs (XMP, IPTC, EXIF, JFIF
comment) plus source-URL and rights-keyword matching, and SHA-256 hashing against every
image in `unused-photos/`. Script: `Dreamline-session-tools\photo-provenance.cjs`.

| File | KB | XMP | EXIF | IPTC/other markers | Source URL in file | Identical original in `unused-photos/` |
|---|---|---|---|---|---|---|
| `border-eagle.jpg` | 53.2 | no | no | yes — `Photoshop 3.0` | none | `476555852_1009074634585619_8590696084105634797_n.jpg` |
| `coastal-breeze.jpg` | 58.6 | no | no | none | none | `images (14).jpg` |
| `executive-cruiser.jpg` | 119.0 | no | no | yes — `Copyright International Color Consortium, 2009` | none | `620353_368966856506800_279381787_o-1.jpg` |
| `highlands-vip.jpg` | 45.2 | no | no | none | none | `images (12).jpg` |
| `night-falcon.jpg` | 86.0 | no | no | yes — `Copyright International Color Consortium, 2009` | none | `627323_368966526506833_1027851027_o.jpg` |
| `rift-express.jpg` | 162.5 | no | no | none | none | `422838_376483885755097_2116555685_n-1.jpg` |
| `royal-star-vip.jpg` | 87.3 | no | no | none | none | `da07c28b88f77346.jpeg` |
| `western-monarch.jpg` | 53.9 | no | no | none | none | `dreamline-lounge.jpg` |

**Zero** of 8 contain an embedded source URL, creator, or licence statement. The ICC
profile copyright strings describe the *colour profile*, not the photograph, and
`Photoshop 3.0` is an authoring-tool marker — neither is a licence.

## Provenance risk

The filenames are strong evidence these are **third-party** images, not Dreamline's own
fleet photography:

- Four use Wikimedia/Flickr numeric ID naming (`476555852_1009074634585619_...`,
  `422838_376483885755097_...`, `620353_368966856506800_...`,
  `627323_368966526506833_...`).
- `western-monarch.jpg` traces to `unused-photos\dreamline-lounge.jpg`, which suggests a
  Dreamline-owned interior/lounge shot reused as a coach exterior.
- The remaining four trace to generic `images (N).jpg` downloads with no identifying
  information at all.

The commit that introduced them (`6f2856f`, "coach photos, simpler page...") documents
**no source or licence for any of the 8**. A sibling commit message (`fc3a1a8`) states
that Wikimedia was tried and returned *"Please honor our robot policy"* on media
download, and that *"no third-party images were vendored"* — yet 8 images were. The
project's own README (line 75-76) sets the rule this breaks:

> Only third-party images with confirmed licensing should be added; record
> attribution alongside them.

## Verification that photos are live (production, 2026-10-04)

- All 8 return HTTP 200 from `https://dreamline-sigma.vercel.app/coaches/<name>.jpg`
  with byte sizes matching the repo files exactly.
- Production bundle `/assets/index-4_LqkWKE.js` (333,299 bytes) contains all 8
  `/coaches/<name>.jpg` path strings — **8/8 referenced**.
- `HeroSection.tsx:29` additionally uses 3 of them as hero slides
  (`royal-star-vip`, `executive-cruiser`, `highlands-vip`), so unlicensed imagery is on
  the most prominent surface of the site.

## Recommendation (needs an owner decision — not actioned here)

1. **Resolve licensing before public marketing use.** For the 4 Wikimedia-named files,
   find the source page and record author + licence. For the 4 generic `images (N).jpg`,
   the origin is unknown and they should be treated as unusable until sourced.
2. **Do not redistribute** these as brand-owned fleet photography until confirmed.
3. Once sources are known, add attribution to `docs/PHOTO-LICENSING.md` and correct the
   stale README claim that `COACH_IMAGES` is intentionally empty.
4. Consider deleting `COACH_IMAGES`/`coachImageFor` if the fallback stays unreachable, or
   wire it properly as the single source of truth.
