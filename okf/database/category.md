---
type: Database Table
title: Category
description: Taxonomy for organizing blog posts with many-to-many relationship.
tags: [prisma, postgresql, taxonomy]
timestamp: 2026-07-03T00:00:00Z
resource: prisma/schema.prisma
---

# Category

## Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | String (CUID) | Primary key |
| `name` | String (unique) | Display name and slug |

## Relations

- Has many `PostCategory` entries (join table to `Post`)
- Cascade delete: deleting a category removes its `PostCategory` entries
- Deleting a category does NOT delete the associated posts

## Join Table: PostCategory

| Column | Type | Description |
|--------|------|-------------|
| `postId` | String | FK to Post, part of composite PK |
| `categoryId` | String | FK to Category, part of composite PK |

Composite primary key: `(postId, categoryId)`. Both foreign keys cascade on delete.
