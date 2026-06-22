import { NextResponse } from 'next/server';
import { readFileSafe, writeFileSafe, getContentPath } from '@/lib/utils';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const filePath = getContentPath('pages', `${name}.md`);
  const content = readFileSafe(filePath) || '';
  return NextResponse.json({ content });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const { content } = await request.json();
  const filePath = getContentPath('pages', `${name}.md`);
  const ok = writeFileSafe(filePath, content);
  return NextResponse.json({ ok });
}
