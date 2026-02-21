'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { SiteShell } from '@/components/layout/site-shell';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { userService } from '@/services/user.service';
import { commentService } from '@/services/comment.service';
import { animeService } from '@/services/anime.service';
import { contentService } from '@/services/content.service';
import type { AdminComment, Anime, User } from '@/types';

export default function AdminPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'dashboard';

  const { user, isLoading: isAuthLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [animeForm, setAnimeForm] = useState({
    title: '',
    description: '',
    iconUrl: '',
    bannerUrl: '',
    galleryUrls: '',
  });

  const [seasonForm, setSeasonForm] = useState({
    animeId: '',
    seasonNumber: '',
    title: '',
    imageUrl: '',
  });

  const [episodeForm, setEpisodeForm] = useState({
    seasonId: '',
    episodeNumber: '',
    title: '',
    description: '',
    thumbnailUrl: '',
    links: 'Crunchyroll|https://www.crunchyroll.com|streaming',
  });

  const isAdmin = user?.role === 'ADMIN';

  const loadUsers = async () => {
    const data = await userService.list();
    setUsers(data);
  };

  const loadComments = async () => {
    const data = await commentService.getRecent();
    setComments(data);
  };

  const loadAnimes = async () => {
    const data = await animeService.list();
    setAnimes(data);
  };

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void Promise.all([loadUsers(), loadComments(), loadAnimes()]);
  }, [isAdmin]);

  const dashboardStats = useMemo(
    () => [
      { label: 'Usuarios', value: users.length },
      { label: 'Comentarios recientes', value: comments.length },
      { label: 'Animes', value: animes.length },
    ],
    [animes.length, comments.length, users.length],
  );

  if (isAuthLoading) {
    return (
      <SiteShell>
        <p className="text-slate-400">Cargando panel...</p>
      </SiteShell>
    );
  }

  if (!isAdmin) {
    return (
      <SiteShell>
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
          Acceso restringido: solo administradores.
        </div>
      </SiteShell>
    );
  }

  const submitAnime = async (event: React.FormEvent) => {
    event.preventDefault();

    const galleryUrls = animeForm.galleryUrls
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await animeService.create({
        title: animeForm.title,
        description: animeForm.description,
        iconUrl: animeForm.iconUrl,
        bannerUrl: animeForm.bannerUrl || undefined,
        galleryUrls,
      });

      setStatusMessage('Anime creado correctamente.');
      setAnimeForm({ title: '', description: '', iconUrl: '', bannerUrl: '', galleryUrls: '' });
      await loadAnimes();
    } catch {
      setStatusMessage('No se pudo crear el anime.');
    }
  };

  const submitSeason = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await contentService.createSeason({
        animeId: Number(seasonForm.animeId),
        seasonNumber: Number(seasonForm.seasonNumber),
        title: seasonForm.title || undefined,
        imageUrl: seasonForm.imageUrl,
      });

      setStatusMessage('Temporada creada correctamente.');
      setSeasonForm({ animeId: '', seasonNumber: '', title: '', imageUrl: '' });
      await loadAnimes();
    } catch {
      setStatusMessage('No se pudo crear la temporada.');
    }
  };

  const submitEpisode = async (event: React.FormEvent) => {
    event.preventDefault();

    const links = episodeForm.links
      .split(',')
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((entry) => {
        const [label, url, type] = entry.split('|').map((value) => value.trim());
        return {
          label: label || 'Enlace',
          url: url || 'https://example.com',
          type: type || 'streaming',
        };
      });

    try {
      await contentService.createEpisode({
        seasonId: Number(episodeForm.seasonId),
        episodeNumber: Number(episodeForm.episodeNumber),
        title: episodeForm.title,
        description: episodeForm.description,
        thumbnailUrl: episodeForm.thumbnailUrl || undefined,
        links,
      });

      setStatusMessage('Episodio creado correctamente.');
      setEpisodeForm({
        seasonId: '',
        episodeNumber: '',
        title: '',
        description: '',
        thumbnailUrl: '',
        links: 'Crunchyroll|https://www.crunchyroll.com|streaming',
      });
    } catch {
      setStatusMessage('No se pudo crear el episodio.');
    }
  };

  return (
    <SiteShell>
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />

        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <h1 className="text-3xl font-bold text-white">Panel de control</h1>
          {statusMessage && <p className="text-sm text-cyan-300">{statusMessage}</p>}

          {tab === 'dashboard' && (
            <div className="grid gap-3 sm:grid-cols-3">
              {dashboardStats.map((item) => (
                <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
                </article>
              ))}
            </div>
          )}

          {tab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400">
                    <th className="py-2">Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item.id} className="border-t border-slate-800">
                      <td className="py-2">{item.name} {item.lastName}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td>{item.status}</td>
                      <td className="space-x-2">
                        <Button
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                          onClick={async () => {
                            await userService.updateStatus(
                              item.id,
                              item.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE',
                            );
                            await loadUsers();
                          }}
                        >
                          {item.status === 'ACTIVE' ? 'Banear' : 'Reactivar'}
                        </Button>
                        <Button
                          variant="danger"
                          className="px-2 py-1 text-xs"
                          onClick={async () => {
                            await userService.remove(item.id);
                            await loadUsers();
                          }}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'comments' && (
            <div className="space-y-2">
              {comments.map((comment) => (
                <article key={comment.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-xs text-slate-500">
                    {comment.user.name} {comment.user.lastName} ({comment.user.email})
                  </p>
                  <p className="my-2 text-sm text-slate-200">{comment.content}</p>
                  <p className="text-xs text-slate-500">
                    {comment.anime ? `Anime: ${comment.anime.title}` : `Episodio: ${comment.episode?.title ?? ''}`}
                  </p>
                  <Button
                    variant="danger"
                    className="mt-2 px-2 py-1 text-xs"
                    onClick={async () => {
                      await commentService.remove(comment.id);
                      await loadComments();
                    }}
                  >
                    Eliminar comentario
                  </Button>
                </article>
              ))}
            </div>
          )}

          {tab === 'content' && (
            <div className="space-y-6">
              <form className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4" onSubmit={submitAnime}>
                <h2 className="text-lg font-semibold text-white">Crear anime</h2>
                <Input placeholder="Titulo" value={animeForm.title} onChange={(event) => setAnimeForm((prev) => ({ ...prev, title: event.target.value }))} />
                <Textarea placeholder="Sinopsis" value={animeForm.description} onChange={(event) => setAnimeForm((prev) => ({ ...prev, description: event.target.value }))} />
                <Input placeholder="URL icono" value={animeForm.iconUrl} onChange={(event) => setAnimeForm((prev) => ({ ...prev, iconUrl: event.target.value }))} />
                <Input placeholder="URL banner" value={animeForm.bannerUrl} onChange={(event) => setAnimeForm((prev) => ({ ...prev, bannerUrl: event.target.value }))} />
                <Textarea placeholder="Galeria: url1, url2, url3" value={animeForm.galleryUrls} onChange={(event) => setAnimeForm((prev) => ({ ...prev, galleryUrls: event.target.value }))} />
                <Button type="submit">Guardar anime</Button>
              </form>

              <form className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4" onSubmit={submitSeason}>
                <h2 className="text-lg font-semibold text-white">Crear temporada</h2>
                <Input placeholder="Anime ID" value={seasonForm.animeId} onChange={(event) => setSeasonForm((prev) => ({ ...prev, animeId: event.target.value }))} />
                <Input placeholder="Numero de temporada" value={seasonForm.seasonNumber} onChange={(event) => setSeasonForm((prev) => ({ ...prev, seasonNumber: event.target.value }))} />
                <Input placeholder="Titulo temporada" value={seasonForm.title} onChange={(event) => setSeasonForm((prev) => ({ ...prev, title: event.target.value }))} />
                <Input placeholder="URL portada temporada" value={seasonForm.imageUrl} onChange={(event) => setSeasonForm((prev) => ({ ...prev, imageUrl: event.target.value }))} />
                <Button type="submit" variant="secondary">Guardar temporada</Button>
              </form>

              <form className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4" onSubmit={submitEpisode}>
                <h2 className="text-lg font-semibold text-white">Crear episodio</h2>
                <Input placeholder="Season ID" value={episodeForm.seasonId} onChange={(event) => setEpisodeForm((prev) => ({ ...prev, seasonId: event.target.value }))} />
                <Input placeholder="Numero episodio" value={episodeForm.episodeNumber} onChange={(event) => setEpisodeForm((prev) => ({ ...prev, episodeNumber: event.target.value }))} />
                <Input placeholder="Titulo" value={episodeForm.title} onChange={(event) => setEpisodeForm((prev) => ({ ...prev, title: event.target.value }))} />
                <Textarea placeholder="Descripcion" value={episodeForm.description} onChange={(event) => setEpisodeForm((prev) => ({ ...prev, description: event.target.value }))} />
                <Input placeholder="Thumbnail URL" value={episodeForm.thumbnailUrl} onChange={(event) => setEpisodeForm((prev) => ({ ...prev, thumbnailUrl: event.target.value }))} />
                <Textarea placeholder="Links: label|url|type, label2|url2|type2" value={episodeForm.links} onChange={(event) => setEpisodeForm((prev) => ({ ...prev, links: event.target.value }))} />
                <Button type="submit" variant="secondary">Guardar episodio</Button>
              </form>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <h2 className="mb-3 text-lg font-semibold text-white">Animes existentes</h2>
                <div className="space-y-2">
                  {animes.map((anime) => (
                    <div key={anime.id} className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-100">#{anime.id} {anime.title}</p>
                        <p className="text-xs text-slate-500">{anime.seasons.length} temporadas</p>
                      </div>
                      <Button
                        variant="danger"
                        className="px-2 py-1 text-xs"
                        onClick={async () => {
                          await animeService.remove(anime.id);
                          await loadAnimes();
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </SiteShell>
  );
}
