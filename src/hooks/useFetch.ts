'use client';

import { useEffect, useState } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useFetch<T>(fetcher: () => Promise<T>, deps: ReadonlyArray<unknown> = []) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const result = await fetcher();
        if (mounted) {
          setState({ data: result, isLoading: false, error: null });
        }
      } catch (error) {
        if (mounted) {
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error al cargar datos',
          });
        }
      }
    };

    void run();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
