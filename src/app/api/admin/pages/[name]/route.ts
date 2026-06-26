import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const setting = await prisma.siteSetting.findUnique({ where: { key: `page_${name}` } });
  return NextResponse.json({ content: setting?.value || '' });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const { content } = await request.json();
  await prisma.siteSetting.upsert({
    where: { key: `page_${name}` },
    create: { key: `page_${name}`, value: content },
    update: { value: content },
  });
  return NextResponse.json({ ok: true });
}
