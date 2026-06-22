import { SITE_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-4xl px-6 py-8 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
