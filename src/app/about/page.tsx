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
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      {profileImage && (
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-2 ring-accent ring-offset-4 ring-offset-background shadow-lg">
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      )}
      <MarkdownRenderer content={content} />
    </div>
  );
}
