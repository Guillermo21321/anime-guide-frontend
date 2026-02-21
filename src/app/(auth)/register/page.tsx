'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerSchema } from '@/lib/validations';
import { authService } from '@/services/auth.service';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Formulario invalido');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await authService.register(parsed.data);
      setMessage(response.message);
      setForm({ name: '', lastName: '', email: '', password: '' });
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-white">Crear cuenta</h1>

      <form className="space-y-4" onSubmit={submit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Nombre"
          />
          <Input
            value={form.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
            placeholder="Apellidos"
          />
        </div>

        <Input
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder="correo@dominio.com"
        />

        <Input
          type="password"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder="Crea una password"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}
        {message && <p className="text-sm text-cyan-300">{message}</p>}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Registrarme'}
        </Button>
      </form>

      <p className="mt-5 text-sm text-slate-400">
        Ya tienes cuenta?{' '}
        <Link href="/login" className="font-semibold text-cyan-300">
          Inicia sesion
        </Link>
      </p>
    </div>
  );
}
