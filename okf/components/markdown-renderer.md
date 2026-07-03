---
type: UI Component
title: MarkdownRenderer
description: Server component that renders markdown content using unified/remark/rehype pipeline with syntax highlighting via shiki.
tags: [react, component, server-component, markdown]
timestamp: 2026-07-03T00:00:00Z
resource: src/components/MarkdownRenderer.tsx
---

# MarkdownRenderer

## Behavior

- Server component (no `"use client"` directive)
- Processes markdown through a unified pipeline:
  1. `remark-parse` — parse markdown to MDAST
  2. `remark-directive` — support `::callout` directives
  3. `remark-gfm` — GitHub Flavored Markdown (tables, strikethrough, etc.)
  4. `remark-rehype` — convert MDAST to HAST
  5. `rehype-raw` — support raw HTML in markdown
  6. `rehype-pretty-code` — syntax highlighting via shiki (dark/light themes)
  7. `rehype-stringify` — serialize to HTML

## Custom Directives

- `::callout` — styled info box
- `::callout-highlight` — emphasized callout
- `::callout-disclaimer` — warning/disclaimer box

## Styling

- Uses custom `.prose` CSS classes defined in `globals.css`
- Syntax highlighting: shiki with dark/light dual themes
- `shiki` listed in `serverExternalPackages` in next.config.ts to ensure server-side bundling
