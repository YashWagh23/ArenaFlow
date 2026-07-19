# Contributing to ArenaFlow

## Development Setup
1. Clone the repository.
2. Run `npm install` in the root.
3. Start the stack: `npm run dev:backend` and `npm run dev:frontend`.

## Coding Standards
- **TypeScript Strict Mode:** Absolutely no `any` types.
- **ESLint/Prettier:** Code must pass linting without warnings.
- **React Hooks:** Ensure strict dependency arrays for `useEffect` and `useCallback`.

## Branch Strategy
- `main` - Stable production RC.
- `feature/*` - New features.
- `fix/*` - Bug resolutions.

## Commit Convention
Use Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.

## Pull Request Checklist
- [ ] Code passes all TypeScript compiler checks.
- [ ] Playwright E2E suite passes `npm run test:e2e`.
- [ ] No `console.log` statements remaining.
- [ ] UI visual parity maintained (Dark Editorial Theme).
