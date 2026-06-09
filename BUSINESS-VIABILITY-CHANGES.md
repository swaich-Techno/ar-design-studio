# Business Viability Changes

## Included in this build

- Upgraded public product AR behavior with a direct `View live AR / 3D` action, lazy model loading, device AR launch, and a USDZ fallback for iPhone/iPad.
- Fixed the demo form so it saves to `/api/contact` before WhatsApp follow-up.
- Added a Super Admin demo request queue at `/super-admin/demo-requests`.
- Added one-product demo approval that creates or updates a trial client workspace with one product slot, one AR slot, and a 14-day demo window.
- Added demo status fields to support tickets and demo entitlement fields to businesses.
- Added client-scoped Cloudinary upload folders so customer files are grouped under their own business slug.
- Updated dashboard priority counts so free demo requests appear alongside product approvals.
- Added README notes for email settings, demo approval, and future asset/backend architecture.

## Suggested next step for point 3

Keep Cloudinary for the MVP, but add an `Asset` model and storage adapter layer before building a fully personal backend. That gives each customer their own asset library, keeps quota checks enforceable, and lets you later move from Cloudinary to S3/R2/personal storage without rewriting product forms.
