---
type: Architecture Decision
title: Proxy Auth Guard
description: Session-based authentication guard for admin routes using iron-session, implemented as a proxy function (equivalent to Next.js middleware).
tags: [auth, middleware, security, iron-session]
timestamp: 2026-07-03T00:00:00Z
resource: src/proxy.ts
---

# Proxy Auth Guard

Admin routes are protected by a proxy function in `src/proxy.ts` that runs before requests to `/admin/*` and `/api/admin/*`.

## How it works

1. A matcher config targets all `/admin/:path*` and `/api/admin/:path*` routes
2. Public paths (`/admin/login`, `/api/admin/login`, `/api/admin/set-password`) are exempted
3. All other admin requests go through `getSessionFromRequest()` which reads an encrypted session cookie via `iron-session`
4. If the session has `authenticated: false`, the user is redirected to `/admin/login`

## Implementation

```typescript
// src/proxy.ts
const publicAdminPaths = ['/admin/login', '/api/admin/login', '/api/admin/set-password'];

export async function proxy(request: NextRequest) {
  if (publicAdminPaths.includes(pathname)) return NextResponse.next();

  const response = NextResponse.next();
  const session = await getSessionFromRequest(request, response);

  if (!session.authenticated) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return response;
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
```

## Session Details

- Uses `iron-session` v8 with encryption
- Session is created on successful password verification (bcrypt compare)
- Password can be stored either in `ADMIN_PASSWORD` env var or in the `SiteSetting` table
- Session is destroyed on logout
