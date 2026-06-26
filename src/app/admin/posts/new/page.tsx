'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import TurndownService from 'turndown';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
});

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [html, setHtml] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);

    const markdown = turndown.turndown(html);
    const categoryList = categories.split(',').map(c => c.trim()).filter(Boolean);

    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        categories: categoryList,
        content: markdown,
      }),
    });

    if (res.ok) {
      const { slug } = await res.json();
      router.push(`/admin/posts/${slug}`);
    }
    setSaving(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">New Post</h1>
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent text-lg font-semibold"
            placeholder="Post title"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Categories (comma-separated)</label>
            <input
              type="text"
              value={categories}
              onChange={e => setCategories(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              placeholder="go, runtime"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              placeholder="Brief description"
            />
          </div>
        </div>
      </div>

      <TipTapEditor
        content=""
        onChange={setHtml}
        placeholder="Start writing your post..."
      />
    </div>
  );
}
