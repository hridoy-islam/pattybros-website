# LashesByZee website

Luxury lash extension studio near Dartford Station, Kent. Next.js 14 (App Router), TypeScript, Tailwind CSS 3.4.

## Run

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:3000
```

## Structure

### Styling (Tailwind)

- `tailwind.config.ts` — the brand: colours (`primary` = logo gold `#c8a048`, `primary-dark`,
  `ink`, `ivory`, `cream`, `muted`, `line`, `espresso`), fonts (`font-display` EB Garamond,
  `font-sans` Jost), the page `container` (24 / 48 / 120px side margins) and the animations.
- `app/globals.css` — a few shared classes used across pages: `btn-primary`, `btn-secondary`,
  `btn-dark`, `link-arrow` (gold on hover), `eyebrow`, `h2`, `lead`, `section` (the gap between
  sections), `zoom-img`, `field-input`. Everything else is Tailwind classes in the JSX.
- `app/(admin)/admin.css` — the admin's classes (`btn--gold`, `card`, `table`, `badge`…) written
  with Tailwind `@apply`, scoped under `.adm`.

### Folders

- `app/(public)/` — the website: home, services, booking, gallery, about, contact, privacy, terms.
  Page sections live in `components/<page>/` (home, services, booking, contact) and shared parts
  in `components/public/` (Header, SiteFooter, PageHero, ActionBar, Hours).
- `app/(admin)/` — `/office` (sign in) and `/admin/*` (dashboard, bookings, services, settings,
  profile). Redux Toolkit + redux-persist, the same auth logic as Patty Bros (`authSlice`,
  `ProtectedRoute`, `AdminRedirectGuard`, axios instance with token refresh).
- `app/api/booking`, `app/api/contact` — send booking requests and messages by email (nodemailer);
  card deposits through Stripe Checkout when `STRIPE_SECRET_KEY` is set.
- `lib/moment-setup.ts` — every date and time is Europe/London (moment-timezone).
- `lib/availability.ts` — bookable days and start times from the opening hours.
- `lib/services.ts`, `lib/site.ts` — treatments, prices, hours, deposit and studio facts.

## Admin (mock data)

The admin runs on mock data until the API exists: `lib/mock/adapter.ts` answers the axios calls
with the same response shapes as the Patty Bros API, and keeps edits in the browser's localStorage.

- Sign in at `/office` with `admin@gmail.com` / `123456` (set in `lib/mock/db.ts`)
- Reset code for "Forgot password" in mock mode: `123456`
- Switch to the real API: `NEXT_PUBLIC_USE_MOCK=false` and `NEXT_PUBLIC_API_URL=https://...`
  (then remove the demo sign-in note on `/office`).

Bookings made on the public site are emailed; they do not appear in the mock admin.

## Still to supply

- Zee's own photographs and short videos (every photo now is an Unsplash stand-in).
- Real prices, durations, opening hours and the deposit amount (current values are placeholders).
- Business email, phone (optional), Instagram username (`lib/site.ts`), studio street address.
- SMTP details and, for card deposits, a Stripe key. Customer reviews once there are some.
