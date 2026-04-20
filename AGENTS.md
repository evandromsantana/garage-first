<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 Agent Rules

- This is NOT the Next.js you know — v16 has breaking changes
- Read the relevant guide in `node_modules/next/dist/docs/` before writing any code
- Use Server Actions in `actions.ts` files — already configured in `src/app/actions.ts`
- Use `revalidatePath()` for cache invalidation after mutations
- Images are unoptimized in `next.config.ts` — use standard `<img>` or Next.js Image component
- App Router structure is in `src/app/` — follow existing route conventions
- Heed deprecation notices in docs
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:react-agent-rules -->
# React 19 Agent Rules

- Use React 19 features: Server Components by default, Client Components only when needed
- Add `'use client'` directive only for interactive components (hooks, browser APIs, event handlers)
- Use Server Actions for form submissions and data mutations
- Keep components in `src/components/` with PascalCase naming
<!-- END:react-agent-rules -->

<!-- BEGIN:prisma-agent-rules -->
# Prisma ORM Agent Rules

- Always import from `@/lib/db` — `prisma` client is singleton there
- Schema is in `prisma/schema.prisma` — SQLite database
- Models: `Vehicle`, `MaintenanceLog`, `ProjectExpense`, `TechnicalSpec`
- Use type-safe queries with generated Prisma Client types
- For relations, use `include` or nested `create` as shown in existing actions
- Run `npx prisma generate` after schema changes
- Use `npx prisma studio` to browse data
<!-- END:prisma-agent-rules -->

<!-- BEGIN:tailwind-agent-rules -->
# Tailwind CSS v4 Agent Rules

- v4 uses CSS-based configuration in `globals.css`, not `tailwind.config.js`
- Import order matters: `globals.css` imports Tailwind via `@import "tailwindcss"`
- Use `tw-animate-css` for animations (already configured)
- Theme configuration is in CSS using `@theme` blocks
- Use standard Tailwind utilities — v4 utilities are largely compatible
<!-- END:tailwind-agent-rules -->

<!-- BEGIN:shadcn-agent-rules -->
# shadcn/ui Agent Rules

- Components are in `src/components/ui/` — use existing components before creating new ones
- Use `shadcn add <component>` to install new components from registry
- Components use `class-variance-authority` for variants — follow existing patterns
- Base UI + Radix UI primitives are available
- Use `lucide-react` for icons (already installed)
- Use `sonner` for toast notifications
<!-- END:shadcn-agent-rules -->

<!-- BEGIN:typescript-agent-rules -->
# TypeScript Agent Rules

- Strict mode enabled — avoid `any` types
- Use path alias `@/` for imports from `src/`
- Prefer explicit return types on exported functions
- All existing actions in `actions.ts` have proper types — follow those patterns
- React components: use `React.FC` or explicit props interfaces
<!-- END:typescript-agent-rules -->

<!-- BEGIN:custom-hooks-agent-rules -->
# Custom Hooks Agent Rules

- Use `useVehicleKm()` for KM update operations with loading states
- Use `loadOrCreateVehicle()` server function for vehicle initialization
- Use `useMaintenance(id)` for maintenance detail page operations
- Use `useShare()` and `usePrint()` for share and print functionality
- Use `useTheme()` for theme management (dark/light mode)
- Use `useChecklist()` for checklist state management
- All hooks are in `src/hooks/` directory
- Follow naming convention: `use<HookName>.ts` for client hooks, descriptive names for server functions
<!-- END:custom-hooks-agent-rules -->

<!-- BEGIN:reusable-components-agent-rules -->
# Reusable Components Agent Rules

- Use `PageHeader` component for consistent page headers (back button, title, icon)
- All reusable components are in `src/components/` (non-ui components)
- Follow existing brutalist design system (border-4, rounded-none, uppercase, font-black)
- Components should accept `className` prop for customization
<!-- END:reusable-components-agent-rules -->

<!-- BEGIN:ide-config-agent-rules -->
# IDE Configuration Agent Rules

- `.cursorrules` — Cursor IDE specific rules and conventions
- `.vscode/settings.json` — VS Code settings (non-deprecated keys)
- `.vscode/extensions.json` — Recommended extensions list
- All IDE configs follow project conventions (non-relative imports, auto-format on save)
<!-- END:ide-config-agent-rules -->
