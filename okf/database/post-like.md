---
type: Database Table
title: PostLike
description: Per-post like counter with postSlug as primary key.
tags: [prisma, postgresql, engagement]
timestamp: 2026-07-03T00:00:00Z
resource: prisma/schema.prisma
---

# PostLike

## Schema

| Column | Type | Description |
|--------|------|-------------|
| `postSlug` | String (PK) | Post identifier, matches Post.slug |
| `count` | Int | Like count, defaults to 1 |

## Notes

- Unlike other tables, `PostLike` uses `postSlug` (not a CUID) as its primary key
- The count increments atomically: on like, if row exists, increment; if not, create with count=1
- Defined in Prisma schema but may not yet be migrated to the database
