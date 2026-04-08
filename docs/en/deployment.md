# Deployment Guide

## Environment Variables

Create `.env` from `.env.example`:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Build and Preview

```bash
npm install
npm run test
npm run lint
npm run build
npm run preview
```

## CI Behavior

GitHub Actions workflow: `.github/workflows/tag-test.yml`

- Trigger: push tags matching `v*` or `release-*`
- Action: install dependencies and run unit tests

## Production Notes

- Hardware catalog remains static in `src/data`
- User-specific build plans are stored in Supabase
- If deploying behind a CDN, ensure SPA fallback to `index.html`
