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

export default function EditAboutPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/pages/about');
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
        const htmlContent = await markdownToHtml(data.content);
        setHtml(htmlContent);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const markdown = turndown.turndown(html);

    const res = await fetch('/api/admin/pages/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: markdown }),
    });

    if (res.ok) {
      setContent(markdown);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-12"><p className="text-muted">Loading...</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Edit About Page</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      <TipTapEditor
        content={html}
        onChange={setHtml}
        placeholder="Write about yourself..."
      />
    </div>
  );
}
