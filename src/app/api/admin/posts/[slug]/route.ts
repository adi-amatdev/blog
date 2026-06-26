import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { getPost, savePost, deletePost } from '@/lib/posts';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { title, description, categories, content } = await request.json();

  const existing = await getPost(slug);
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await savePost(slug, {
    title: title || existing.title,
    description: description ?? existing.description,
    published: existing.published,
    categories: categories || existing.categories,
  }, content ?? existing.content);

  revalidatePath('/');
  revalidatePath('/categories');
  revalidatePath(`/posts/${slug}`);

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await deletePost(slug);
  revalidatePath('/');
  revalidatePath('/categories');
  return NextResponse.json({ ok: true });
}
