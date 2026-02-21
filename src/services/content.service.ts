import { api } from './api';

export interface CreateSeasonPayload {
  animeId: number;
  seasonNumber: number;
  title?: string;
  imageUrl: string;
}

export interface CreateEpisodePayload {
  seasonId: number;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  links?: Array<{
    label: string;
    url: string;
    type: string;
  }>;
}

export const contentService = {
  async createSeason(payload: CreateSeasonPayload) {
    const response = await api.post('/seasons', payload);
    return response.data;
  },

  async createEpisode(payload: CreateEpisodePayload) {
    const response = await api.post('/episodes', payload);
    return response.data;
  },
};
