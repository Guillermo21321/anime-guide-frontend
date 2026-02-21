'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteShell } from '@/components/layout/site-shell';
import { episodeService } from '@/services/episode.service';
import { VideoPlayer } from '@/components/features/video-player';
import { CommentSection } from '@/components/features/comment-section';
import type { Episode } from '@/types';

interface EpisodeView extends Episode {
  season: {
    anime: {
      id: number;
      title: string;
    };
    seasonNumber: number;
  };
}

export default function WatchEpisodePage() {
  const params = useParams<{ id: string }>();
  const episodeId = Number(params.id);
  const [episode, setEpisode] = useState<EpisodeView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = (await episodeService.detail(episodeId)) as EpisodeView;
        setEpisode(data);
      } catch {
        setError('No se pudo cargar el capitulo.');
      }
    };

    if (Number.isFinite(episodeId)) {
      void fetch();
    }
  }, [episodeId]);

  if (error) {
    return (
      <SiteShell>
        <p className="text-red-300">{error}</p>
      </SiteShell>
    );
  }

  if (!episode) {
    return (
      <SiteShell>
        <p className="text-slate-400">Cargando capitulo...</p>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="space-y-8">
        <section className="space-y-2">
          <Link href={`/anime/${episode.season.anime.id}`} className="text-sm text-cyan-300">
            {episode.season.anime.title}
          </Link>
          <h1 className="text-4xl font-bold text-white">
            Episodio {episode.episodeNumber}: {episode.title}
          </h1>
          <p className="text-slate-300">{episode.description}</p>
        </section>

        <VideoPlayer links={episode.links} />

        <CommentSection episodeId={episode.id} title="Comentarios del capitulo" />
      </div>
    </SiteShell>
  );
}
