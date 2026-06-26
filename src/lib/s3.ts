import { randomUUID } from 'crypto';
import * as Minio from 'minio';

const RAW_ENDPOINT = process.env.S3_ENDPOINT || 's3.homelab';
let endPoint = RAW_ENDPOINT;
let useSSL = process.env.S3_USE_SSL === 'true';

if (RAW_ENDPOINT.startsWith('http://') || RAW_ENDPOINT.startsWith('https://')) {
  try {
    const url = new URL(RAW_ENDPOINT);
    endPoint = url.hostname;
    useSSL = url.protocol === 'https:';
  } catch {
    // fallback
  }
}

const S3_PORT = process.env.S3_PORT ? Number(process.env.S3_PORT) : undefined;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || 'minioadmin';
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || 'minioadmin';
const S3_BUCKET = process.env.S3_BUCKET || 'blogs';
const scheme = useSSL ? 'https' : 'http';
const portSuffix = S3_PORT ? `:${S3_PORT}` : '';
export const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL || `${scheme}://${endPoint}${portSuffix}/${S3_BUCKET}`;

let _client: Minio.Client | null = null;

function getClient(): Minio.Client {
  if (!_client) {
    _client = new Minio.Client({
      endPoint,
      port: S3_PORT,
      useSSL,
      accessKey: S3_ACCESS_KEY,
      secretKey: S3_SECRET_KEY,
      region: process.env.S3_REGION || 'us-east-1',
    });
  }
  return _client;
}

export async function ensureBucket() {
  const client = getClient();
  const exists = await client.bucketExists(S3_BUCKET);
  if (!exists) {
    await client.makeBucket(S3_BUCKET);
  }
  const policy = JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${S3_BUCKET}/*`],
      },
    ],
  });
  await client.setBucketPolicy(S3_BUCKET, policy);
}

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  mimeType?: string,
): Promise<string> {
  const client = getClient();
  await ensureBucket();
  const key = `${randomUUID()}-${filename}`;
  await client.putObject(S3_BUCKET, key, buffer, undefined, {
    'Content-Type': mimeType || 'application/octet-stream',
  });
  return key;
}

export async function deleteFile(key: string) {
  try {
    const client = getClient();
    await client.removeObject(S3_BUCKET, key);
  } catch {
    // file might not exist
  }
}

export function getFileUrl(key: string): string {
  return `${S3_PUBLIC_URL}/${key}`;
}
