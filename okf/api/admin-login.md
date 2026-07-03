---
type: API Endpoint
title: Admin Login API
description: Authenticate admin user with password via iron-session.
tags: [api, admin, auth, login]
timestamp: 2026-07-03T00:00:00Z
resource: src/app/api/admin/login/route.ts
---

# Admin Login API

## Login

`POST /api/admin/login`

Body: `{ password }`

Checks password against `ADMIN_PASSWORD` env var first, then falls back to bcrypt hash from `SiteSetting` table. On success, creates an iron-session with `authenticated: true`. On failure, returns 401.

## Logout

`POST /api/admin/logout`

Destroys the iron-session cookie.

## Auth Flow

1. User visits `/admin/login` and submits password
2. Server compares against stored hash (bcrypt)
3. On match: session cookie is set (encrypted, HTTP-only)
4. Subsequent requests to `/admin/*` are authenticated via the proxy guard
5. `/api/admin/set-password` is also public (first-run setup)
