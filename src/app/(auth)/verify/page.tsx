'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';

export default function VerifyPage() {
  const [token, setToken] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token') ?? '');
  }, []);

  const verify = async () => {
    if (!token) {
      setError('Token no encontrado en la URL.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.verifyEmail(token);
      setMessage(response.message);
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'No fue posible verificar la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="mb-4 text-3xl font-bold text-white">Verificacion de cuenta</h1>
      <p className="mb-6 text-sm text-slate-400">Confirma tu correo para poder iniciar sesion.</p>

      {message && <p className="mb-4 rounded-lg bg-cyan-500/10 p-3 text-cyan-200">{message}</p>}
      {error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-red-300">{error}</p>}

      <Button className="w-full" onClick={verify} disabled={isLoading}>
        {isLoading ? 'Verificando...' : 'Verificar cuenta'}
      </Button>

      <Link href="/login" className="mt-5 block text-sm font-semibold text-cyan-300">
        Ir al login
      </Link>
    </div>
  );
}
