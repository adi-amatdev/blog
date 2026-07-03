---
type: API Endpoint
title: Admin Set Password API
description: Set or change the admin password, stored as bcrypt hash in SiteSetting table.
tags: [api, admin, auth, password]
timestamp: 2026-07-03T00:00:00Z
resource: src/app/api/admin/set-password/route.ts
---

# Admin Set Password API

## Set Password

`POST /api/admin/set-password`

Body: `{ password }`

Public endpoint (not behind auth guard). Hashes the password with bcrypt and stores it in `SiteSetting` under the `password` key.

## Password Resolution

When authenticating, the system checks in this order:
1. `ADMIN_PASSWORD` environment variable
2. `SiteSetting` table `password` key (bcrypt hash)
3. If neither is set, login is impossible until password is configured

## Security

- Password is hashed with bcrypt before storage
- Session is encrypted via `iron-session` with a secret derived from app configuration
- Session cookie is HTTP-only and encrypted
