---
type: Architecture Decision
title: Next.js App Router Structure
description: Route organization using Next.js 16 App Router with server components by default and client components where interactivity is needed.
tags: [nextjs, routing, rendering]
timestamp: 2026-07-03T00:00:00Z
---

# App Router Structure

The project uses Next.js 16 App Router with the following route groups:

## Public Routes

| Route | Component | Type |
|-------|-----------|------|
| `/` | `src/app/page.tsx` | Server component rendering featured + paginated posts |
| `/posts/[slug]` | `src/app/posts/[slug]/page.tsx` | Server component rendering markdown content |
| `/categories` | `src/app/categories/page.tsx` | Lists all categories |
| `/categories/[slug]` | `src/app/categories/[slug]/page.tsx` | Posts filtered by category |
| `/about` | `src/app/about/page.tsx` | Static markdown page (from `content/pages/about.md`) |

## Admin Routes

| Route | Component | Type |
|-------|-----------|------|
| `/admin` | `src/app/admin/page.tsx` | Admin dashboard |
| `/admin/login` | `src/app/admin/login/page.tsx` | Login form |
| `/admin/posts` | `src/app/admin/posts/page.tsx` | Post list / management |
| `/admin/posts/new` | `src/app/admin/posts/new/page.tsx` | Create post (TipTap editor) |
| `/admin/posts/[slug]` | `src/app/admin/posts/[slug]/page.tsx` | Edit post |
| `/admin/pages/about` | `src/app/admin/pages/about/page.tsx` | Edit about page |
| `/admin/pages/books` | `src/app/admin/pages/books/page.tsx` | Edit books page |

## Rendering Strategy

- **Server components by default** — pages fetch data via Prisma on the server
- **Client components** (`"use client"`) only where needed: TipTap editor, ThemeToggle, ImageCropModal, TypewriterHeading, PostCard (like/share buttons), AdminCategoryList
- **API routes** handle mutations (POST/PUT/DELETE) for admin CRUD

## API Routes

All admin API routes live under `src/app/api/admin/`. See [API](../api/) for details.
