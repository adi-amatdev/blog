---
type: UI Component
title: PostCard
description: Post preview card showing title, description, date, banner image, categories, and like/share actions.
tags: [react, component, client-component]
timestamp: 2026-07-03T00:00:00Z
resource: src/components/PostCard.tsx
---

# PostCard

## Behavior

- Client component (`"use client"`)
- Renders a post preview with: title, description, published date, banner image, category tags
- Includes Like button (API call to increment count) and Share button (copies URL)
- Used in homepage post list and category-filtered pages

## Props

- Post data (slug, title, description, published, bannerImage, categories, likes count)

## Dependencies

- [CategoryTag](../category-tag.md) for rendering category badges
- Like API (`/api/posts/[slug]/like`)
- `lucide-react` for heart/share icons
