# AR Design Studio

**Scan. View. Experience. Order.**

AR Design Studio is a standalone SaaS MVP for QR-powered product catalogues, 3D previews, AR viewing, WhatsApp ordering, staff workflows, and analytics.

This project is only for AR/QR product showcase. It does not include unrelated agency dashboards or extra public route families.

## What MongoDB Stores

MongoDB is the main database for this SaaS. It stores the real company and operating data:

- Companies/businesses in the `Business` collection
- Business owners, staff, and Super Admin users in the `User` collection
- Products/menu items and GLB/USDZ model URLs in the `Product` collection
- Restaurant table QR records in the `TableQR` collection
- Campaign/offer QR records in the `Campaign` collection
- Scan, AR view, WhatsApp click, call, location, and share events in the `Analytics` collection
- Manual invoices, payments, expenses, salaries, and support activity for admin operations
- Super Admin security activity in the `AuditLog` collection

Public QR pages read from MongoDB. They do not use fake sample products.

## Stack

- Next.js App Router
- Tailwind CSS
- MongoDB Atlas + Mongoose
- Secure custom JWT auth
- bcryptjs password hashing
- Cloudinary image upload
- `@google/model-viewer` / model-viewer script for 3D and AR
- `qrcode` package for QR PNG data URLs
- Vercel deployment

## Routes

Public routes:

- `/`
- `/pricing`
- `/contact`
- `/b/[businessSlug]`
- `/b/[businessSlug]/product/[productSlug]`
- `/b/[businessSlug]/table/[tableNumber]`
- `/b/[businessSlug]/campaign/[campaignSlug]`
- `/api/public/*`
- `/api/analytics/track`

Auth routes:

- `/super-admin/login`
- `/business/login`
- `/business/register`
- `/staff/login`
- `/unauthorized`

Private dashboard routes:

- `/super-admin/dashboard`
- `/super-admin/businesses`
- `/super-admin/users`
- `/super-admin/products`
- `/super-admin/analytics`
- `/super-admin/leads`
- `/super-admin/reports`
- `/super-admin/subscriptions`
- `/super-admin/audit-logs`
- `/business/dashboard`
- `/business/profile`
- `/business/products`
- `/business/products/new`
- `/business/products/[id]/edit`
- `/business/qrs`
- `/business/tables`
- `/business/campaigns`
- `/business/staff`
- `/business/analytics`
- `/business/leads`
- `/business/reports`
- `/business/billing`
- `/business/settings`
- `/staff/dashboard`
- `/staff/products`
- `/staff/leads`
- `/staff/qrs`

## Professional SaaS Upgrades Included

- Lead inbox for WhatsApp clicks, calls, and shares
- CSV lead export and monthly report export
- Print-friendly monthly report page that can be saved as PDF from the browser
- Restaurant table cart ordering: customers can add multiple menu items and send one WhatsApp order with table number
- AR compatibility checklist for GLB, USDZ, HTTPS, and model size readiness
- Rotating image/stitched-preview fallback for products without a GLB model
- Business billing/invoice visibility for clients
- Product CSV import
- QR print/download/copy support
- Custom brand color, catalogue template, Google Analytics ID, and Meta Pixel ID fields
- Client health and usage warnings for products, AR models, storage, staff, approvals, and billing

## AR and 3D Reality Check

The app can show a rotating preview from a product image, fabric image, or stitched mockup image. True 3D rotation inside `model-viewer` and camera AR require a real `.glb` model URL, and iPhone/iPad AR works best with an optional `.usdz` URL.

For boutiques: an unstitched cloth photo alone cannot automatically become a rotatable stitched outfit. Use the fabric image and stitched mockup fields for preview, then add a paid 3D garment model as GLB/USDZ when full 3D/AR is required.

## Security Model

- Public customers never log in.
- Public QR pages under `/b/*` are open and never redirect to app login.
- Super Admin has no public registration page.
- Super Admin is created server-side only from environment variables during `/super-admin/login`.
- Business registration always creates `BUSINESS_OWNER`.
- Public registration never accepts a frontend role.
- Staff users are created only by Business Owner or Super Admin.
- Passwords are hashed with bcryptjs.
- Public APIs do not expose analytics, users, revenue, staff, subscriptions, counters, or private business settings.
- Business owners and staff are scoped to their assigned business.

## Environment Variables

Create `.env.local` for local development and add the same values in Vercel:

```env
MONGODB_URI=
AUTH_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_APP_URL=

SUPER_ADMIN_NAME=
SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=
SUPER_ADMIN_ALLOWED_EMAILS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_DEMO_WHATSAPP_NUMBER=919781580475
```

Example:

```env
NEXT_PUBLIC_APP_URL=https://ar.bsocio.in
NEXTAUTH_URL=https://ar.bsocio.in
SUPER_ADMIN_ALLOWED_EMAILS=owner@example.com,admin@example.com
NEXT_PUBLIC_DEMO_WHATSAPP_NUMBER=919781580475
```

The public demo request form opens WhatsApp directly. Set `NEXT_PUBLIC_DEMO_WHATSAPP_NUMBER=919781580475` in Vercel to send demo enquiries to +91 97815 80475.

## Local Setup

```bash
npm install
npm run dev
```

Open:

