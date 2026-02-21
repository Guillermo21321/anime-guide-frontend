import clsx, { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatDate(dateInput: string): string {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getInitials(name: string, lastName: string): string {
  return `${name[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}
