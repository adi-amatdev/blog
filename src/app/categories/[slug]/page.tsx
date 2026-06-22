import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import { getAllCategories } from '@/lib/categories';
import { PostCard } from '@/components/PostCard';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map(cat => ({ slug: cat.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Category: ${slug}` };
}

export default async function CategoryPage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const categories = getAllCategories();
  const category = categories.find(c => c.name === slug);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-2">{slug}</h1>
      <p className="text-sm text-muted mb-8">{category.count} post{category.count !== 1 ? 's' : ''}</p>
      <div>
        {category.posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
