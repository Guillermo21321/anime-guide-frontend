# anime-guide-frontend

Frontend del proyecto Anime Guide con Next.js App Router, UI minimalista y panel admin.

## Stack

- Next.js + TypeScript
- Tailwind CSS
- Axios
- Zod

## Estructura

```text
frontend/
+-- public/
+-- src/
¦   +-- app/
¦   ¦   +-- (auth)/
¦   ¦   +-- (main)/
¦   ¦   +-- anime/[id]/
¦   ¦   +-- watch/[id]/
¦   ¦   +-- admin/
¦   +-- components/
¦   ¦   +-- ui/
¦   ¦   +-- layout/
¦   ¦   +-- features/
¦   +-- hooks/
¦   +-- services/
¦   +-- types/
¦   +-- lib/
```

## Configuracion

1. Crea `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

2. Instala y ejecuta:
```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Rutas

- `/` home
- `/catalogo`
- `/anime/[id]`
- `/watch/[id]`
- `/login`
- `/register`
- `/verify?token=...`
- `/admin`
