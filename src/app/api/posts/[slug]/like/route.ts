import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  try {
    const like = await prisma.postLike.findUnique({ where: { postSlug: slug } });
    return NextResponse.json({ count: like?.count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  try {
    const like = await prisma.postLike.upsert({
      where: { postSlug: slug },
      create: { postSlug: slug, count: 1 },
      update: { count: { increment: 1 } },
    });
    return NextResponse.json({ count: like.count });
  } catch {
    return NextResponse.json({ error: 'Failed to like' }, { status: 500 });
  }
}
