import { notFound } from 'next/navigation';
import { getAllCategories, getCategoryPosts } from '@/lib/categories';
import { PostCard } from '@/components/PostCard';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map(cat => ({ slug: cat.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Category: ${slug}` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const posts = await getCategoryPosts(slug);
  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-2">{slug}</h1>
      <p className="text-sm text-muted mb-8">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
      <div>
        {posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
