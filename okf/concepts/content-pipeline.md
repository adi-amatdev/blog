---
type: Concept
title: Content Pipeline
description: How content is created, stored, and rendered — from TipTap editor to markdown to Prisma to React.
tags: [content, pipeline, markdown, editor, rendering]
timestamp: 2026-07-03T00:00:00Z
---

# Content Pipeline

## Two Content Systems

The blog has two parallel content systems:

### Blog Posts (Database-driven)

1. **Create**: Admin writes in TipTap rich text editor (WYSIWYG) → converts to markdown via `turndown`
2. **Store**: Markdown saved as `Post.content` in PostgreSQL via Prisma
3. **Render**: `MarkdownRenderer` processes markdown through unified/remark/rehype/shiki pipeline
4. **Display**: Rendered HTML is displayed on post pages

### Static Pages (File-based)

1. **Create/Edit**: Admin edits via simple textarea in admin panel
2. **Store**: Markdown files in `content/pages/{name}.md` with YAML frontmatter (title, etc.)
3. **Read**: Pages load markdown at build time or server-side, process through same `MarkdownRenderer`
4. **Pages**: `about`, `books` — accessed at `/about` and `/books`

## Image Pipeline

1. Upload via `/api/admin/upload` → stored in S3/MinIO
2. URL returned and embedded in markdown content
3. Displayed as `<img>` tags within rendered HTML

## Content Organization

- Posts are organized by categories (many-to-many via `PostCategory`)
- Featured posts are flagged and highlighted on homepage
- Posts are paginated (10 per page)
- Static pages have no categories
