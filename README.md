# Jihasil Demo

Public-safe portfolio version of the Jihasil stream status dashboard.

This repository is intentionally **not** the private production app. It is a static demo that keeps the product story and UI behavior while removing every billable or sensitive runtime dependency.

## What This Shows

- A four-member live status dashboard with deterministic sample data.
- Schedule and operations views that mirror the original product workflow.
- A case-study section explaining the private architecture: Python collector -> Supabase contract -> Next.js dashboard.
- A public security model suitable for GitHub Pages, Cloudflare Pages, or Vercel Hobby.

## What Was Removed

- DigitalOcean Droplet cron runner
- Supabase service role access
- Google OAuth/admin session flows
- GitHub Actions scheduled workflows
- External API calls, analytics, third-party scripts, remote fonts, and live channel identifiers

## Run Locally

Open `index.html` directly in a browser.

Optional local server:

```bash
python -m http.server 8080
```

Then open `http://127.0.0.1:8080`.

No install step is required.

## Deploy

### GitHub Pages

1. Go to repository `Settings -> Pages`.
2. Choose `Deploy from a branch`.
3. Select `main` and `/root`.
4. Save.

This project does not include a GitHub Actions workflow, so it does not create scheduled jobs or background usage.

### Vercel or Cloudflare Pages

Import the repository as a static site. The output directory is the repository root.

## Public Safety Contract

The demo must remain safe to publish:

- Keep credentials and `.env` files out of the repository.
- Keep all data fictional or anonymized.
- Do not add scheduled workflows.
- Do not add external scripts, analytics, or live API requests.
- Do not include server IPs, deploy keys, OAuth secrets, Supabase service-role keys, or admin allowlists.

See [docs/public-safety-checklist.md](docs/public-safety-checklist.md).

