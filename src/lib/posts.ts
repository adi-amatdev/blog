import { prisma } from './db';
import { slugify } from './utils';

export interface PostMeta {
  slug: string;
  title: string;
  published: string;
  categories: string[];
  description?: string;
}

export interface Post extends PostMeta {
  content: string;
  bannerImage?: string;
}

function toMeta(post: {
  slug: string;
  title: string;
  published: Date;
  description: string | null;
  categories: { category: { name: string } }[];
}): PostMeta {
  return {
    slug: post.slug,
    title: post.title,
    published: post.published.toISOString().split('T')[0],
    categories: post.categories.map(pc => pc.category.name),
    description: post.description || undefined,
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { published: 'desc' },
      include: { categories: { include: { category: true } } },
    });
    return posts.map(toMeta);
  } catch {
    return [];
  }
}

export function paginatePosts<T>(items: T[], page: number, perPage: number): { items: T[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  return { items: items.slice(start, start + perPage), totalPages };
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await prisma.post.findMany({ select: { slug: true } });
    return posts.map(p => p.slug);
  } catch {
    return [];
  }
}

export async function getPostMeta(slug: string): Promise<PostMeta | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { categories: { include: { category: true } } },
    });
    if (!post) return null;
    return toMeta(post);
  } catch {
    return null;
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { categories: { include: { category: true } } },
    });
    if (!post) return null;
    return { ...toMeta(post), content: post.content, bannerImage: post.bannerImage || undefined };
  } catch {
    return null;
  }
}

export async function savePost(
  slug: string,
  frontmatter: { title: string; description?: string; published: string; categories: string[] },
  content: string,
  bannerImage?: string,
) {
  const { title, description, published, categories } = frontmatter;
  await prisma.$transaction(async (tx) => {
    await tx.post.upsert({
      where: { slug },
      create: {
        slug,
        title,
        description: description || '',
        content,
        published: new Date(published),
        bannerImage: bannerImage || null,
      },
      update: {
        title,
        description: description || '',
        content,
        published: new Date(published),
        bannerImage: bannerImage || undefined,
      },
    });

    await tx.postCategory.deleteMany({ where: { post: { slug } } });

    for (const name of categories) {
      const category = await tx.category.upsert({
        where: { name },
        create: { name },
        update: {},
      });
      await tx.postCategory.create({
        data: { postId: (await tx.post.findUniqueOrThrow({ where: { slug }, select: { id: true } })).id, categoryId: category.id },
      });
    }
  });
}

export async function deletePost(slug: string) {
  try {
    await prisma.post.delete({ where: { slug } });
  } catch {
    // post might not exist
  }
}

export function createPost(title: string, categories: string[]): string {
  return slugify(title);
}
