---
type: Configuration Reference
title: Environment Variables
description: Complete reference of all environment variables used by the blog application.
tags: [configuration, env, reference]
timestamp: 2026-07-03T00:00:00Z
---

# Environment Variables

## Database

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |

## S3 / MinIO

| Variable | Required | Description |
|----------|----------|-------------|
| `S3_ENDPOINT` | Yes | S3-compatible endpoint URL |
| `S3_REGION` | Yes | Region (default: us-east-1) |
| `S3_ACCESS_KEY` | Yes | S3 access key |
| `S3_SECRET_KEY` | Yes | S3 secret key |
| `S3_BUCKET` | Yes | Bucket name |
| `S3_PUBLIC_URL` | No | Public URL base for uploaded files (if behind reverse proxy) |

## Site

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE_NAME` | Yes | Site title, displayed in header |
| `SITE_URL` | Yes | Canonical site URL (CORS, links) |
| `SITE_DESCRIPTION` | Yes | SEO meta description |
| `ADMIN_EMAIL` | No | Contact/admin email |
| `RESUME_URL` | No | Link to resume/CV |

## Authentication

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | No* | Admin password (can also be set via DB) |

*Either `ADMIN_PASSWORD` env var or DB-stored password is required for admin access.

## Social Links

| Variable | Description |
|----------|-------------|
| `GITHUB_URL` | GitHub profile URL |
| `TWITTER_URL` | X/Twitter profile URL |
| `LINKEDIN_URL` | LinkedIn profile URL |
| `LEETCODE_URL` | LeetCode profile URL |
| `NOTION_URL` | Notion public page URL |

## Build

| Variable | Description |
|----------|-------------|
| `NEXT_STANDALONE` | Set to `true` to enable standalone output for Docker |
