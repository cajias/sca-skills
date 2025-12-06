# Migration Guide

How to apply this strict ESLint configuration to an existing project.

## Overview

This configuration is significantly stricter than most default ESLint setups. Applying it to an existing codebase will
likely surface many issues. This guide helps you migrate incrementally.

## Migration Steps

### Step 1: Format First

Start by standardizing formatting to eliminate style-related issues:

```bash
npx prettier --write .
git commit -am "Apply Prettier formatting"
```

This reduces noise and ensures all formatting issues are resolved before tackling logic and type errors.

### Step 2: Auto-Fix What's Possible

Many ESLint rules can auto-fix issues:

```bash
npx eslint . --fix
git commit -am "Auto-fix ESLint issues"
```

This typically fixes:

- Import organization
- Semicolons and quotes
- Spacing and indentation
- Some code simplifications

### Step 3: Address Remaining Issues

Run `npx eslint .` to see remaining issues. Fix incrementally by category:

#### 3.1 Fix Imports (Usually Quick)

- Remove unused imports
- Add missing imports
- Organize import order

Most IDEs can auto-organize imports.

#### 3.2 Add Type Annotations

This configuration requires explicit return types on all functions:

```typescript
// ❌ Before
function calculate(a: number, b: number) {
  return a + b;
}

// ✅ After
function calculate(a: number, b: number): number {
  return a + b;
}
```

**Tip:** Use TypeScript's inference to help:

```bash
# Let TypeScript infer the type, then add it explicitly
npx tsc --noEmit
```

#### 3.3 Reduce Complexity

Functions exceeding complexity limits (cyclomatic complexity > 10) need refactoring:

**Strategy:**

- Extract helper functions
- Use early returns to reduce nesting
- Replace complex conditionals with lookup tables
- Consider state machines for complex logic

```typescript
// ❌ Complex
function processOrder(order, user) {
  if (order) {
    if (user) {
      if (user.verified) {
        if (order.items.length > 0) {
          // nested logic
        }
      }
    }
  }
}

// ✅ Simplified
function processOrder(order: Order, user: User): Result {
  if (!order || !user || !user.verified || order.items.length === 0) {
    return Result.invalid();
  }
  return processVerifiedOrder(order, user);
}
```

#### 3.4 Remove Dead Code

Delete unused:

- Variables
- Imports
- Function parameters
- Functions
- Commented-out code

**Tip:** If you're unsure whether code is used, commit your changes first, then delete it. You can always restore from
git history.

#### 3.5 Fix Async Patterns

Ensure all promises are properly handled:

```typescript
// ❌ Floating promise
someAsyncFunction();

// ✅ Awaited
await someAsyncFunction();

// ✅ With error handling
someAsyncFunction().catch((error) => console.error(error));
```

### Step 4: Type Check

Run TypeScript type checking:

```bash
npx tsc --noEmit
```

Fix type errors file by file. Common issues:

- Missing type annotations
- Implicit `any` usage
- Null/undefined handling
- Incompatible types

## Incremental Adoption

If you have a large codebase, consider incremental adoption:

### Option 1: Per-Directory Overrides

Apply strict rules to new code, relax rules for legacy code:

```javascript
// eslint.config.js
import baseConfig from '@lint-configs/eslint-config/flat';

export default [
  ...baseConfig,
  {
    files: ['src/legacy/**/*.ts'],
    rules: {
      complexity: 'off',
      '@typescript-eslint/no-explicit-any': 'warn', // Warn instead of error
      'max-lines-per-function': 'off',
    },
  },
  {
    files: ['src/new/**/*.ts'],
    // Full strict rules apply
  },
];
```

### Option 2: Rule-by-Rule Enablement

Start with less strict rules, gradually tighten:

```javascript
// eslint.config.js
import baseConfig from '@lint-configs/eslint-config/flat';

export default [
  ...baseConfig,
  {
    rules: {
      // Start with warnings
      complexity: ['warn', 10],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'max-lines-per-function': 'warn',

      // Keep critical rules as errors
      '@typescript-eslint/no-explicit-any': 'error',
      'security/detect-object-injection': 'error',
    },
  },
];
```

Then gradually change warnings to errors as code improves.

### Option 3: File-by-File Migration

Create a checklist and migrate files one at a time:

```bash
# Create allowlist of files still needing fixes
npx eslint . --format json > eslint-issues.json

# Fix one file at a time
npx eslint src/components/Button.tsx --fix
```

## Common Migration Challenges

### Challenge: Too Many Type Annotations

**Problem:** Adding return types to every function feels tedious.

**Solution:**

- Use IDE auto-completion (VS Code can infer and add types)
- Start with exported functions (most important)
- Internal helpers can sometimes use inferred types

### Challenge: High Complexity Functions

**Problem:** Large functions that are hard to break down.

**Solution:**

- Identify logical sections
- Extract pure functions first (easiest to test)
- Use classes/objects to group related functionality
- Consider refactoring to a state machine or strategy pattern

### Challenge: Too Many Errors

**Problem:** Thousands of errors make it overwhelming.

**Solution:**

- Fix by category (all imports, then all type errors, etc.)
- Use `--rule` flag to focus on one rule at a time:

```bash
npx eslint . --rule '@typescript-eslint/explicit-function-return-type: error'
```

- Commit frequently as you fix categories

### Challenge: False Positives

**Problem:** Some rules flag valid code.

**Solution:**

- Use inline disable with explanation:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- External API returns any
function processLegacyApi(data: any): Result {
  // ...
}
```

- If a rule consistently causes problems, consider adjusting it in your config
- File an issue if you believe it's a rule bug

## Verification

After migration, verify everything works:

```bash
# Linting passes
npm run lint

# Type checking passes
npm run type-check

# Tests still pass
npm test

# Build succeeds
npm run build
```

## Getting Help

If you get stuck:

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
2. Search existing [GitHub issues](https://github.com/cajias/lint-configs/issues)
3. Open a new issue with:
   - The rule causing problems
   - A minimal code example
   - Why you believe it's a false positive

## Timeline Expectations

Typical migration times (rough estimates):

- **Small project** (< 10k lines): 1-2 days
- **Medium project** (10k-50k lines): 1-2 weeks
- **Large project** (> 50k lines): Several weeks

Plan accordingly and consider incremental adoption for larger codebases.
