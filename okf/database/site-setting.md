---
type: Database Table
title: SiteSetting
description: Key-value store for site-wide configuration, including admin password hash and site metadata overrides.
tags: [prisma, postgresql, configuration]
timestamp: 2026-07-03T00:00:00Z
resource: prisma/schema.prisma
---

# SiteSetting

## Schema

| Column | Type | Description |
|--------|------|-------------|
| `key` | String (PK) | Setting identifier |
| `value` | String | Setting value |

## Known Keys

| Key | Purpose |
|-----|---------|
| `password` | bcrypt hash of admin password (fallback from `ADMIN_PASSWORD` env var) |

## Usage

Settings are simple string key-value pairs. The `password` key stores a bcrypt hash used for admin authentication. If the env var `ADMIN_PASSWORD` is set, it takes precedence over the DB-stored hash.
