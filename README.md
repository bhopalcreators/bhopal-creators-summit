# Bhopal Creators Summit — Full-Stack Project

A working MERN application: public site + Express/MongoDB API + a real
admin panel (not just an API). See "What's done vs. what's not" at the
bottom for an honest account of scope against the original spec.

## Quick start

### 1. Backend

```bash
cd server
cp .env.example .env
# edit .env: MONGODB_URI (Atlas free tier is fine), JWT_SECRET, Cloudinary keys
npm install
npm run seed   # creates a super_admin + populates content matching the current live site
npm run dev    # http://localhost:5000
```

The seed script prints the super admin email/password — log in with that at
`/admin/login` and change the password from Users & Roles immediately.

### 2. Frontend + Admin Panel

```bash
cp .env.example .env   # VITE_API_BASE_URL=http://localhost:5000/api
npm install
npm run dev    # http://localhost:5173
```

- Public site: `http://localhost:5173/`
- Admin panel: `http://localhost:5173/admin/login`

If the API isn't reachable, the public homepage falls back to the static
content in `src/data/siteContent.js` so it never breaks — but the admin
panel itself requires the API (there's nothing to administer otherwise).

## What's in the admin panel

- **Login** with JWT (httpOnly cookie), role shown in the sidebar
- **Dashboard**: live counts per content type, pending-submission alert
- **15 content types** with full create/read/update/delete + drag-free
  reordering (up/down buttons), all generated from one config file
  (`src/admin/config/resources.js`) — Hero Slides, Stats, Sponsors,
  Competitions, Workshops, Awards, Activities, Testimonials, Tickets,
  Agenda, Speakers, FAQs, Gallery Albums, Notices, Blog Posts
- **Previous Years**: dedicated editor per year — theme, overview, cover
  image, statistics, timeline, achievements, winners, and checkbox pickers
  to attach existing Speakers/Workshops/Competitions/Sponsors/Testimonials/
  FAQs to that year's page. Publish toggle controls whether the public page
  is live.
- **Media Library**: browse/upload/delete Cloudinary assets directly, plus
  an inline upload picker on any content form with a "media" field
  (image or video)
- **Form Submissions**: filter by type/status, review workflow, CSV export
- **Users & Roles**: create staff accounts, change roles, deactivate users
  (admin/super_admin only; a user can't demote or delete themselves)
- **Site Settings**: brand, contact info, theme colors, SEO defaults,
  announcement bar, footer text — one singleton form
- **Global Search** across speakers/sponsors/competitions/workshops/
  previous years/blogs

Every write action is permission-checked against the role table server-side
(`server/models/User.js` → `ROLE_PERMISSIONS`) — the UI hides controls a
role can't use, but the API is the real enforcement point, so this can't be
bypassed by editing frontend code.

## What's on the public site

Homepage (Hero, About, Stats, Sponsors, Competitions, Workshops, Awards,
Activities, 2024 Highlights, Testimonials, Tickets, Agenda, Footer), all
fetched live from the API. Plus:

- `/about` — dedicated About the Summit page with a live Previous Years grid
- `/previous-years/:slug` — full dedicated page per year (theme, timeline,
  stats, winners, speakers, workshops, competitions, sponsors, testimonials,
  achievements, FAQs, closing ceremony notes)
- `/competitions/:slug` — dynamic competition detail page (replaces the
  old static CollabVerse-2025-only page — any competition you create in
  the admin panel gets one of these automatically)

## Verification performed

- `npm run build` passes clean (frontend, 0 errors)
- `npx oxlint src/` — 0 errors, 2 harmless fast-refresh warnings on
  context/hook files (an accepted, unavoidable pattern)
- `npx oxlint .` on the backend — 0 errors, 0 warnings
- Every backend `.js` file passed `node --check` (syntax validation)
- The backend was booted end-to-end: all 20 Mongoose models, all routes,
  all middleware load without error; it correctly fails fast with a clear
  error message when MongoDB isn't reachable (proving the connection/error
  path works) — it will connect normally against a real `MONGODB_URI`
- I do not have a MongoDB instance or Cloudinary account in this sandbox,
  so I could not click through the admin UI against live data myself.
  Everything above confirms the code is structurally correct and wired
  together correctly; it does not replace you clicking through it once
  with real credentials.

## Project layout

```
bhopal-creators-summit/
├── src/
│   ├── admin/              # entire admin panel
│   │   ├── config/resources.js   # single source of truth for all 15 CRUD screens
│   │   ├── context/AuthContext.jsx
│   │   ├── components/     # AdminLayout, AdminForm, MediaField, Toast, ConfirmDialog...
│   │   └── pages/          # Login, Dashboard, ResourceList, PreviousYears*, Users, Settings...
│   ├── components/         # public site sections
│   ├── pages/               # Home, AboutPage, PreviousYearPage, CompetitionPage
│   ├── data/siteContent.js  # static fallback content
│   ├── hooks/useApiContent.js
│   └── lib/api.js
└── server/
    ├── models/              # 20 Mongoose schemas
    ├── controllers/         # incl. generic CRUD factory
    ├── routes/
    ├── middleware/          # auth, RBAC, rate limiting, error handling
    ├── config/              # db.js, cloudinary.js
    └── utils/seed.js
```

## What's done vs. what's not, against the original spec

**Done:** MERN stack, JWT auth, RBAC with 7 roles, MongoDB schemas with
validation/indexing/soft-delete/timestamps, Cloudinary media management,
admin-editable homepage sections, Previous Years module with per-year pages,
form handling with CSV export and spam protection, global search, security
middleware (helmet/CORS/rate-limiting/compression), a real admin dashboard
with working CRUD for every content type listed in the spec.

**Not done — genuinely out of scope for what one build session can respons
ibly deliver:**
- Payment gateway integration (ticket "reserve" logic exists; no Razorpay/
  Stripe wiring)
- SEO extras: sitemap.xml, robots.txt, structured data, dynamic per-page
  meta tags rendered into `<head>` (schema fields exist; nothing generates
  the tags yet)
- Draft/publish + version history, autosave
- Audit log viewer UI (the log is written on every write; nothing displays it)
- Email templates / transactional email sending
- Automated tests
- Production deployment configs (Docker, CI/CD, hosting-specific setup)
- Accessibility audit beyond semantic HTML/keyboard-focusable controls —
  no formal WCAG pass was done

If you want any of these next, say which one and I'll build it the same way
— fully, verified, not just described.
