# RepoLens

RepoLens is a **TypeScript-first** GitHub portfolio explorer. It demonstrates how I use TypeScript to build a type-safe React application: from API validation and domain models to UI state and tests. Enter a GitHub username to view their profile and repositories, then sort the repository list or include forks and archived projects.

## Built with

- TypeScript — strict types for API responses, domain models, reducer actions, and component props
- React 19
- Vite
- GitHub REST API
- Zod for API-response validation
- Vitest for unit tests and coverage

## What I built

- Username search with loading and error states
- Profile details and repository cards
- Repository sorting and filters for forks and archived repositories
- Type-safe API handling with Zod validation, typed response-to-domain mapping, URL encoding, abort signals, and friendly API errors
- Typed reducer state and actions for predictable search states
- Tests for the GitHub client and profile-state reducer, using mocked network requests

## Run locally

```bash
npm install
npm run dev
```

## Useful commands

| Command | Description |
| --- | --- |
| `npm run test:run` | Run the test suite once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Check code quality with ESLint |
