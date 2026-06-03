# Pikmin Collection Tracker

A personal Pikmin Bloom Decor Pikmin collection tracker built with Nuxt 3 and Supabase.

This project focuses on private collection progress: sign in with Google, track each Decor Pikmin, and sync your progress to Supabase.

## Features

- Personal Decor Pikmin collection tracking
- Google login through Supabase Auth
- Per-user cloud sync in Supabase
- Four progress states for each Decor Pikmin:
  - none
  - seedling
  - plucked
  - decor completed
- Mobile-first collection UI
- Search and filters by category, Pikmin type, and completion status
- Event decor data can be added through JSON files in `app/data/events/`

Friend/social features and map features are currently hidden so the app stays focused on personal tracking.

## Tech Stack

- Nuxt 3
- Vue
- Supabase
- Tailwind CSS
- pnpm

## Local Development

Install dependencies:

```bash
corepack pnpm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Fill in your Supabase values:

```bash
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=your-anon-key
```

Start the dev server:

```bash
corepack pnpm dev
```

Open:

```text
http://localhost:3000
```

## Supabase Setup

Run the SQL in `supabase/schema.sql` from your Supabase SQL editor.

In Supabase Auth, enable Google as an OAuth provider. Add your deployed site URL and local callback URL to the allowed redirect URLs as needed.

Typical local callback:

```text
http://localhost:3000/auth/callback
```

Typical production callback:

```text
https://your-domain.com/auth/callback
```

## Add Future Event Decor

Add a new JSON file under:

```text
app/data/events/
```

Use the same `definitions` shape as `app/data/decor.json`.

Example:

```text
app/data/events/2026-06-flower-crown.json
```

The app automatically loads event JSON files through `useDecorData.ts`, so adding future event decor does not require application code changes.

## Build

```bash
corepack pnpm build
```

Preview the production build:

```bash
corepack pnpm preview
```

## Deploy

### Option 1: Vercel

Vercel is the easiest option for this Nuxt app.

1. Push this repository to GitHub.
2. Go to Vercel and choose `New Project`.
3. Import `ZT0121/pikmin-collection-tracker`.
4. Framework preset should be detected as Nuxt.
5. Add environment variables:

```bash
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=your-anon-key
```

6. Deploy.
7. Add the Vercel production callback URL to Supabase Auth redirect URLs:

```text
https://your-vercel-domain.vercel.app/auth/callback
```

### Option 2: Render

Use these settings:

```text
Build Command: corepack pnpm install && corepack pnpm build
Start Command: node .output/server/index.mjs
```

Add the same Supabase environment variables in Render.

## Git Push

If this repository is empty on GitHub, push the current branch to `main`:

```bash
git push -u origin codex/personal-collection-tracker:main
```

If GitHub returns a 403 permission error, refresh your GitHub credentials or log in again using GitHub Desktop or GitHub CLI.

## Disclaimer

This is an unofficial fan project and is not affiliated with, endorsed by, or sponsored by Nintendo or Niantic.

Pikmin Bloom, Pikmin, and related assets are property of their respective owners. This project is intended for personal collection tracking and informational use.
