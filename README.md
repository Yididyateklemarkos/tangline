# Tang Line Trading — Full Stack Website

Stack: React (Vite) frontend, Node/Express backend, Supabase (Postgres) database,
Google Gemini for the AI document-reading admin assistant.

## Folder structure
```
tangline/
  backend/      Express API + AI assistant + Supabase client
  frontend/     React site (public pages + admin dashboard)
```

## 1. Set up Supabase (free)
1. Go to https://supabase.com → create a free project
2. In the SQL Editor, run the contents of `backend/schema.sql` — this creates all tables
3. Go to Storage → create a new **public** bucket named `tangline-media` (for product images)
4. Go to Project Settings → API → copy your `Project URL` and `service_role` key

## 2. Get a free Gemini API key
1. Go to https://aistudio.google.com/apikey
2. Create a key (free tier is generous — fine for this use case)

## 3. Backend setup
```bash
cd backend
cp .env.example .env
# Fill in .env with your Supabase URL/key, Gemini key, and pick an ADMIN_PASSWORD
npm install
npm run dev
```
Backend runs on http://localhost:4000

## 4. Frontend setup
```bash
cd frontend
cp .env.example .env
# Default VITE_API_URL=http://localhost:4000/api is correct for local dev
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## 5. Try it
- Visit http://localhost:5173 — public site (Home, Catalog, Request, About, Contact)
- Visit http://localhost:5173/admin/login — log in with the ADMIN_PASSWORD you set
  - **Products** — add/edit/delete catalog items
  - **Requests** — view/manage client product requests
  - **Contact Messages** — view contact form submissions
  - **AI Assistant** — upload a supplier PDF or product photo (and/or type instructions),
    AI drafts a catalog entry, you review and approve/reject before it goes live

## 6. Deploying for real (when ready)
- **Frontend**: push to GitHub, deploy on Netlify or Vercel (free) — point it at your repo's
  `frontend` folder, build command `npm run build`, output `dist`
- **Backend**: deploy on Render or Railway (free tier) — point it at the `backend` folder,
  set the same environment variables from your `.env` in their dashboard
- Update `VITE_API_URL` in the frontend's production env to point to your deployed backend URL

## Notes
- Admin auth is a single shared password (simple, fine for a one-person team). If you ever add
  staff, upgrade to Supabase Auth for individual logins.
- Email notifications on new requests aren't wired up yet — `backend/routes/requests.js` has a
  TODO where you can plug in a free service like Resend.
- The AI assistant never auto-publishes — every draft sits in `product_drafts` until you approve it.
