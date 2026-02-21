import { ApiMessage, User, UserRole, UserStatus } from '@/types';
import { api } from './api';

export const userService = {
  async list(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async updateStatus(id: number, status: UserStatus): Promise<User> {
    const response = await api.patch<User>(`/users/${id}/status`, { status });
    return response.data;
  },

  async updateRole(id: number, role: UserRole): Promise<User> {
    const response = await api.patch<User>(`/users/${id}/role`, { role });
    return response.data;
  },

  async remove(id: number): Promise<ApiMessage> {
    const response = await api.delete<ApiMessage>(`/users/${id}`);
    return response.data;
  },
};
