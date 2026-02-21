'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimeCard } from '@/components/features/anime-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { animeService } from '@/services/anime.service';
import type { Anime } from '@/types';

const letters = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

export default function CatalogoPage() {
  const [search, setSearch] = useState('');
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await animeService.list(search || undefined);
        setAnimes(data);
      } catch {
        setError('No se pudo obtener el catalogo.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetch();
  }, [search]);

  const totalLabel = useMemo(() => `${animes.length} resultados`, [animes.length]);

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h1 className="text-4xl font-bold text-white">Catalogo de animes</h1>

        <div className="flex flex-wrap gap-2">
          {letters.map((letter) => (
            <button
              key={letter}
              type="button"
              className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs text-slate-300 hover:border-cyan-400/50"
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input
            placeholder="Buscar por titulo..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button variant="secondary">Filtrar</Button>
        </div>

        <p className="text-sm text-slate-400">{totalLabel}</p>
      </section>

      {isLoading && <p className="text-slate-400">Cargando catalogo...</p>}
      {error && <p className="text-red-300">{error}</p>}

      {!isLoading && !error && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}
