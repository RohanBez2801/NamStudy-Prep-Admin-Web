## PR: Semantic CSS migration — Replace Tailwind-style utilities with a self-contained design system

This PR migrates the Admin Console from Tailwind-style utility classNames to a self-contained semantic CSS design system. It does NOT change any functional logic, routing, authentication, Supabase configuration, queries, or authorization.

Summary of changes
- Replaced src/index.css with a self-contained CSS design system (variables, reset, tokens, layout, components, responsive rules).
- Converted utility-class markup to semantic class names across core UI components and pages used by the login and dashboard flows.
- Ensured media/avatar constraints and image safety to prevent uncontrolled image sizing.
- Added explicit focus states for accessibility.

Files changed (high level)
- src/index.css (rewritten)
- src/layouts/AdminLayout.tsx
- src/components/Sidebar.tsx
- src/components/Header.tsx
- src/components/StatCard.tsx
- src/pages/LoginPage.tsx
- src/pages/DashboardPage.tsx
- src/pages/UsersPage.tsx
- src/pages/UserDetailsPage.tsx
- src/pages/AccessDenied.tsx

Runbook
1. Install
   npm install
2. Lint
   npm run lint
3. Build
   npm run build
4. Dev
   npm run dev

Visual verification
- Login: http://localhost:5173/login — Centered auth card, constrained inputs, labelled fields, primary button, focus states, error state.
- Dashboard: http://localhost:5173/dashboard — Fixed dark sidebar (256px), header, main content to the right, stat cards in responsive grid, constrained avatars/images, no raw browser-default presentation.

Notes
- Sidebar width: 256px
- Header avatar: 36px
- Profile avatar: 96px
- I attempted to capture before/after screenshots. If they are not attached to this PR, please run the dev server and capture the screenshots locally (recommended desktop viewport: 1440×900).

If you'd like any naming changes for semantic classes or further tweaks to spacing/typography, I can follow up with a small patch.
