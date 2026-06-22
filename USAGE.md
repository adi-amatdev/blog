# Aadi's Intelligence — Usage Guide

## Overview

A Next.js blogging platform with a Notion-like admin editor. Write posts in a rich block-based editor, manage categories, and publish to your homelab.

## Quick Start (Development)

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local — set ADMIN_PASSWORD (min 32 chars)

# Start development server
npm run dev
```

Visit `http://localhost:3000` — public blog.
Visit `http://localhost:3000/admin` — admin panel (login with ADMIN_PASSWORD).

## Project Structure

```
├── content/
│   ├── pages/
│   │   ├── about.md        # About page content
│   │   └── books.md        # Books page content
│   └── posts/
│       └── [slug]/
│           └── index.md    # Post content + frontmatter
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home
│   │   ├── posts/[slug]/page.tsx # Article page
│   │   ├── categories/           # Category pages
│   │   ├── books/page.tsx        # Books page
│   │   ├── about/page.tsx        # About page
│   │   ├── admin/                # Admin panel
│   │   └── api/admin/            # Admin API routes
│   ├── components/
│   │   ├── editor/TipTapEditor.tsx  # Notion-like editor
│   │   ├── Header.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   └── ...
│   └── lib/
│       ├── posts.ts      # Post CRUD (reads/writes markdown files)
│       ├── categories.ts # Category aggregation
│       └── auth.ts       # Session management
├── k8s/                  # Kubernetes manifests
├── Dockerfile            # Production container
└── .env.example
```

## Using the Admin Panel

### Login

1. Navigate to `/admin`
2. Enter the password from your `ADMIN_PASSWORD` env var
3. You're redirected to the dashboard

### Creating a Post

1. Go to **Posts** in the admin sidebar (or Dashboard → New Post)
2. Enter the title, categories (comma-separated), and optional description
3. Use the editor toolbar:
   - **Formatting**: Bold, italic, underline, strikethrough, highlight
   - **Headings**: H1, H2, H3
   - **Lists**: Bullet and ordered
   - **Blocks**: Blockquote, code block
   - **Links**: Select text → click link icon → enter URL
   - **Images**: Click image icon → enter URL
4. Click **Save** — the post is saved as a markdown file in `content/posts/`

### Editing a Post

1. Go to **Posts** in the admin sidebar
2. Click any post to open the editor
3. Edit and click **Save**
4. Click **Delete** to remove (with confirmation)

### Editing Pages

- **About** and **Books** pages have dedicated editors under **About Page** and **Books Page** in the sidebar

### Writing in Markdown (directly)

Posts are plain markdown files. You can also write them by hand:

```markdown
---
title: "My Post"
published: "2026-06-21"
categories: [go, runtime]
description: "A brief description"
---

Content here...

::highlight
Important insight
::

```go
func main() { }
```

::disclaimer
Note to reader
::
```

Supported callout types:
- `::highlight` — Amber left border, labeled "Highlight"
- `::disclaimer` — Gray left border, labeled "Disclaimer"

## Deployment to k3s

### Prerequisites

- k3s cluster running
- `kubectl` configured
- Docker registry accessible from your cluster (or use `k3s ctr images import`)

### Steps

```bash
# 1. Build the Docker image
docker build -t blog:latest .

# 2. (Optional) Push to registry
docker tag blog:latest registry.home.local/blog:latest
docker push registry.home.local/blog:latest

# 3. Update image in k8s/deployment.yaml if using a registry

# 4. Set admin password in k8s/secret.yaml
# Edit k8s/secret.yaml — change admin-password value

# 5. Deploy to k3s
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# 6. Verify
kubectl -n blog get pods
kubectl -n blog get ingress
```

Access at `http://home.local` (add to `/etc/hosts` or configure DNS).

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ADMIN_PASSWORD` | Yes | — | Password for admin login (min 32 chars) |
| `SITE_URL` | No | `http://home.local` | Public site URL |
| `CONTENT_DIR` | No | `content` | Directory for markdown content |
| `GITHUB_URL` | No | — | GitHub profile URL |
| `TWITTER_URL` | No | — | X/Twitter profile URL |
| `LINKEDIN_URL` | No | — | LinkedIn profile URL |

## Customization

### Colors

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --accent: #d97706;        /* Amber-600 */
  --accent-hover: #b45309;  /* Amber-700 */
}
```

### Social Links

Set `GITHUB_URL`, `TWITTER_URL`, `LINKEDIN_URL` env vars, or edit `src/lib/constants.ts`.

### Site Name

Set `SITE_NAME` in `src/lib/constants.ts`.
