---
name: kedata-frontend
description: Use this skill when writing, converting, or reviewing Kedata frontend code. Covers React + TanStack Start and Vue + Nuxt 3 stacks, design preservation, state management, forms, API integration, testing, and security rules.
version: 1.0.0
author: Kedata Indonesia
---

# Skill: Kedata Frontend Engineering

## Purpose
Enforce Kedata's frontend engineering standards for production-grade TypeScript web apps. Supports **React + TanStack Start** (default) and **Vue + Nuxt 3** stacks, including structured React → Vue/Nuxt conversion with visual preservation, strict typing, and a disciplined folder architecture.

## When to Use
* User command: `/kedata-frontend`
* Autonomous trigger: When writing, converting, or reviewing frontend code in a Kedata repo; when porting an `Rnd FE/` prototype to production; when the target stack is React/Vue or a conversion between them.

## Prerequisites & Context Gathering
Before writing code, the agent MUST inspect the project:
1. Read the project docs:
   * `docs/DEVELOPMENT_PLAN.md`
   * `docs/MODULES_AND_FEATURES.md`
   * `docs/COMPONENT_SPECS.md`
   * `docs/STATE_MANAGEMENT.md`
   * `docs/API_INTEGRATION.md`
   * `PRD.md` (if exists)
2. Check API contracts before touching endpoints: `docs/API_CONTRACTS.md` or backend Swagger at `/swagger`.
3. Check existing design references (`Rnd FE/`, prototype, Figma) — preserve visual layout, colors, spacing, typography, copy, and component behavior unless explicitly asked to change them.
4. Identify the target stack from `DEVELOPMENT_PLAN.md` or the user. Default is **React + TanStack Start** unless the project explicitly chooses **Vue + Nuxt 3**.
5. Ask the user for clarification IF:
   * The target stack is not defined.
   * A design reference conflicts with a new requirement.
   * An API contract is missing for the endpoint being consumed.

## Execution Workflow

### Step 1: Supported Tech Stacks

**Stack A: React + TanStack Start (Default)** — React 19 + TanStack Start + Vite, TanStack Router (file-based), Tailwind CSS v4 + shadcn/ui, TanStack Query v5, Zustand, react-hook-form + zod, axios, sonner, lucide-react, Vitest + React Testing Library + Playwright.

**Stack B: Vue 3 + Nuxt 3** — Vue 3 + Nuxt 3, Nuxt file-based routing (`pages/`), Tailwind CSS + @nuxtjs/tailwindcss, TanStack Query Vue or `useFetch`/`$fetch`, Pinia, vee-validate + zod, `$fetch`/`useFetch`, vue-sonner, lucide-vue-next, Vitest + Vue Test Utils + Playwright.

### Step 2: Project Structure
Follow the house layout (`src/components/{ui,portal,landing,forms,shared}`, `src/hooks/api`, `src/lib/{api,schemas}`, `src/routes` or `pages/`, `src/services`, `src/stores`, `tests/{unit,integration,e2e}` — or the Nuxt equivalents).

**Cross-Stack Folder Rules**
* `components/ui/` — UI primitives only, no business logic.
* `components/portal/` — authenticated app components.
* `components/landing/` — public/marketing components.
* `components/forms/` — reusable form components.
* `components/shared/` — cross-cutting components.
* API calls → `services/`; schemas → `lib/schemas/`; types → `types/`.

### Step 3: Architecture Rules
* **Server state in a query library:** TanStack Query v5 (React) or `@tanstack/vue-query` / `useFetch` / `$fetch` (Vue). Never use `localStorage`/`sessionStorage`/global mutable state for business data.
* **Client state in a store:** Zustand (React) or Pinia (Vue) — auth tokens, UI toggles, sidebar state, notification counts.
* **One service module per API resource** in `services/` (e.g., `registration.service.ts`).
* **One query/mutation hook per API pattern:** `src/hooks/api/useRegistrations.ts` (React) or `composables/api/useRegistrations.ts` (Vue).
* **File-based routing only** (`src/routes/` for TanStack, `pages/` for Nuxt). No manual route configs unless absolutely necessary.

### Step 4: React → Vue / Nuxt Conversion (when applicable)
1. **Preserve visuals first** — match colors, spacing, typography, layout, copy exactly.
2. **Preserve UX second** — interactions, modals, drawers, toasts, loading/empty states.
3. Replace state layer: `useState/useEffect` → `ref/reactive/computed/watch`.
4. Replace server state: TanStack Query React → `@tanstack/vue-query` or `useFetch`.
5. Replace client state: Zustand → Pinia.
6. Replace forms: react-hook-form + zod → vee-validate + zod.
7. Replace routing: TanStack Router file routes → Nuxt `pages/`.
8. Replace components: shadcn/ui → shadcn-vue or custom Tailwind components.

