'use client';

import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none',
        className,
      )}
      {...props}
    />
  );
}
