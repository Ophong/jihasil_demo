# Public Safety Checklist

This checklist defines when the Jihasil HTML Edition demo is safe to publish as a public repository.

## Runtime

- [x] Static files only.
- [x] No backend server required for the public demo.
- [x] Original `/api/*` calls are served by static files in this repository.
- [x] No scheduled jobs.
- [x] No DigitalOcean Droplet, reserved IP, volume, load balancer, or database dependency.
- [x] No Supabase connection.
- [x] No Google OAuth flow.

## Data

- [x] Static fixture rows only.
- [x] Original API response shapes are preserved for the HTML Edition renderer.
- [x] No production API dumps.
- [x] No access tokens, cookies, server IPs, or private admin identifiers.
- [x] Links use generic public placeholders rather than private production targets.

## Browser Security

- [x] No external scripts.
- [x] No external fonts.
- [x] No analytics.
- [x] No iframes.
- [x] No forms.
- [x] Dynamic values are escaped by the original renderer before insertion.

## Repository Safety

- [x] `.env` and `.env.*` are ignored.
- [x] No GitHub Actions workflows are included.
- [x] No package install is required.
- [x] No service-role key placeholder is included.
- [x] No DigitalOcean token placeholder is included.

## If Live Data Is Added Later

Do not put live credentials in this repository. Use a separate private backend or a read-only public API with rate limits, no privileged keys, and an explicit privacy review.
