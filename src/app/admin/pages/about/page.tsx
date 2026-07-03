'use client';

import { useState, useEffect, useRef } from 'react';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { ImageCropModal } from '@/components/ImageCropModal';
import { compressToWebp } from '@/lib/image';
import TurndownService from 'turndown';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { Upload, Trash2, Loader2 } from 'lucide-react';

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
  const [content, setContent] = useState('');
  const [html, setHtml] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [deletingImage, setDeletingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const [aboutRes, imgRes] = await Promise.all([
        fetch('/api/admin/pages/about'),
        fetch('/api/admin/pages/profile_image'),
      ]);
      if (aboutRes.ok) {
        const data = await aboutRes.json();
        setContent(data.content);
        const htmlContent = await markdownToHtml(data.content);
        setHtml(htmlContent);
      }
      if (imgRes.ok) {
        const data = await imgRes.json();
        setProfileImage(data.content || '');
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const markdown = turndown.turndown(html);

    await Promise.all([
      fetch('/api/admin/pages/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdown }),
      }),
      fetch('/api/admin/pages/profile_image', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: profileImage }),
      }),
    ]);

    setContent(markdown);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    const compressed = await compressToWebp(file, 800, 0.85);
    const formData = new FormData();
    formData.append('file', compressed, 'profile.webp');

    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      setProfileImage(data.url);
    }
    setUploadingImage(false);
  }

  async function handleCrop(blob: Blob) {
    const compressed = await compressToWebp(blob, 800, 0.85);
    const formData = new FormData();
    formData.append('file', compressed, 'profile.webp');

    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      setProfileImage(data.url);
    }
    setCropSrc(null);
  }

  async function handleDeleteImage() {
    setDeletingImage(true);
    setProfileImage('');
    await fetch('/api/admin/pages/profile_image', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: '' }),
    });
    setDeletingImage(false);
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-12"><p className="text-muted">Loading...</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Edit About Page</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      <div className="mb-10 p-4 sm:p-6 border border-border rounded-lg">
        <h2 className="text-sm font-semibold mb-3">Profile Image</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {profileImage && (
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-accent ring-offset-2 ring-offset-background flex-shrink-0 group">
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              <button
                onClick={handleDeleteImage}
                disabled={deletingImage}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                title="Remove profile image"
              >
                {deletingImage ? (
                  <Loader2 size={18} className="text-white animate-spin" />
                ) : (
                  <Trash2 size={18} className="text-white" />
                )}
              </button>
            </div>
          )}
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors text-sm">
                <Upload size={16} />
                {uploadingImage ? 'Compressing...' : 'Upload image'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <input
              type="text"
              value={profileImage}
              onChange={e => setProfileImage(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              placeholder="Or paste image URL..."
            />
          </div>
        </div>
      </div>

      <TipTapEditor
        content={html}
        onChange={setHtml}
        placeholder="Write about yourself..."
      />

      {cropSrc && (
        <ImageCropModal
          src={cropSrc}
          onCrop={handleCrop}
          onClose={() => {
            setCropSrc(null);
            URL.revokeObjectURL(cropSrc);
          }}
        />
      )}
    </div>
  );
}
