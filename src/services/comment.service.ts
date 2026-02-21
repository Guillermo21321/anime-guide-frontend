import { AdminComment, ApiMessage, Comment } from '@/types';
import { api } from './api';

export const commentService = {
  async listByAnime(animeId: number): Promise<Comment[]> {
    const response = await api.get<Comment[]>(`/comments/anime/${animeId}`);
    return response.data;
  },

  async listByEpisode(episodeId: number): Promise<Comment[]> {
    const response = await api.get<Comment[]>(`/comments/episode/${episodeId}`);
    return response.data;
  },

  async create(payload: { content: string; animeId?: number; episodeId?: number }): Promise<Comment> {
    const response = await api.post<Comment>('/comments', payload);
    return response.data;
  },

  async getRecent(): Promise<AdminComment[]> {
    const response = await api.get<AdminComment[]>('/comments/admin/recent');
    return response.data;
  },

  async remove(commentId: number): Promise<ApiMessage> {
    const response = await api.delete<ApiMessage>(`/comments/${commentId}`);
    return response.data;
  },
};
