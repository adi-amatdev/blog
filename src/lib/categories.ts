import { prisma } from './db';
import type { PostMeta } from './posts';

export interface CategoryInfo {
  name: string;
  count: number;
  posts: PostMeta[];
}

export async function getAllCategories(): Promise<CategoryInfo[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        posts: {
          include: { post: { include: { categories: { include: { category: true } } } } },
          orderBy: { post: { published: 'desc' } },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories.map(cat => ({
      name: cat.name,
      count: cat.posts.length,
      posts: cat.posts.map(pc => ({
        slug: pc.post.slug,
        title: pc.post.title,
        published: pc.post.published.toISOString().split('T')[0],
        categories: pc.post.categories.map(c => c.category.name),
        description: pc.post.description || undefined,
      })),
    }));
  } catch {
    return [];
  }
}

export async function getCategoryPosts(slug: string): Promise<PostMeta[]> {
  const categories = await getAllCategories();
  const cat = categories.find(c => c.name === slug);
  return cat?.posts || [];
}

export function paginate<T>(items: T[], page: number, perPage: number): { items: T[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  return { items: items.slice(start, start + perPage), totalPages };
}
