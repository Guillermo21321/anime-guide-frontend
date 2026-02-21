'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/lib/validations';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Datos invalidos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(parsed.data);
      setSession(response.accessToken, response.user);
      router.push('/');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'No fue posible iniciar sesion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-white">Iniciar sesion</h1>

      <form className="space-y-4" onSubmit={submit}>
        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="email">
            Correo electronico
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@dominio.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="******"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? 'Validando...' : 'Iniciar sesion'}
        </Button>
      </form>

      <p className="mt-5 text-sm text-slate-400">
        No tienes cuenta?{' '}
        <Link href="/register" className="font-semibold text-cyan-300">
          Registrate
        </Link>
      </p>
    </div>
  );
}
