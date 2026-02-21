import { Anime, VoteValue, ApiMessage } from '@/types';
import { api } from './api';

interface VoteResult {
  id: number;
  likes: number;
  dislikes: number;
}

interface CreateAnimePayload {
  title: string;
  description: string;
  iconUrl: string;
  bannerUrl?: string;
  galleryUrls?: string[];
}

export const animeService = {
  async list(search?: string): Promise<Anime[]> {
    const response = await api.get<Anime[]>('/animes', {
      params: search ? { search } : undefined,
    });
    return response.data;
  },

  async detail(id: number): Promise<Anime> {
    const response = await api.get<Anime>(`/animes/${id}`);
    return response.data;
  },

  async vote(id: number, value: VoteValue): Promise<VoteResult> {
    const response = await api.post<VoteResult>(`/animes/${id}/vote`, { value });
    return response.data;
  },

  async create(payload: CreateAnimePayload): Promise<Anime> {
    const response = await api.post<Anime>('/animes', payload);
    return response.data;
  },

  async remove(id: number): Promise<ApiMessage> {
    const response = await api.delete<ApiMessage>(`/animes/${id}`);
    return response.data;
  },
};
