'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { Season } from '@/types';

export function SeasonAccordion({ seasons }: { seasons: Season[] }) {
  const [openSeasonId, setOpenSeasonId] = useState<number | null>(seasons[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {seasons.map((season) => {
        const isOpen = openSeasonId === season.id;

        return (
          <section key={season.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <button
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
              onClick={() => setOpenSeasonId((value) => (value === season.id ? null : season.id))}
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-slate-700">
                  <Image src={season.imageUrl} alt={`Temporada ${season.seasonNumber}`} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">
                    Temporada {season.seasonNumber} {season.title ? `- ${season.title}` : ''}
                  </h3>
                  <p className="text-xs text-slate-400">{season.episodes.length} episodios</p>
                </div>
              </div>
              <ChevronDown
                className={`size-4 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && (
              <div className="border-t border-slate-800 px-4 py-3">
                <div className="space-y-2">
                  {season.episodes.map((episode) => (
                    <article
                      key={episode.id}
                      className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 md:grid-cols-[1fr_auto]"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-100">
                          Episodio {episode.episodeNumber}: {episode.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">{episode.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/watch/${episode.id}`}
                          className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300"
                        >
                          Ver capitulo
                        </Link>
                        {episode.links.slice(0, 1).map((link) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:border-cyan-400/60"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