**JSX → Vue mapping:** `useState`→`ref/reactive`, `useEffect`→`onMounted`/`watch`/`watchEffect`, `useMemo`→`computed`, `{cond && <A/>}`→`<A v-if="cond"/>`, `items.map`→`<Component v-for>`, `onClick`→`@click`, `className={cn(...)}`→`:class="cn(...)"`, `children`→`<slot/>`.

**Component file rules (Vue):** `<script setup lang="ts">`, `defineProps<T>()` with TypeScript interfaces, `defineEmits<T>()`, keep components <250 lines.

**Auth conversion:** access token in Pinia + `localStorage` (or `useCookie`), `$fetch` interceptor for refresh, `middleware/auth.ts` for route guards.

### Step 5: Design & UX
* Preserve existing design references (`Rnd FE/`, Figma, screenshots) for layout, colors, spacing, typography, copy, interactions.
* Mobile-first, responsive layouts (375px+).
* Indonesian copy for Indonesian products unless told otherwise.
* Shared label constants (`ROLE_LABEL`, `STATUS`) from the project's data file.
* Feature-flag beyond-MVP scope: `VITE_ENABLE_KURASI`, `VITE_ENABLE_AI_REKOMENDASI`, `VITE_ENABLE_FILE_UPLOAD`, `VITE_ENABLE_NOTIFIKASI` (default `false`).

### Step 6: Auth Rules
* Access token in client store + `localStorage`; refresh token via backend `httpOnly` cookie.
* Interceptor refreshes on `401`, redirects to `/portal/login` on failure.
* Protected routes via guards: `RequireAuth`/`RequireAdmin` (React) or `middleware/auth.ts`/`middleware/admin.ts` (Vue).

### Step 7: Code Quality
* TypeScript `strict: true`, no implicit `any`; explicit props interfaces; absolute imports (`@/components/...`).
* Handle loading, error, empty states for every server-driven UI.
* Never mutate query cache directly except optimistic updates.
* Components <300 lines; add `aria-label`, visible focus rings, keyboard support.

### Step 8: Forms & API Integration
* React: `react-hook-form` + `zodResolver`; Vue: `vee-validate` + zod. Schemas in `lib/schemas/`.
* Inline validation errors; disable submit while submitting; toast feedback on success/error.
* Base URL from env: `import.meta.env.VITE_API_BASE_URL` (React) or `useRuntimeConfig().public.apiBaseUrl` (Nuxt).
* Typed service modules only — no raw HTTP client calls in components. Reads via query library; writes via mutations; invalidate related queries after mutations; parse API errors to UX.

### Step 9: State Management
* Query keys: `["registrations"]`, `["registrations", id]`, `["penjajakan", { status, page }]`.
* Keep stores small and focused; persist only non-sensitive state; never store server data in client stores.

### Step 10: Testing
* Unit tests for hooks/composables, utilities, complex components; integration tests with MSW; Playwright E2E for critical flows.
* Run before finishing:
  * React: `npm run lint`, `npx tsc --noEmit`, `npm run test`
  * Vue/Nuxt: `npm run lint`, `npx nuxi typecheck`, `npm run test`

### Step 11: Documentation & Workflow
* Update `docs/` on API usage, state shape, routing, component specs (`COMPONENT_SPECS.md`, `MODULES_AND_FEATURES.md`, `API_INTEGRATION.md`, `DEVELOPMENT_PLAN.md`).
* Work from a task issue/MR description; minimal changes; don't refactor unrelated code; don't change tests unless the interface genuinely changes.
* When porting from `Rnd FE/`, preserve visuals but replace local/mock state with production patterns. When converting React → Vue, produce a working Nuxt page/component before optimizing.

## Constraints & Guardrails
* **DO NOT** use `localStorage`/global mutable state for business/server data.
* **DO NOT** call the HTTP client directly inside components — use typed service modules.
* **DO NOT** store refresh tokens in `localStorage`.
* **DO NOT** log secrets, tokens, or passwords; sanitize user-generated HTML before rendering; validate input on both client (zod) and server.
* **DO NOT** use `any` types; do not create manual route configs.
* **DO NOT** alter the visual design of a prototype unless explicitly asked.
* Be concise; ask clarifying questions when ambiguous; propose simpler solutions first; explain trade-offs.

## Example Output Structure
Composable pattern (Vue/Nuxt):
```typescript
export const usePasswordReset = () => {
  const forgotPassword = async (email: string) => {
    return await $fetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: { email }
    })
  }
  return { forgotPassword }
}
```
Component pattern:
```vue
<script setup lang="ts">
const { forgotPassword } = usePasswordReset()
const email = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    await forgotPassword(email.value)
  } catch (e: any) {
    error.value = e.data?.error || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>
```
