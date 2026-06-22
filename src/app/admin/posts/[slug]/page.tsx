'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import TurndownService from 'turndown';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
});

async function markdownToHtml(md: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(md);
  return String(result);
}

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [html, setHtml] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { slug: postSlug } = await params;
      setSlug(postSlug);
      const res = await fetch(`/api/admin/posts/${postSlug}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description || '');
        setCategories((data.categories || []).join(', '));
        const htmlContent = await markdownToHtml(data.content);
        setHtml(htmlContent);
      }
      setLoading(false);
    }
    load();
  }, [params]);

  async function handleSave() {
    if (!title.trim() || !slug) return;
    setSaving(true);

    const markdown = turndown.turndown(html);
    const categoryList = categories.split(',').map(c => c.trim()).filter(Boolean);

    const res = await fetch(`/api/admin/posts/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        categories: categoryList,
        content: markdown,
      }),
    });

    if (res.ok) {
      router.refresh();
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!slug || !confirm('Delete this post?')) return;
    const res = await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/admin/posts');
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Edit Post</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent text-lg font-semibold"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Categories (comma-separated)</label>
            <input
              type="text"
              value={categories}
              onChange={e => setCategories(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
        </div>
      </div>

      <TipTapEditor
        content={html}
        onChange={setHtml}
        placeholder="Start writing..."
      />
    </div>
  );
}
