'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface Category {
  name: string;
  count: number;
}

export function AdminCategoryList({ categories }: { categories: Category[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  async function handleDelete(name: string) {
    setDeleting(name);
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(name)}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete category');
      }
    } catch {
      alert('Failed to delete category');
    }
    setDeleting(null);
    setConfirm(null);
  }

  return (
    <div className="space-y-2">
      {categories.length === 0 && (
        <p className="text-muted text-sm">No categories yet.</p>
      )}
      {categories.map(cat => (
        <div
          key={cat.name}
          className="flex items-center justify-between gap-2 p-3 border border-border rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{cat.name}</span>
            <span className="text-xs text-muted">({cat.count} post{cat.count !== 1 ? 's' : ''})</span>
          </div>
          {confirm === cat.name ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle size={12} />
                Delete {cat.count} posts?
              </span>
              <button
                onClick={() => handleDelete(cat.name)}
                disabled={deleting === cat.name}
                className="px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting === cat.name ? 'Deleting...' : 'Confirm'}
              </button>
              <button
                onClick={() => setConfirm(null)}
                className="px-2 py-1 text-xs rounded border border-border hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirm(cat.name)}
              className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Delete category and all posts"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
