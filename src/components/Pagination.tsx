'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  current: number;
  total: number;
  base: string;
}

export function Pagination({ current, total, base }: Props) {
  if (total <= 1) return null;

  function href(page: number) {
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}page=${page}`;
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-10">
      {current > 1 ? (
        <Link
          href={href(current - 1)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
        >
          <ChevronLeft size={14} />
          Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-border opacity-30 cursor-not-allowed">
          <ChevronLeft size={14} />
          Prev
        </span>
      )}
      <div className="flex items-center gap-1">
        {Array.from({ length: total }, (_, i) => i + 1).map(page => (
          <Link
            key={page}
            href={href(page)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              page === current
                ? 'bg-accent text-white'
                : 'border border-border hover:bg-stone-50 dark:hover:bg-stone-900'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>
      {current < total ? (
        <Link
          href={href(current + 1)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
        >
          Next
          <ChevronRight size={14} />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-border opacity-30 cursor-not-allowed">
          Next
          <ChevronRight size={14} />
        </span>
      )}
    </nav>
  );
}
