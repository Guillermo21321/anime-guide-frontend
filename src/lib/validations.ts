import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  lastName: z.string().min(2, 'Los apellidos son obligatorios'),
  email: z.email('Email invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.email('Email invalido'),
  password: z.string().min(6, 'Password invalido'),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Escribe un comentario').max(1000),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
