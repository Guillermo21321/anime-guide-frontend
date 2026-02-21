'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { commentService } from '@/services/comment.service';
import { formatDate, getInitials } from '@/lib/utils';
import { commentSchema } from '@/lib/validations';
import type { Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentSectionProps {
  animeId?: number;
  episodeId?: number;
  title?: string;
}

export function CommentSection({ animeId, episodeId, title = 'Comentarios' }: CommentSectionProps) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      const data = animeId
        ? await commentService.listByAnime(animeId)
        : await commentService.listByEpisode(episodeId ?? 0);
      setComments(data);
    } catch {
      setError('No se pudieron cargar los comentarios.');
    }
  };

  useEffect(() => {
    void fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, episodeId]);

  const submit = async () => {
    const parsed = commentSchema.safeParse({ content });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Comentario invalido');
      return;
    }

    if (!isAuthenticated) {
      setError('Debes iniciar sesion para comentar.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await commentService.create({
        content: parsed.data.content,
        animeId,
        episodeId,
      });
      setContent('');
      await fetchComments();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Error al enviar comentario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h2 className="mb-4 text-2xl font-semibold text-white">{title}</h2>

      <div className="mb-6 space-y-3">
        <Textarea
          placeholder="Escribe tu comentario..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button onClick={submit} disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Publicar comentario'}
        </Button>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-cyan-300">
                  {getInitials(comment.user.name, comment.user.lastName)}
                </span>
                <p className="text-sm font-semibold text-slate-100">
                  {comment.user.name} {comment.user.lastName}
                </p>
              </div>
              <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-slate-300">{comment.content}</p>
          </article>
        ))}

        {comments.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-700 p-4 text-sm text-slate-500">
            Aun no hay comentarios.
          </p>
        )}
      </div>
    </section>
  );
}
