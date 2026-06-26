import { getAllPosts } from '@/lib/posts';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import { PostCard } from '@/components/PostCard';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-16">
      <section className="mb-10 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{SITE_NAME}</h1>
        <p className="text-muted leading-relaxed">{SITE_DESCRIPTION}</p>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-6">Recent Posts</h2>
        {posts.length > 0 ? (
          <div>
            {posts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm">No posts yet. Check back soon.</p>
        )}
      </section>
    </div>
  );
}
