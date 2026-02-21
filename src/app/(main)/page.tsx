'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightCircle } from 'lucide-react';
import { AnimeCard } from '@/components/features/anime-card';
import { Badge } from '@/components/ui/badge';
import { animeService } from '@/services/anime.service';
import { useFetch } from '@/hooks/useFetch';

export default function HomePage() {
  const { data: animes, isLoading, error } = useFetch(() => animeService.list(), []);

  if (isLoading) {
    return <p className="py-10 text-slate-400">Cargando catalogo...</p>;
  }

  if (error || !animes || animes.length === 0) {
    return <p className="py-10 text-red-300">No se pudo cargar contenido del catalogo.</p>;
  }

  const featured = animes[0];
  const recent = animes.slice(0, 8);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="absolute inset-0 opacity-25">
          <Image
            src={featured.bannerUrl ?? featured.iconUrl}
            alt={featured.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="relative max-w-2xl space-y-4">
          <Badge className="border-cyan-400/30 text-cyan-300">Destacado</Badge>
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">{featured.title}</h1>
          <p className="line-clamp-4 text-slate-200">{featured.description}</p>

          <Link
            href={`/anime/${featured.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Ver anime
            <ArrowRightCircle className="size-4" />
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Episodios y series recientes</h2>
          <Link href="/catalogo" className="text-sm font-semibold text-cyan-300">
            Ver catalogo completo
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {recent.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>
    </div>
  );
}
