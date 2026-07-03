---
type: Concept
title: Authentication System
description: End-to-end admin authentication flow using bcrypt password hashing and iron-session encrypted cookies.
tags: [auth, security, session, password]
timestamp: 2026-07-03T00:00:00Z
---

# Authentication System

## Flow

1. **Password Storage**: Password is bcrypt-hashed and stored in `ADMIN_PASSWORD` env var or `SiteSetting` table
2. **Login**: User submits password via `/api/admin/login`. Server compares with bcrypt hash. On match, creates an encrypted session cookie via `iron-session`
3. **Session Verification**: The [Proxy Auth Guard](../architecture/proxy.md) decrypts the session cookie on every `/admin/*` and `/api/admin/*` request
4. **Logout**: Session cookie is destroyed

## Key Files

- `src/lib/auth.ts` — `getSessionFromRequest()`, `createSession()`, `destroySession()`, password verification
- `src/proxy.ts` — Route protection (equivalent to middleware)
- `src/app/api/admin/login/route.ts` — Login endpoint
- `src/app/api/admin/set-password/route.ts` — First-run password setup

## Password Resolution Order

1. `ADMIN_PASSWORD` environment variable
2. `SiteSetting` table, key `password`
3. If neither exists, login is impossible until password is configured
