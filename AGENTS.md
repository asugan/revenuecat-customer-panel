# AGENTS.md

This repository is a small Node.js + Express app that proxies RevenueCat API v2
and serves a static frontend from `public/`.

## Build / Run / Test Commands

- Install dependencies: `npm install`
- Start server: `npm start`
- Default test script (currently placeholder, always fails): `npm test`

### Single-Test Guidance

- No test runner is configured in this repo.
- There are no existing unit/integration tests or test files.
- If tests are added later, update this section with single-test commands.

## Project Layout

- `index.js` Express server and API proxy logic.
- `public/index.html` UI shell for customer list and actions.
- `public/styles.css` UI styling.
- `public/app.js` UI logic, API calls, and delete actions.
- `.env` local env configuration (not committed).
- `.env.example` sample env values.

## Environment Variables

- `RC_SECRET_API_KEY` required. RevenueCat v2 secret key.
- `RC_PROJECT_ID` required. RevenueCat project ID.
- `RC_API_BASE_URL` optional. Default `https://api.revenuecat.com/v2`.
- `PORT` optional. Default `3002`.

## Code Style Guidelines

### Language / Runtime

- Node.js, CommonJS modules (`require` / `module.exports`).
- Node 18+ for built-in `fetch` support.

### Formatting

- Use 2-space indentation.
- Use semicolons for statement termination.
- Prefer double quotes for strings.
- Keep line length reasonable (roughly <= 100 chars) where possible.

### Imports / Requires

- Use `const` for all requires.
- Group core/built-in requires first, then external packages, then local files.
- Avoid reordering existing requires unless necessary.

### Naming

- Use `camelCase` for variables and functions.
- Use `PascalCase` for class or constructor names (if introduced).
- Use descriptive names (avoid 1-letter identifiers).
- UI element references in `public/app.js` should be named after their role
  (e.g., `listEl`, `statusEl`).

### Types / Data Shapes

- Keep payloads from RevenueCat unmodified unless required.
- Avoid coercing types; pass through API fields as received.
- For new fields, document expected shape in comments or README.

### Error Handling

- Use try/catch around async route handlers.
- Return JSON error objects consistently:
  - `{ error: "...", details: "..." }` for server-side proxy failures.
- Preserve upstream HTTP status codes from RevenueCat when proxying.
- In the UI, surface errors via status text and `alert` for blocking issues.

### API / Routing Conventions

- Proxy endpoints should map clearly to RevenueCat endpoints.
- Use `encodeURIComponent` for user-supplied path segments.
- Preserve query parameters by forwarding `req.query`.
- Avoid adding new endpoints without documenting them in `README.md`.

### Frontend Conventions (`public/`)

- Keep DOM access at the top of `public/app.js`.
- Keep functions small and focused (rendering, fetch, actions).
- Avoid external dependencies; vanilla JS only.
- Ensure buttons are disabled during long-running operations.

### Security / Secrets

- Never hard-code API keys or project IDs in source files.
- `.env` should remain local and uncommitted.
- If adding new env vars, update `.env.example` and `README.md`.

### Documentation

- Keep `README.md` updated when adding new endpoints or commands.
- Use concise usage examples (curl or browser URLs).

## Linting / Formatting Tools

- No linter or formatter configured.
- Do not introduce new tooling unless requested by the user.

## Cursor / Copilot Rules

- No `.cursor/rules`, `.cursorrules`, or Copilot instructions found.
- If these files are added in the future, incorporate their guidance here.
