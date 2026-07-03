# Jihasil HTML Edition Demo

Public-safe copy of the original Jihasil HTML Edition.

The visible frontend files are copied from the original `html-version/site` work. The only runtime adaptation is for GitHub Pages: the original `/api/*` calls are served by static JSON fixture files in this repository, so the pages keep the same fetch/render flow without requiring DigitalOcean, Supabase, cron jobs, or private credentials.

## What This Contains

- `index.html`, `recap.html`, and `clips.html` from the original HTML Edition.
- Original shared `assets/styles.css` and `assets/app.js` rendering logic.
- Static `/api/*` fixture responses shaped like the original Next API routes.
- No production `.env`, service-role key, OAuth secret, server IP, scheduled workflow, or private collector runtime.

## Demo URL

GitHub Pages:

```text
https://ophong.github.io/jihasil_demo/
```

## Run Locally

Use a local static server from the repository root:

```bash
python -m http.server 8080
```

Then open `http://127.0.0.1:8080`.

Opening the HTML files directly is not recommended because the original runtime uses `fetch("/api/*")`.

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
- Keep API fixture data static and public-safe.
- Do not add scheduled workflows.
- Do not add external scripts, analytics, or live backend API requests.
- Do not include server IPs, deploy keys, OAuth secrets, Supabase service-role keys, or admin allowlists.

See [docs/public-safety-checklist.md](docs/public-safety-checklist.md).
