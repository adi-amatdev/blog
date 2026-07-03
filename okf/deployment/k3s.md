---
type: Deployment Config
title: k3s Deployment
description: Deploy the blog to a k3s Kubernetes cluster with Secrets for database, S3, and site configuration.
tags: [deployment, kubernetes, k3s, secrets]
timestamp: 2026-07-03T00:00:00Z
---

# k3s Deployment

Deploy the blog to a k3s cluster using Kubernetes manifests. This assumes a running k3s cluster and existing Postgres + MinIO services (in-cluster or external).

## Prerequisites

- k3s cluster running
- `kubectl` configured
- PostgreSQL instance accessible from the cluster
- MinIO or S3-compatible storage accessible from the cluster
- Container image pushed to a registry (or loaded onto nodes)

## 1. Create Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: blog
```

## 2. Create Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: blog-secrets
  namespace: blog
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:password@postgres-service:5432/blogs"
  S3_ENDPOINT: "http://minio-service:9000"
  S3_REGION: "us-east-1"
  S3_ACCESS_KEY: "your-access-key"
  S3_SECRET_KEY: "your-secret-key"
  S3_BUCKET: "blogs"
  SITE_NAME: "Aadi's Intelligence"
  SITE_URL: "https://blog.example.com"
  SITE_DESCRIPTION: "Applied AI, Software engineering and Platform Engineering."
  ADMIN_PASSWORD: "your-admin-password"
  ADMIN_EMAIL: "admin@example.com"
  GITHUB_URL: "https://github.com/your-profile"
  TWITTER_URL: "https://x.com/your-profile"
  LINKEDIN_URL: "https://linkedin.com/in/your-profile"
  LEETCODE_URL: "https://leetcode.com/u/your-profile"
  NOTION_URL: "https://your-notion-url"
```

> **Security note:** `stringData` is base64-encoded by k8s automatically. For production, consider [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) or [External Secrets Operator](https://external-secrets.io/).

## 3. Create Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: blog
  namespace: blog
spec:
  replicas: 1
  selector:
    matchLabels:
      app: blog
  template:
    metadata:
      labels:
        app: blog
    spec:
      containers:
        - name: blog
          image: your-registry/blog:latest
          ports:
            - containerPort: 3000
          envFrom:
            - secretRef:
                name: blog-secrets
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

## 4. Create Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: blog
  namespace: blog
spec:
  selector:
    app: blog
  ports:
    - port: 3000
      targetPort: 3000
  type: ClusterIP
```

## 5. Create Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: blog
  namespace: blog
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web,websecure
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: traefik
  rules:
    - host: blog.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: blog
                port:
                  number: 3000
  tls:
    - hosts:
        - blog.example.com
      secretName: blog-tls
```

## 6. Deploy

```bash
kubectl apply -f namespace.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

## 7. Apply Database Migrations

```bash
# Run migrations as a one-off job
kubectl run db-migrate --image=your-registry/blog:latest \
  --namespace=blog --restart=Never \
  --env-from=secret/blog-secrets \
  --command -- npx prisma migrate deploy

# Or exec into a running pod
kubectl exec -n blog deploy/blog -- npx prisma migrate deploy
```

## 8. Verify

```bash
kubectl get all -n blog
kubectl logs -n blog deploy/blog
```

## Production Considerations

- Use a proper container registry (GitHub Container Registry, Docker Hub, etc.)
- Set up cert-manager for automatic TLS certificates
- Configure pod resource limits based on your workload
- Set `NEXT_STANDALONE=true` during build for smaller images
- Consider HPA (Horizontal Pod Autoscaler) for scaling
- Use `PERSISTENT` storage for uploads if not using S3
