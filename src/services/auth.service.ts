import { AuthResponse, ApiMessage, User } from '@/types';
import { api } from './api';

export interface RegisterPayload {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<ApiMessage> {
    const response = await api.post<ApiMessage>('/auth/register', payload);
    return response.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  async verifyEmail(token: string): Promise<ApiMessage> {
    const response = await api.post<ApiMessage>('/auth/verify-email', { token });
    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};
