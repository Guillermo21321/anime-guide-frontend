'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, PlayCircle } from 'lucide-react';
import type { EpisodeLink } from '@/types';
import { Button } from '@/components/ui/button';

export function VideoPlayer({ links }: { links: EpisodeLink[] }) {
  const [activeLink, setActiveLink] = useState<EpisodeLink | null>(links[0] ?? null);

  const isEmbeddable = useMemo(() => {
    if (!activeLink) {
      return false;
    }

    return activeLink.url.includes('youtube.com/embed');
  }, [activeLink]);

  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        {isEmbeddable && activeLink ? (
          <iframe
            title={activeLink.label}
            src={activeLink.url}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-slate-400">
              <PlayCircle className="mx-auto mb-2 size-8 text-cyan-400" />
              <p>Selecciona un enlace externo para reproducir</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <div key={link.id} className="flex items-center gap-2">
            <Button
              variant={activeLink?.id === link.id ? 'primary' : 'secondary'}
              onClick={() => setActiveLink(link)}
            >
              {link.label}
            </Button>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200"
            >
              abrir
              <ExternalLink className="size-3" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
