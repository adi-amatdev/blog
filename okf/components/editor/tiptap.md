---
type: UI Component
title: TipTap Editor
description: Rich text editor for admin post creation, with markdown conversion, image upload, and code block highlighting.
tags: [react, component, editor, tiptap, client-component]
timestamp: 2026-07-03T00:00:00Z
resource: src/components/editor/TipTapEditor.tsx
---

# TipTap Editor

## Behavior

- Client component (`"use client"`)
- Built on TipTap (ProseMirror-based) with extensions:
  - StarterKit (bold, italic, headings, lists, blockquote, code)
  - Underline, Highlight, Link, Image
  - CodeBlockLowlight (syntax highlighting via lowlight)
  - Placeholder
- Rich text is converted to markdown via `turndown` before saving
- Images can be uploaded inline via the S3 Upload API

## Dependencies

- `@tiptap/react` + `@tiptap/pm` — core editor
- `@tiptap/starter-kit` — essential formatting extensions
- `@tiptap/extension-code-block-lowlight` + `lowlight` — code highlighting
- `@tiptap/extension-highlight` — text highlighting
- `@tiptap/extension-link` — link insertion
- `@tiptap/extension-image` — inline images
- `@tiptap/extension-underline` — underline support
- `@tiptap/extension-placeholder` — placeholder text
- `turndown` — HTML to markdown conversion
- `lucide-react` — toolbar icons

## Image Handling

- Images are uploaded via the `/api/admin/upload` route
- Supports drag-and-drop or click-to-upload
- Uses [ImageCropModal](../image-crop-modal.md) for cropping before upload

## Related

- [Admin Upload API](../../api/admin-upload.md)
- [Admin Posts API](../../api/admin-posts.md)
