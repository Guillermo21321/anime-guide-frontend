import { SiteShell } from '@/components/layout/site-shell';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
