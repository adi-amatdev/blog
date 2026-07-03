import { getAllPosts, paginatePosts } from '@/lib/posts';
import { SITE_DESCRIPTION } from '@/lib/constants';
import { PostCard } from '@/components/PostCard';
import { Pagination } from '@/components/Pagination';
import { Pencil } from 'lucide-react';

const PER_PAGE = 10;

export default async function Home(props: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageStr } = await props.searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  const posts = await getAllPosts();
  const { items, totalPages } = paginatePosts(posts, page, PER_PAGE);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-16">
      <section className="mb-10 sm:mb-12 animate-fade-up">
        <div className="flex items-center gap-2 text-accent mb-2">
          <Pencil size={16} />
          <span className="text-xs font-semibold uppercase tracking-widest">Journal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">My Engineering Diary</h1>
        <p className="text-muted leading-relaxed">{SITE_DESCRIPTION}</p>
      </section>

      <section className="animate-fade-up delay-200">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-6">Entries</h2>
        {items.length > 0 ? (
          <div>
            {items.map((post, i) => (
              <div key={post.slug} className="animate-fade-in" style={{ animationDelay: `${300 + i * 80}ms` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm">No entries yet. Check back soon.</p>
        )}
        <Pagination current={page} total={totalPages} base="/" />
      </section>
    </div>
  );
}
