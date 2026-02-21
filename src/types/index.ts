export type UserRole = 'ADMIN' | 'USER';
export type UserStatus = 'ACTIVE' | 'BANNED';
export type VoteValue = 'LIKE' | 'DISLIKE';

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  verifiedAt: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface AnimeGalleryImage {
  id: number;
  url: string;
}

export interface EpisodeLink {
  id: number;
  label: string;
  url: string;
  type: string;
}

export interface Episode {
  id: number;
  seasonId: number;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  links: EpisodeLink[];
}

export interface Season {
  id: number;
  animeId: number;
  seasonNumber: number;
  title: string | null;
  imageUrl: string;
  episodes: Episode[];
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    lastName: string;
  };
}

export interface Anime {
  id: number;
  title: string;
  description: string;
  iconUrl: string;
  bannerUrl: string | null;
  likes: number;
  dislikes: number;
  gallery: AnimeGalleryImage[];
  seasons: Season[];
  comments?: Comment[];
  currentUserVote?: VoteValue | null;
}

export interface ApiMessage {
  message: string;
}

export interface AdminComment extends Comment {
  anime: {
    id: number;
    title: string;
  } | null;
  episode: {
    id: number;
    title: string;
  } | null;
  user: {
    id: number;
    name: string;
    lastName: string;
    email: string;
  };
}
