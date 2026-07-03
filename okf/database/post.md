---
type: Database Table
title: Post
description: Core blog post entity with slug, title, content, banner image, and featured flag.
tags: [prisma, postgresql, content]
timestamp: 2026-07-03T00:00:00Z
resource: prisma/schema.prisma
---

# Post

## Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | String (CUID) | Primary key |
| `slug` | String (unique) | URL-friendly identifier |
| `title` | String | Post headline |
| `description` | String? | SEO/metadata description |
| `content` | String | Full post body (markdown) |
| `published` | DateTime | Publication date, defaults to now |
| `bannerImage` | String? | URL to featured image |
| `featured` | Boolean | Whether to highlight on homepage, defaults to false |
| `createdAt` | DateTime | Auto-set on creation |
| `updatedAt` | DateTime | Auto-updated |

## Relations

- Has many `PostCategory` entries (join table to `Category`)
- Cascade delete: deleting a post removes its `PostCategory` entries

## Usage

- Featured posts are displayed prominently on the homepage
- Posts are paginated (default: 10 per page)
- Each post has a like count in [PostLike](./post-like.md)
