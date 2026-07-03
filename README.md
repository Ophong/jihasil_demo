# Jihasil Demo

Public-safe static export of the `jiha.app` frontend.

This repository is a portfolio demo. The visible pages are built from the original Next.js frontend (`web/app`) rather than a redesigned mock page or an alternate static prototype. Server-side data, private credentials, cron jobs, Supabase writes, and Google OAuth are not included.

## Demo URL

GitHub Pages:

```text
https://ophong.github.io/jihasil_demo/
```

## What This Contains

- Static export of the original `jiha.app` home frontend.
- Exported `/clips/`, `/recap/`, and member detail pages for the four public members.
- Original Tailwind/Next visual structure, cards, mobile layout, tabs, filters, and GSAP motion.
- Public-safe static API fixtures for client-only reads such as `/api/clips/top` and logged-out schedule auth state.

## What Is Not Included

- DigitalOcean runner or cron jobs.
- Supabase service-role access or production `.env` files.
- Google OAuth login in the public demo.
- Admin schedule review or market-alert admin surfaces.
- Live backend API calls.

## Run Locally

Serve this repository from a parent folder so the path matches GitHub Pages:

```bash
python -m http.server 8080
```

Then open:

```text
http://127.0.0.1:8080/jihasil_demo/
```

For simple local inspection from the repository root, any static server is fine, but GitHub Pages uses the `/jihasil_demo/` base path.

## Public Safety Contract

- Keep credentials and `.env` files out of the repository.
- Keep API fixture data static and public-safe.
- Do not add scheduled workflows.
- Do not add live backend API requests.
- Do not include server IPs, deploy keys, OAuth secrets, Supabase service-role keys, or admin allowlists.

See [docs/public-safety-checklist.md](docs/public-safety-checklist.md).
