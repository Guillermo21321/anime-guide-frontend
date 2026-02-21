import { Episode } from '@/types';
import { api } from './api';

export const episodeService = {
  async detail(id: number): Promise<Episode & { season: { anime: { id: number; title: string } } }> {
    const response = await api.get<Episode & { season: { anime: { id: number; title: string } } }>(
      `/episodes/${id}`,
    );
    return response.data;
  },
};
