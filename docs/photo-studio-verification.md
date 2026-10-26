# Photo Studio verification — 26 October 2026

Scope: add an experimental, zero-paid-API photo-to-3D creation route to the existing food AR site.

## Implemented

- /ar/create with local PNG/JPEG/WebP preparation and explicit external-processing consent.
- Direct connection to Microsoft's public TRELLIS.2 Space; no API key or paid fallback.
- Shaded colour angle views extracted as image data, without inserting provider HTML.
- GLB export/download when free GPU quota permits; completed angle views survive export failure.
- Validated self-contained GLB import and interactive viewing.
- IndexedDB drafts, explicit viewer-file caching, and draft import into the authenticated product form.
- QR creation restricted to same-origin public product routes with a publicly available GLB.
- Mobile navigation entry and Escape-key handling.
- Service worker excludes private dashboards, APIs, cross-origin requests, RSC responses, and unsuccessful/private responses.

## Completed checks

- 29 automated feature checks passed, including malformed assets, external model dependencies, shaded-view selection, quota failure preservation, cancellation, QR restrictions, and offline routing.
- Existing 16 smoke assertions passed.
- Production build passed. Focused lint passed with direct-image warnings and an existing unused navigation prop warning.
- Browser: photo upload, consent gating, external QR rejection, GLB import/rendering, offline save completion, full reload and saved-draft reopening passed.
- Mobile at 390px: no horizontal overflow; new navigation link present.
- Staged deployment health endpoint returned status ok.

## External AI experiment

The real test returned 8 angle views. The input photo contained a café background, which the model reconstructed alongside the product. This does not establish product-accurate conversion. Use an isolated product on a plain background and inspect the result.

GLB extraction was rejected by the free service's GPU quota. No paid fallback was invoked. Successful end-to-end automatic GLB export therefore remains unverified.

Browser access to the external service failed. The browser now uses a same-origin, bounded streaming route; the server connects to the official Space URL. The bridge requires processing consent, rejects cross-origin POSTs, caps uploads below the platform body limit, applies a best-effort attempt limit, and supports cancellation. It has no paid inference fallback. Existing hosting usage limits still apply.

## Remaining limits

- New generation requires internet and available external GPU quota.
- Automatic background removal is not included.
- Single-image hidden surfaces, labels, colours, and physical size are estimates.
- Physical Android/iPhone camera AR and a true airplane-mode phone restart were not tested.
- Authenticated upload, approval, and public QR publication were not exercised with live customer records.
- Browser cleanup can remove local drafts. Download important GLB files.

The current production source was recovered from Vercel before feature work because GitHub's main branch did not contain the newer deployed food AR pages.

The origin guard uses the reverse proxy host/protocol and was verified through the actual Next.js route: an unconsented same-site request returns HTTP 400; cross-origin requests return HTTP 403.
