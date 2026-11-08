# CLAUDE.md

## Language

Everything in the project is in English: code, identifiers, comments, UI labels, error messages, file and folder names, README and commit messages. This holds even when the conversation or the course materials are in Portuguese.

## Commands

- `npm run dev` — dev server
- `npm run typecheck` — type check
- `npm run build` — static build (SPA, `ssr: false`)

## Commit messages

Conventional Commits, without a scope:

```
<type>: <description>

- <detail>
- <detail>
```

- Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `style`, `test`, `chore`, `build`, `ci`.
- Description in the imperative, lowercase, no trailing period, at most 72 characters.
- Body is optional; when present, use `-` bullet points.
