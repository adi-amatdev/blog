import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import { getPost, getAllPostSlugs } from '@/lib/posts';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted">
          <time dateTime={post.published}>{formatDate(post.published)}</time>
          {post.categories.length > 0 && (
            <div className="flex items-center gap-1.5">
              {post.categories.map(cat => (
                <span key={cat} className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>
      <MarkdownRenderer content={post.content} />
    </article>
  );
}
