import { getAllPosts, PostMeta } from './posts';

export interface CategoryInfo {
  name: string;
  count: number;
  posts: PostMeta[];
}

export function getAllCategories(): CategoryInfo[] {
  const posts = getAllPosts();
  const categoryMap = new Map<string, PostMeta[]>();

  for (const post of posts) {
    for (const cat of post.categories) {
      const existing = categoryMap.get(cat) || [];
      existing.push(post);
      categoryMap.set(cat, existing);
    }
  }

  return Array.from(categoryMap.entries())
    .map(([name, posts]) => ({ name, count: posts.length, posts }))
    .sort((a, b) => b.count - a.count);
}

export function getCategoryPosts(slug: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(p => p.categories.includes(slug));
}
