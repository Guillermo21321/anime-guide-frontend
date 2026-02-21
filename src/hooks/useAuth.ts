'use client';

import { useAuthContext } from '@/components/features/auth-provider';

export function useAuth() {
  return useAuthContext();
}
