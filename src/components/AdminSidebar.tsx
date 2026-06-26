'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/posts', label: 'Posts' },
    { href: '/admin/pages/about', label: 'About Page' },
    { href: '/admin/pages/books', label: 'Books Page' },
  ];

  return (
    <>
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-accent text-white rounded-full shadow-lg hover:bg-accent-hover transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle admin menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`w-56 shrink-0 border-r border-border p-6 ${mobileOpen ? 'fixed inset-y-0 left-0 z-50 bg-background' : 'hidden'} md:block`}>
        <nav className="flex flex-col gap-1">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg text-sm hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
