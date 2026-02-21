'use client';

import { Navbar } from './navbar';
import { Footer } from './footer';

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.12),_transparent_35%),_#020617] text-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
}
