---
name: commit-suggestion
description: Suggests commit messages based on staged and unstaged changes. Use when the user asks for help writing a commit message, wants to commit, or types /commit.
---

# Commit Message Suggestion

Generate commit messages following the Conventional Commits convention.

## Workflow

1. Run `git diff` and `git diff --cached` to see all unstaged and staged changes
2. Also run `git status` to understand the full picture of modified, added, and deleted files
3. Analyze the changes and generate a commit message

## Commit Message Format

```
<type>: <description>

- <detail 1>
- <detail 2>
```

**Rules:**
- Type is lowercase English
- No scope (no parentheses)
- Description is imperative mood, lowercase, no period
- Description max 72 characters
- Body details as bullet points using `-` prefix
- Everything in English

## Allowed Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without functionality changes
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, or tooling changes
- `perf`: Performance improvements
- `ci`: CI/CD configuration changes
- `build`: Build system or external dependencies changes

## Examples

**Single file change:**
```
fix: resolve memory leak in data processing

- clear event listeners on component unmount
- add cleanup function for WebSocket connections
```

**Multiple files:**
```
feat: add user authentication module

- implement login and logout endpoints
- add JWT token validation middleware
- create user session management
```

**Simple change:**
```
docs: update API documentation
```

## Output

Return ONLY the commit message, nothing else. Do not include backticks or code blocks.
