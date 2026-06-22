import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="block py-4 border-b border-border last:border-0">
        <h2 className="text-lg font-semibold group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        {post.description && (
          <p className="mt-1 text-sm text-muted line-clamp-2">{post.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs text-muted">
          <time dateTime={post.published}>{formatDate(post.published)}</time>
          {post.categories.length > 0 && (
            <div className="flex items-center gap-1.5">
              {post.categories.map(cat => (
                <span key={cat} className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-muted text-xs">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
