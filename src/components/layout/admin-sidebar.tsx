import Link from 'next/link';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin?tab=users', label: 'Usuarios' },
  { href: '/admin?tab=comments', label: 'Comentarios' },
  { href: '/admin?tab=content', label: 'Contenido' },
];

export function AdminSidebar() {
  return (
    <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Panel Admin
      </h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
