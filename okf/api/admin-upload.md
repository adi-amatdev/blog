---
type: API Endpoint
title: Admin Upload API
description: Upload images to S3/MinIO storage, returning a public URL.
tags: [api, admin, upload, s3, minio]
timestamp: 2026-07-03T00:00:00Z
resource: src/app/api/admin/upload/route.ts
---

# Admin Upload API

## Upload File

`POST /api/admin/upload`

Body: `FormData` with `file` field.

Flow:
1. Receives file via `FormData`
2. Generates UUID-based filename to prevent collisions
3. Uploads to configured S3 bucket via `minio` client
4. Returns JSON: `{ url: "https://..." }`
5. `S3_PUBLIC_URL` override: if set, URLs are constructed from this base instead of the S3 endpoint

## Configuration

S3/MinIO settings:

| Env Var | Purpose |
|---------|---------|
| `S3_ENDPOINT` | S3-compatible endpoint (e.g., `http://minio:9000`) |
| `S3_REGION` | Region (default: `us-east-1`) |
| `S3_ACCESS_KEY` | Access key |
| `S3_SECRET_KEY` | Secret key |
| `S3_BUCKET` | Bucket name |
| `S3_PUBLIC_URL` | Public URL base (if behind a reverse proxy/CDN) |

## Implementation

Uses the `minio` npm package directly. Creates bucket if it doesn't exist. Sets `Content-Type` based on file extension.
