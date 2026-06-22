import { readFileSafe, getContentPath } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
};

export default function AboutPage() {
  const filePath = getContentPath('pages', 'about.md');
  const content = readFileSafe(filePath) || '# About\n\nNothing here yet.';

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <MarkdownRenderer content={content} />
    </div>
  );
}
