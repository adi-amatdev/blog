---
type: API Endpoint
title: Admin Posts API
description: CRUD operations for blog posts — list, create, get, update, delete.
tags: [api, admin, crud, posts]
timestamp: 2026-07-03T00:00:00Z
resource: src/app/api/admin/posts/
---

# Admin Posts API

## List All Posts

`GET /api/admin/posts`

Returns all posts ordered by `createdAt` desc. No pagination. Include category names via `PostCategory`.

## Create Post

`POST /api/admin/posts`

Body: `{ slug, title, description, content, published, bannerImage, featured, categories }`

Validates slug uniqueness. Creates post with associated category entries.

## Get Single Post

`GET /api/admin/posts/[slug]`

Returns full post data including categories.

## Update Post

`PUT /api/admin/posts/[slug]`

Body: partial post data. Replaces category associations. Returns updated post.

## Delete Post

`DELETE /api/admin/posts/[slug]`

Deletes post and cascades to `PostCategory` entries.

## Post Viewing Endpoint

There is also a public (non-admin) `GET /api/posts` endpoint that returns paginated published posts for the public-facing blog.

```typescript
// POST /api/admin/posts — example usage
fetch('/api/admin/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: 'my-new-post',
    title: 'My New Post',
    content: '## Hello World',
    categories: ['tech', 'ai']
  })
})
```
