# Public Safety Checklist

This checklist defines when the Jihasil demo is safe to publish as a public repository.

## Runtime

- [x] Static files only.
- [x] No backend server required.
- [x] No scheduled jobs.
- [x] No DigitalOcean Droplet, reserved IP, volume, load balancer, or database dependency.
- [x] No Supabase connection.
- [x] No Google OAuth flow.

## Data

- [x] Fictional member names.
- [x] Fictional channel identifiers.
- [x] Fictional viewer counts and schedules.
- [x] No private admin emails.
- [x] No user records.

## Browser Security

- [x] Restrictive Content Security Policy in `index.html`.
- [x] `connect-src 'none'` prevents network API calls from the app.
- [x] No external scripts.
- [x] No external fonts.
- [x] No external images.
- [x] No forms.

## Repository Safety

- [x] `.env` and `.env.*` are ignored.
- [x] No GitHub Actions workflows are included.
- [x] No package install is required.
- [x] No service-role key placeholder is included.
- [x] No DigitalOcean token placeholder is included.

## If Live Data Is Added Later

Do not put live credentials in this repository. Use a separate private backend or a read-only public API with rate limits, no privileged keys, and an explicit privacy review.

