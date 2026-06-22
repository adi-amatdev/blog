import Link from 'next/link';

export function CategoryTag({ name, count }: { name: string; count?: number }) {
  return (
    <Link
      href={`/categories/${name}`}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-200 dark:bg-stone-800 text-sm text-foreground hover:bg-accent hover:text-white dark:hover:bg-accent transition-colors"
    >
      {name}
      {count !== undefined && (
        <span className="text-xs text-muted">({count})</span>
      )}
    </Link>
  );
}
