import { prisma } from '@/lib/db';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
};

export default async function AboutPage() {
  const [contentSetting, imageSetting] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: 'page_about' } }),
    prisma.siteSetting.findUnique({ where: { key: 'page_profile_image' } }),
  ]);

  const content = contentSetting?.value || '# About\n\nNothing here yet.';
  const profileImage = imageSetting?.value || '';

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-12">
      {profileImage && (
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-accent ring-offset-2 ring-offset-background shadow-lg">
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="mt-4 text-center text-sm text-muted leading-relaxed max-w-xs">
            Building things .   Breaking them<br />
          Learning why they work
          </div>
        </div>
      )}
      <MarkdownRenderer content={content} />
    </div>
  );
}
