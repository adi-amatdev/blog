import { getAllCategories, paginate } from '@/lib/categories';
import { CategoryTag } from '@/components/CategoryTag';
import { Pagination } from '@/components/Pagination';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories',
};

const PER_PAGE = 24;

export default async function CategoriesPage(props: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageStr } = await props.searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  const categories = await getAllCategories();
  const { items, totalPages } = paginate(categories, page, PER_PAGE);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Categories</h1>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {items.map(cat => (
            <CategoryTag key={cat.name} name={cat.name} count={cat.count} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-sm">No categories yet.</p>
      )}
      <Pagination current={page} total={totalPages} base="/categories" />
    </div>
  );
}
