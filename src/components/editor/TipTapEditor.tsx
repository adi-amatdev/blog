'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useCallback, useState, useRef } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Quote,
  List, ListOrdered, Heading1, Heading2, Heading3, Image, Link,
  Highlighter, Upload, X,
} from 'lucide-react';

const lowlight = createLowlight(common);

const MenuButton = ({ onClick, active, children, title }: {
  onClick: () => void; active?: boolean; children: React.ReactNode; title?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors ${
      active ? 'bg-stone-200 dark:bg-stone-700 text-accent' : 'text-muted'
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-border mx-1" />;

function Dialog({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md p-6 mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
  const [imageDialog, setImageDialog] = useState(false);
  const [linkDialog, setLinkDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Underline,
      Highlight,
      CodeBlockLowlight.configure({ lowlight }),
      ImageExtension.configure({ inline: false, allowBase64: true }),
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
  });

  const handleImageSubmit = useCallback(() => {
    if (!imageUrl || !editor) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
    setImageDialog(false);
  }, [imageUrl, editor]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }

    setUploading(false);
    setImageDialog(false);
    setImageUrl('');
    if (fileRef.current) fileRef.current.value = '';
  }, [editor]);

  const handleLinkSubmit = useCallback(() => {
    if (!editor) return;
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setLinkUrl('');
    setLinkDialog(false);
  }, [linkUrl, editor]);

  const openLinkDialog = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkDialog(true);
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-stone-50 dark:bg-stone-900">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={16} />
        </MenuButton>

        <Divider />

        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={16} />
        </MenuButton>

        <Divider />

        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
          <List size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
          <ListOrdered size={16} />
        </MenuButton>

        <Divider />

        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
          <Code size={16} />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
          <Highlighter size={16} />
        </MenuButton>

        <Divider />

        <MenuButton onClick={openLinkDialog} active={editor.isActive('link')} title="Link">
          <Link size={16} />
        </MenuButton>
        <MenuButton onClick={() => setImageDialog(true)} title="Image">
          <Image size={16} />
        </MenuButton>
      </div>
      <EditorContent editor={editor} />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      <Dialog open={imageDialog} onClose={() => { setImageDialog(false); setImageUrl(''); }} title="Insert Image">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
              <button
                onClick={handleImageSubmit}
                disabled={!imageUrl}
                className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm disabled:opacity-50"
              >
                Insert
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted">OR</span>
            <div className="flex-1 border-t border-border" />
          </div>
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:border-accent transition-colors text-sm text-muted hover:text-accent disabled:opacity-50"
            >
              <Upload size={16} />
              {uploading ? 'Uploading...' : 'Upload from computer'}
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog open={linkDialog} onClose={() => { setLinkDialog(false); setLinkUrl(''); }} title={editor.getAttributes('link').href ? 'Edit Link' : 'Insert Link'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="text"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end">
            {editor.getAttributes('link').href && (
              <button
                onClick={() => {
                  editor.chain().focus().extendMarkRange('link').unsetLink().run();
                  setLinkDialog(false);
                  setLinkUrl('');
                }}
                className="px-3 py-2 border border-border rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors text-sm"
              >
                Remove Link
              </button>
            )}
            <button
              onClick={handleLinkSubmit}
              className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm"
            >
              {editor.getAttributes('link').href ? 'Update' : 'Insert'}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
