# Developer Guide

## Code Standards

- Architecture: high cohesion, low coupling with domain/data/ui separation
- Language: English code comments and docs for source-level content
- Data source split:
  - Static hardware data in `src/data/*.json`
  - User data in Supabase (`saved_builds` table)
- Runtime persistence policy:
  - Frontend persistent logs use app-local storage (`src/lib/logger.ts`)
  - No writes to OS/system directories

## Git Workflow

- Branch model: Git Flow baseline (`main` + `dev`)
- Commit message style: Angular Commit convention
- Every commit must include co-author trailer:
  - `Co-authored-by: opencode-agent[bot] <opencode-agent[bot]@users.noreply.github.com>`
- Commit operations require explicit user confirmation in this project

## Agent Usage Rules

- Project agent workspace is `.opencode`
- Project custom skills are stored in `.opencode/skills`
- Required fork baseline: `LanternCX/superpowers`

## Local Commands

```bash
npm run dev
npm run test
npm run lint
npm run typecheck
npm run build
```
