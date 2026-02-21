import Image from 'next/image';
import Link from 'next/link';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import type { Anime } from '@/types';
import { Badge } from '@/components/ui/badge';

export function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 transition hover:border-cyan-400/60">
      <Link href={`/anime/${anime.id}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={anime.iconUrl}
            alt={anime.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3">
            <Badge>Anime</Badge>
          </div>
        </div>

        <div className="space-y-3 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-white">{anime.title}</h3>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="size-3" />
              {anime.likes}
            </span>
            <span className="inline-flex items-center gap-1">
              <ThumbsDown className="size-3" />
              {anime.dislikes}
            </span>
            <span>{anime.seasons.length} temporadas</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
