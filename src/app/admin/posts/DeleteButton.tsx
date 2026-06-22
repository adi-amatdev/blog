'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export function DeleteButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    const res = await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 text-xs border border-border rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted hover:text-red-500 transition-colors"
      title={`Delete ${title}`}
    >
      <Trash2 size={16} />
    </button>
  );
}
