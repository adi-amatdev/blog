---
type: Deployment Config
title: Docker Build
description: Multi-stage Docker build using pnpm, standalone Next.js output, and minimal production image.
tags: [docker, deployment, nextjs]
timestamp: 2026-07-03T00:00:00Z
resource: Dockerfile
---

# Docker Build

## Stages

### Builder (node:20-alpine)

1. Install pnpm via corepack
2. Install dependencies (frozen lockfile)
3. Generate Prisma client
4. Build Next.js with `NEXT_STANDALONE=true` (outputs to `.next/standalone/`)

### Runtime (node:20-alpine)

- Non-root user `nextjs` (UID 1001)
- Copies from builder:
  - `public/` — static assets
  - `.next/standalone/` — self-contained server
  - `.next/static/` — static build output
  - `node_modules/.prisma` — Prisma client for db access
- Exposes port 3000
- Runs `server.js` (Next.js standalone server)

## Key Details

- Standalone mode copies only necessary runtime files, reducing image size
- Prisma client must be explicitly copied from builder (not auto-detected by standalone mode)
- The `.env` file is NOT copied into the runtime image — use runtime env vars
