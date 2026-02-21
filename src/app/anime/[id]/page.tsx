'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { SiteShell } from '@/components/layout/site-shell';
import { animeService } from '@/services/anime.service';
import type { Anime, VoteValue } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SeasonAccordion } from '@/components/features/season-accordion';
import { CommentSection } from '@/components/features/comment-section';

export default function AnimeDetailPage() {
  const params = useParams<{ id: string }>();
  const animeId = Number(params.id);

  const [anime, setAnime] = useState<Anime | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnime = async () => {
    try {
      const data = await animeService.detail(animeId);
      setAnime(data);
    } catch {
      setError('No se pudo cargar el anime.');
    }
  };

  useEffect(() => {
    if (!Number.isFinite(animeId)) {
      return;
    }

    void fetchAnime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId]);

  const vote = async (value: VoteValue) => {
    if (!anime) {
      return;
    }

    try {
      const result = await animeService.vote(anime.id, value);
      setAnime((prev) =>
        prev
          ? {
              ...prev,
              likes: result.likes,
              dislikes: result.dislikes,
              currentUserVote: value,
            }
          : prev,
      );
    } catch {
      setError('No se pudo registrar el voto. Inicia sesion para votar.');
    }
  };

  if (error) {
    return (
      <SiteShell>
        <p className="text-red-300">{error}</p>
      </SiteShell>
    );
  }

  if (!anime) {
    return (
      <SiteShell>
        <p className="text-slate-400">Cargando anime...</p>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="space-y-8">
        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70">
          <div className="relative">
            <div className="absolute inset-0 opacity-20">
              <Image
                src={anime.bannerUrl ?? anime.iconUrl}
                alt={anime.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="relative grid gap-5 p-5 md:grid-cols-[180px_1fr]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-slate-700">
                <Image src={anime.iconUrl} alt={anime.title} fill className="object-cover" />
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-white">{anime.title}</h1>
                <p className="max-w-4xl text-slate-200">{anime.description}</p>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge>TV Anime</Badge>
                  <Badge>{anime.seasons.length} temporadas</Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={anime.currentUserVote === 'LIKE' ? 'primary' : 'secondary'}
                    onClick={() => vote('LIKE')}
                    className="gap-2"
                  >
                    <ThumbsUp className="size-4" /> {anime.likes}
                  </Button>

                  <Button
                    variant={anime.currentUserVote === 'DISLIKE' ? 'danger' : 'secondary'}
                    onClick={() => vote('DISLIKE')}
                    className="gap-2"
                  >
                    <ThumbsDown className="size-4" /> {anime.dislikes}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Galeria</h2>
          <div className="columns-2 gap-4 space-y-4 md:columns-3">
            {anime.gallery.map((image) => (
              <figure
                key={image.id}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70"
              >
                <Image
                  src={image.url}
                  alt="Fragmento"
                  width={800}
                  height={600}
                  className="h-auto w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Temporadas y capitulos</h2>
          <SeasonAccordion seasons={anime.seasons} />
        </section>

        <CommentSection animeId={anime.id} title="Comentarios del anime" />
      </div>
    </SiteShell>
  );
}
