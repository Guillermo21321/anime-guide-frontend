'use client';

import Link from 'next/link';
import { Search, UserRound, LogOut, LayoutGrid } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="text-3xl font-black tracking-tight text-white">
          Anime<span className="text-cyan-400">Guide</span>
        </Link>

        <div className="hidden flex-1 md:flex">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <Input placeholder="Buscar anime..." className="pl-9" />
          </div>
        </div>

        <nav className="ml-auto flex items-center gap-2">
          <Link href="/catalogo" className="hidden rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 sm:block">
            Catalogo
          </Link>

          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="hidden rounded-lg px-3 py-2 text-sm text-cyan-300 hover:bg-slate-800 sm:flex sm:items-center sm:gap-2">
              <LayoutGrid className="size-4" />
              Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-slate-400 sm:block">
                {user.name} {user.lastName}
              </span>
              <Button variant="ghost" className="px-3" onClick={logout}>
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 hover:border-cyan-400/60">
              <UserRound className="size-4" />
              Iniciar sesion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
