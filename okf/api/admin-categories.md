---
type: API Endpoint
title: Admin Categories API
description: Delete categories and optionally their associated posts.
tags: [api, admin, categories, crud]
timestamp: 2026-07-03T00:00:00Z
resource: src/app/api/admin/categories/[name]/route.ts
---

# Admin Categories API

## Delete Category

`DELETE /api/admin/categories/[name]`

Query param: `deletePosts=true` (optional).

- Deletes the category by name
- If `deletePosts=true`, also deletes all posts in that category
- If `deletePosts=false` or omitted, only the category is removed (posts remain but lose the category association, though the `PostCategory` entries cascade-delete)

## Notes

- Category creation happens implicitly when creating/updating a post with new category names
- Renaming is not handled through the API; delete and recreate
- The public categories page lists all categories with post counts
