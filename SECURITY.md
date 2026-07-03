# Security Policy

This repository is a static portfolio demo. It is designed to contain no secrets, no privileged API clients, and no production infrastructure bindings.

## Supported Surface

- `index.html`
- `assets/styles.css`
- `assets/app.js`
- Documentation under `docs/`

## Security Expectations

- Do not commit `.env` files, API keys, OAuth secrets, DigitalOcean tokens, GitHub deploy keys, Supabase service-role keys, or private endpoint URLs.
- Do not add cron workflows or hosted background jobs.
- Do not add external scripts, analytics beacons, third-party fonts, or live API calls.
- Render untrusted or sample data with DOM text APIs, not HTML string injection.
- Keep the Content Security Policy restrictive.

## Reporting

If you find a secret or production identifier in this public demo, rotate the original credential first, then remove the exposed value from the repository.

