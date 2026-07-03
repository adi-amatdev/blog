---
type: UI Component
title: Header
description: Site navigation bar with logo, navigation links, social icons, and dark/light theme toggle.
tags: [react, component, navigation, client-component]
timestamp: 2026-07-03T00:00:00Z
resource: src/components/Header.tsx
---

# Header

## Behavior

- Client component (`"use client"`)
- Displays site name (from env `SITE_NAME`), nav links, social icons, and theme toggle
- Navigation links: Home, About, Categories, Books
- Responsive: collapses on mobile
- Theme toggle uses `next-themes` with `class` strategy

## Dependencies

- `next-themes` for dark/light toggle
- [SocialIcons](../social-icons.md) for social media links
- [ThemeToggle](../theme-toggle.md) for dark mode switch
- `lucide-react` for icons
