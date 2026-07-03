---
type: API Endpoint
title: Admin Pages API
description: Read and update static content pages (about, books) stored as markdown files in content/pages/.
tags: [api, admin, pages, content]
timestamp: 2026-07-03T00:00:00Z
resource: src/app/api/admin/pages/[name]/route.ts
---

# Admin Pages API

## Get Page

`GET /api/admin/pages/[name]`

Reads markdown file from `content/pages/[name].md`. Parses frontmatter via `gray-matter`. Returns `{ data: { title, ... }, content }`.

## Update Page

`PUT /api/admin/pages/[name]`

Body: `{ content }`. Writes the full markdown file with updated content. Frontmatter is preserved by reading existing file, parsing frontmatter, and re-stringifying.

## Known Pages

- `about` — `content/pages/about.md`
- `books` — `content/pages/books.md`

```typescript
// Example
fetch('/api/admin/pages/about', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: '## Updated About\nNew content...' })
})
```
