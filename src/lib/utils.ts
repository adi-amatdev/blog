import fs from 'fs';
import path from 'path';
import { CONTENT_DIR } from './constants';

export function getContentPath(...segments: string[]) {
  return path.join(process.cwd(), CONTENT_DIR, ...segments);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export function readFileSafe(filePath: string): string | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

export function writeFileSafe(filePath: string, content: string): boolean {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch {
    return false;
  }
}
