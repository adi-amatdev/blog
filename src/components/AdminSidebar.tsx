export function AdminSidebar() {
  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/posts', label: 'Posts' },
    { href: '/admin/pages/about', label: 'About Page' },
    { href: '/admin/pages/books', label: 'Books Page' },
  ];

  return (
    <aside className="w-56 shrink-0 border-r border-border p-6 hidden md:block">
      <nav className="flex flex-col gap-1">
        {links.map(link => (
          <a
            key={link.href}
            href={link.href}
            className="px-3 py-2 rounded-lg text-sm hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
