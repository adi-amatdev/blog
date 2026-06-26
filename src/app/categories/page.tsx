import { getAllCategories } from '@/lib/categories';
import { CategoryTag } from '@/components/CategoryTag';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories',
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Categories</h1>
      {categories.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <CategoryTag key={cat.name} name={cat.name} count={cat.count} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-sm">No categories yet.</p>
      )}
    </div>
  );
}
