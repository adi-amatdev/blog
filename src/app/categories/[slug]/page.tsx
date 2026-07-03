import { notFound } from 'next/navigation';
import { getAllCategories, getCategoryPosts, paginate } from '@/lib/categories';
import { PostCard } from '@/components/PostCard';
import { Pagination } from '@/components/Pagination';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const PER_PAGE = 10;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map(cat => ({ slug: cat.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Category: ${slug}` };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  const posts = await getCategoryPosts(slug);
  if (posts.length === 0) notFound();

  const { items, totalPages } = paginate(posts, page, PER_PAGE);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-2">{slug}</h1>
      <p className="text-sm text-muted mb-8">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
      <div>
        {items.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination current={page} total={totalPages} base={`/categories/${slug}`} />
    </div>
  );
}
