import { getAllPosts } from '@/lib/posts';
import { getAllCategories } from '@/lib/categories';
import Link from 'next/link';
import { FileText, FolderOpen, PlusCircle } from 'lucide-react';

export default async function AdminDashboard() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm"
        >
          <PlusCircle size={16} />
          New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center gap-2 text-muted mb-1">
            <FileText size={16} />
            <span className="text-sm font-medium">Posts</span>
          </div>
          <p className="text-2xl font-bold">{posts.length}</p>
        </div>
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center gap-2 text-muted mb-1">
            <FolderOpen size={16} />
            <span className="text-sm font-medium">Categories</span>
          </div>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Recent Posts</h2>
      {posts.length > 0 ? (
        <div className="space-y-2">
          {posts.slice(0, 5).map(post => (
            <Link
              key={post.slug}
              href={`/admin/posts/${post.slug}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 border border-border rounded-lg hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
            >
              <span className="font-medium truncate">{post.title}</span>
              <span className="text-sm text-muted shrink-0">{new Date(post.published).toLocaleDateString()}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted text-sm">No posts yet. Create your first post!</p>
      )}
    </div>
  );
}
