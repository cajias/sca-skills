# Contributing to sca-skills

## Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to automate versioning and changelog generation.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type       | Description                          | Version Bump          |
| ---------- | ------------------------------------ | --------------------- |
| `feat`     | A new feature                        | Minor (1.0.0 → 1.1.0) |
| `fix`      | A bug fix                            | Patch (1.0.0 → 1.0.1) |
| `docs`     | Documentation only changes           | None                  |
| `style`    | Code style changes (formatting, etc) | None                  |
| `refactor` | Code refactoring                     | None                  |
| `perf`     | Performance improvements             | Patch                 |
| `test`     | Adding or updating tests             | None                  |
| `build`    | Build system changes                 | None                  |
| `ci`       | CI/CD changes                        | None                  |
| `chore`    | Other changes                        | None                  |
| `revert`   | Revert a previous commit             | Patch                 |

### Breaking Changes

To indicate a breaking change (Major version bump: 1.0.0 → 2.0.0):

```bash
feat!: remove deprecated API

BREAKING CHANGE: The old API has been removed. Use newAPI() instead.
```

### Examples

#### Good Commit Messages ✅

```bash
feat: add ESLint rule for async/await
fix: correct TypeScript config path
docs: update README installation instructions
style: format code with Prettier
refactor: simplify complexity in auth module
perf: optimize regex performance
test: add unit tests for linter
build: update dependencies
ci: add release-please workflow
chore: update .gitignore
```

#### Bad Commit Messages ❌

```bash
# Missing type
Updated README

# Capitalized subject
feat: Add new rule

# Period at end
fix: bug fix.

# Too vague
fix: stuff

# Wrong type
feat: fixed typo (should be 'fix' or 'docs')
```

### Scope (Optional)

You can add a scope to provide more context:

```bash
feat(eslint): add complexity rule
fix(ruff): correct config path
docs(readme): update installation
ci(release): add automated versioning
```

### Enforcement

Commit messages are validated using [commitlint](https://commitlint.js.org/). Invalid commit messages will be rejected.

To test your commit message before committing:

```bash
echo "feat: add new feature" | npx commitlint
```

## Release Process

1. **Make changes** with conventional commits
2. **Push to main** - release-please will create a release PR
3. **Review the release PR** - check version bump and changelog
4. **Merge the PR** - tags are created and packages are published automatically

## Development Workflow

```bash
# Install dependencies
npm install

# Run linters
npm run lint
npm run format:check

# Fix issues
npm run lint:fix
npm run format

# Build
npm run build

# Type check
npm run typecheck
```

## Pre-commit Hooks

This project uses [husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged) to:

- Lint and format staged files before commit
- Validate commit messages using commitlint

Hooks run automatically when you commit. To bypass (not recommended):

```bash
git commit --no-verify
```

## Questions?

Open an issue or check the [README](./README.md) for more information.
