import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { getAllPosts, createPost, savePost } from '@/lib/posts';

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const { title, description, categories, content } = await request.json();
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const slug = createPost(title, categories || []);
  await savePost(slug, {
    title,
    description: description || '',
    published: new Date().toISOString().split('T')[0],
    categories: categories || [],
  }, content || `# ${title}\n\n`);

  revalidatePath('/');
  revalidatePath('/categories');

  return NextResponse.json({ slug });
}
