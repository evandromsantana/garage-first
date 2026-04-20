@AGENTS.md

# Agentes Habilitados para Garage Ninja

## Core Agents
- **Next.js 16 Agent** — App Router, Server Actions, cache, `revalidatePath()`
- **React 19 Agent** — Server Components por padrão, Client Components com `'use client'`
- **TypeScript Agent** — Strict mode, path aliases `@/`, tipos explícitos
- **Tailwind CSS v4 Agent** — CSS-first config, utilities, design system brutalista

## Database & API
- **Prisma ORM Agent** — SQLite, queries type-safe, migrations
- **Server Actions Agent** — Actions em `src/app/actions.ts`, validação server-side

## UI Components
- **shadcn/ui Agent** — Componentes em `src/components/ui/`, `class-variance-authority`
- **Reusable Components Agent** — `PageHeader`, componentes em `src/components/`

## Hooks & Logic
- **Custom Hooks Agent** — `useVehicleKm()`, `loadOrCreateVehicle()` em `src/hooks/`

## IDE & Workflows
- **IDE Config Agent** — `.cursorrules`, `.vscode/settings.json`, `.vscode/extensions.json`
- **Workflows** — `/db-workflow`, `/component-workflow`, `/dev-workflow`

Sempre consulte `AGENTS.md` antes de modificar código.
