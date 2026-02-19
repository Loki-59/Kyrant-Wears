# Kyrant Wears — Frontend (Next.js)

This is the frontend app for Kyrant Wears built with Next.js + TypeScript, Tailwind, Supabase and TanStack Query.

## Quick start

1. Install dependencies:

```bash
cd Frontend
npm install
```

2. Create a `.env.local` file in `Frontend/` with the following variables:

- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
- `NEXT_PUBLIC_API_URL` — (optional) backend API base if used
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — (optional) Stripe publishable key for payment UI

Example `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Prepare Husky (optional):

```bash
npm run prepare
```

4. Run dev server:

```bash
npm run dev
```

## What I implemented

- Tailwind config with the specified color palette.
- Supabase client initializer at `lib/supabase.ts`.
- Zustand stores: `authStore` and `cartStore` (with persistence).
- React Query provider.
- Auth flow wiring (signup, login, Google OAuth, forgot password, callback page).
- Protected routes component and guarded merchant/admin pages.
- Product listing (`/products`) and product detail (`/product/[id]`) using TanStack Query.
- Cart (`/cart`) and Checkout UI (`/checkout`) with form validation (Zod + React Hook Form).
- Merchant upload component: `components/merchant/DesignUploadForm.tsx`.
- Admin page skeleton.

## Notes for deployment & missing pieces you must supply

- Supabase: Ensure `designs` table and `profiles` table exist with appropriate columns (`id`, `role`, etc.).
- Storage: Create a Supabase storage bucket named `designs` and set appropriate RLS policies.
- Stripe: The checkout flow is UI-only. To accept real payments, integrate Stripe on the server and client and provide `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Email redirect URLs: Configure OAuth redirect and password reset redirect in Supabase to `https://yourdomain.com/auth/callback` and `/login` respectively.

## Environment variables (summary)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` (optional)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (optional)

## Next steps / Suggestions

- Add tests for critical flows.
- Implement Stripe server endpoints and client Elements for payments.
- Add more robust error handling and toasts (sonner integrated in package.json).
- Implement pagination and filters server-side for product listing.
- Harden RLS policies in Supabase and add server-side endpoints for admin-only actions.

If you want, I will continue and complete the remaining features (full merchant dashboard widgets, admin approvals, real-time subscriptions, and polish). When finished I'll provide a final consolidated README with deployment steps.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
