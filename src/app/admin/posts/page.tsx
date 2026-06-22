import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { DeleteButton } from './DeleteButton';

export default function AdminPostsPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm"
        >
          <PlusCircle size={16} />
          New Post
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post.slug} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <Link href={`/admin/posts/${post.slug}`} className="flex-1 hover:text-accent transition-colors">
                <div className="font-medium">{post.title}</div>
                <div className="text-sm text-muted">{new Date(post.published).toLocaleDateString()}</div>
              </Link>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/posts/${post.slug}`}
                  className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-muted transition-colors"
                >
                  <Pencil size={16} />
                </Link>
                <DeleteButton slug={post.slug} title={post.title} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted">
          <p className="mb-4">No posts yet.</p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm"
          >
            <PlusCircle size={16} />
            Create your first post
          </Link>
        </div>
      )}
    </div>
  );
}