- Landing page: `http://localhost:3000`
- Super Admin login: `http://localhost:3000/super-admin/login`
- Business register: `http://localhost:3000/business/register`
- Business login: `http://localhost:3000/business/login`
- Staff login: `http://localhost:3000/staff/login`
- Mobile install page: `http://localhost:3000/install`

## Super Admin Setup

There is no Super Admin signup page.

Add these environment variables:

```env
SUPER_ADMIN_NAME=AR Design Studio Admin
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=your-strong-password
SUPER_ADMIN_ALLOWED_EMAILS=admin@example.com
```

Then visit `/super-admin/login`.

If the configured Super Admin email does not exist in MongoDB, it is created automatically with role `SUPER_ADMIN`.

## QR Code Rules

All QR codes point only to public browser routes:

- Product QR: `${NEXT_PUBLIC_APP_URL}/b/${business.slug}/product/${product.slug}`
- Catalogue QR: `${NEXT_PUBLIC_APP_URL}/b/${business.slug}`
- Table QR: `${NEXT_PUBLIC_APP_URL}/b/${business.slug}/table/${tableNumber}`
- Campaign QR: `${NEXT_PUBLIC_APP_URL}/b/${business.slug}/campaign/${campaign.slug}`

Do not set `NEXT_PUBLIC_APP_URL` to:

- `localhost`
- Vercel preview URLs with login protection
- dashboard routes
- private API routes

## Why QR Links May Ask For Vercel Login

If a scanned QR opens a Vercel login screen, that is usually **Vercel Deployment Protection**, not this app middleware.

Fix in Vercel:

1. Open your Vercel project.
2. Go to **Settings**.
3. Open **Deployment Protection**.
4. Turn protection off for production public QR URLs.
5. Make sure `NEXT_PUBLIC_APP_URL` is your public production domain.

Public customers must scan production URLs like:

```txt
https://your-domain.vercel.app/b/business-slug/product/product-slug
```

## Cloudinary Uploads

The app supports Cloudinary upload for:

- Business logo
- Business cover image
- Product image
- Campaign banner

It also supports optional hosted model upload for:

- `.glb` for web, Android, and 3D
- `.usdz` optional for iPhone/iPad AR Quick Look

Manual URL input is still available for GLB and USDZ files if the business hosts models elsewhere.

## Plan Limits and Fair Usage

Cloudinary free and low-cost plans have limited storage and transformation credits, so AR Design Studio does not sell unlimited hosting.

Starter:

- 10 products
- Image catalogue only
- Product QR and catalogue QR
- No included AR/3D models
- AR/3D can be added as a paid add-on
- 1 MB max image upload

Growth:

- 25 products
- Up to 5 AR/3D products included
- Table QR and campaign QR included
- 2 MB max image upload

Premium:

- 50 products
- Up to 15 AR/3D products included
- Advanced analytics and staff accounts
- 5 MB max image upload

MongoDB stores usage controls on each business:

- `storageLimitMB`
- `usedStorageMB`
- `arProductLimit`
- `productLimit`
- `staffLimit`

MongoDB stores upload usage on each product:

- `fileSizeMB`
- `modelFileSizeMB`
- `hasARModel`

Upload restrictions:

- Starter image uploads are limited to 1 MB.
- Growth image uploads are limited to 2 MB.
- Premium image uploads are limited to 5 MB.
- GLB/USDZ model uploads are blocked when the business reaches its AR product limit.
- Pasted GLB/USDZ model URLs are also blocked on product save when the AR product limit is reached.

Public pricing note:

```txt
Cloud storage and AR model hosting are included within fair usage limits. Heavy 3D models, high traffic, or extra storage may require an add-on.
```

## AR Requirements

Public product pages render model-viewer only when `modelGlbUrl` exists in MongoDB.

If `modelGlbUrl` is missing, the public page shows:

```txt
3D/AR model coming soon
```

For AR to work well:

- Use HTTPS production URLs.
- Use a valid `.glb` URL.
- Add optional `.usdz` for iPhone/iPad.
- Test on Chrome Android or Safari iPhone.

## Android and iOS Install Support

AR Design Studio includes PWA support:

- `public/manifest.json`
- `public/sw.js`
- Android icon: `public/icons/icon-192.png`
- Android large icon: `public/icons/icon-512.png`
- iOS home-screen icon: `public/icons/apple-touch-icon.png`
- Offline fallback route: `/offline`
- Install guide route: `/install`

Android users can install from Chrome using **Install app** or **Add to Home screen**.

iPhone users can install from Safari using **Share -> Add to Home Screen**.

Public customers still do not need to install anything. QR product, catalogue, table, and campaign pages open directly in the mobile browser.

## GitHub Upload Notes

Do not upload:

- `node_modules`
- `.next`
- `.env`
- `.env.local`
- `.vercel`

Use the clean GitHub upload folder generated by Codex, not the working folder if it contains build output.

## Vercel Deployment

1. Upload the clean source code to GitHub.
2. Import the repo into Vercel.
3. Add all environment variables.
4. Set `NEXT_PUBLIC_APP_URL` to the production Vercel URL or custom domain.
5. Turn off Vercel Deployment Protection for public QR usage.
6. Deploy.

## Production Build

```bash
npm run build
```

This project has been validated with a production build.
