# ESLint Configuration for AI-Generated Code

Canonical ESLint configuration for JavaScript/TypeScript projects with minimal ignores and comprehensive rule coverage. This package mirrors the rule set from our Python package, giving JavaScript/TypeScript developers the same guardrails for agentic code patterns.

## Philosophy

**If it's worth enabling, it's worth enforcing everywhere.**

This configuration enforces strict code quality standards to keep AI-generated code in check:

- **Minimal ignores** - Only rules that conflict with Prettier are disabled
- **Maximum strictness** - All quality checks enabled
- **Consistent with Python package** - Similar principles across languages
- **Easy adoption** - Simple to integrate into any project

## Features

### 🔒 Security (mirrors Python Bandit)

- Detects unsafe regex patterns
- Prevents eval usage
- Identifies timing attack vulnerabilities
- Flags insecure random number generation

### 🎯 Type Safety (mirrors Python mypy)

- TypeScript strict mode enabled
- Explicit return types required
- No implicit any
- Strict null checks
- Proper async/promise typing

### 🧹 Dead Code Detection (mirrors Python F401, F841, ERA, ARG)

- Unused variables and imports
- Unused function arguments
- Unreachable code
- Commented-out code
- Useless return statements

### 📊 Complexity Limits (mirrors Python C90, PLR)

- Max cyclomatic complexity: 10
- Max function parameters: 5
- Max statements per function: 50
- Max nesting depth: 4
- Cognitive complexity limits

### ⚠️ Error Handling (mirrors Python TRY)

- Proper promise handling
- No floating promises
- Catch or return promises
- No promise nesting
- Type-safe error throwing

### 🎨 Code Quality

- Import organization (like isort)
- Naming conventions (camelCase, PascalCase)
- Modern JavaScript/TypeScript patterns
- Duplicate code detection
- No magic numbers

## Quick Start

### Installation

```bash
npm install --save-dev @sca-skills/eslint-config eslint typescript
```

### Setup

#### Option 1: Flat Config (ESLint 9+) - Recommended

Create `eslint.config.js`:

```javascript
import agenticConfig from '@sca-skills/eslint-config/flat';

export default [
  ...agenticConfig,
  {
    // Your project-specific overrides
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
];
```

#### Option 2: Legacy Config (ESLint 8.x)

Create `.eslintrc.js`:

```javascript
module.exports = {
  extends: ['@sca-skills/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
  },
  // Your project-specific overrides
};
```

Or use `.eslintrc.json`:

```json
{
  "extends": ["@sca-skills/eslint-config"],
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

### TypeScript Configuration

Use the included strict TypeScript config. Create or extend `tsconfig.json`:

```json
{
  "extends": "@sca-skills/eslint-config/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### Prettier Configuration

Copy the Prettier config to your project:

```bash
cp node_modules/@sca-skills/eslint-config/.prettierrc.js .prettierrc.js
```

Or create `.prettierrc.js`:

```javascript
module.exports = require('@sca-skills/eslint-config/.prettierrc.js');
```

## Required Dependencies

Install all required dependencies:

```bash
npm install --save-dev \
  eslint@^8.56.0 \
  typescript@^5.3.0 \
  prettier@^3.1.0 \
  @typescript-eslint/eslint-plugin@^6.0.0 \
  @typescript-eslint/parser@^6.0.0 \
  eslint-config-prettier@^9.0.0 \
  eslint-plugin-import@^2.29.0 \
  eslint-plugin-security@^1.7.0 \
  eslint-plugin-sonarjs@^0.23.0 \
  eslint-plugin-unicorn@^50.0.0 \
  eslint-plugin-promise@^6.1.0 \
  eslint-plugin-n@^16.6.0
```

## Usage

### Format and Lint

```bash
# Format code with Prettier
npx prettier --write .

# Lint with ESLint (auto-fix)
npx eslint . --fix

# Lint without auto-fix (CI mode)
npx eslint .

# Type check with TypeScript
npx tsc --noEmit
```

### Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . && prettier --check .",
    "lint:fix": "eslint . --fix && prettier --write .",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "check": "npm run lint && npm run type-check"
  }
}
```

### CI/CD Integration

#### GitHub Actions

```yaml
name: Lint and Type Check

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check
```

## Configuration Overview

This configuration provides:

### ESLint Rules

- **200+ rules enabled** across multiple plugin categories
- **Only Prettier conflicts ignored**
- **Per-file ignores** for test files and config files
- **Security scanning** for common vulnerabilities
- **Complexity limits** to keep functions simple
- **Dead code detection** to maintain clean code
- **Duplicate code detection** to prevent copy-paste programming

### TypeScript Settings

- **Strict mode** enabled with all checks
- No implicit any types
- Strict null checks
- Unused locals and parameters detection
- Unreachable code detection

### Prettier Settings

- **120 character line length** (matches Python Black)
- Single quotes for strings
- Trailing commas
- 2-space indentation
- LF line endings

## What This Configuration Enforces

### 1. Type Safety Everywhere

All functions must have explicit return types:

```typescript
// ❌ Bad
function calculate(a: number, b: number) {
  return a + b;
}

// ✅ Good
function calculate(a: number, b: number): number {
  return a + b;
}
```

### 2. No Dead Code

```typescript
// ❌ Bad - unused variable
const unused = 42;

// ❌ Bad - commented out code
// const oldCode = 'remove this';

// ✅ Good
const used = 42;
console.log(used);
```

### 3. Proper Error Handling

```typescript
// ❌ Bad - floating promise
someAsyncFunction();

// ✅ Good
await someAsyncFunction();

// ✅ Also good
someAsyncFunction().catch((error) => console.error(error));
```

### 4. Complexity Limits

```typescript
// ❌ Bad - too complex
function complexFunction(a, b, c, d, e, f) {
  // More than 5 parameters
  if (a) {
    if (b) {
      if (c) {
        if (d) {
          // More than 4 levels of nesting
        }
      }
    }
  }
}

// ✅ Good - simple and focused
function simpleFunction(config: Config): Result {
  // Single responsibility, low complexity
  return processConfig(config);
}
```

### 5. Modern JavaScript/TypeScript

```typescript
// ❌ Bad
var x = 1;
const arr = [1, 2, 3];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// ✅ Good
const x = 1;
const arr = [1, 2, 3];
for (const item of arr) {
  console.log(item);
}
```

### 6. Security Best Practices

```typescript
// ❌ Bad - potential security issue
const userInput = getUserInput();
eval(userInput);

// ✅ Good - safe alternative
const userInput = getUserInput();
const result = JSON.parse(userInput);
```

## Customization

### Project-Specific Overrides

You can add project-specific rules in your config:

**Flat config:**

```javascript
import agenticConfig from '@sca-skills/eslint-config/flat';

export default [
  ...agenticConfig,
  {
    rules: {
      // Relax specific rules if needed
      'max-lines-per-function': ['error', { max: 100 }],
    },
  },
];
```

**Legacy config:**

```javascript
module.exports = {
  extends: ['@sca-skills/eslint-config'],
  rules: {
    // Relax specific rules if needed
    'max-lines-per-function': ['error', { max: 100 }],
  },
};
```

### Per-File Ignores

For specific files that need different rules:

```javascript
// In your eslint.config.js (flat config)
export default [
  ...agenticConfig,
  {
    files: ['src/legacy/**/*.ts'],
    rules: {
      complexity: 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
```

### Disabling Rules Inline

Use sparingly and document why:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Legacy API requires any
function legacyFunction(data: any): void {
  // ...
}
```

## Migration from Looser Config

If applying this to an existing project:

### Step 1: Format First

```bash
npx prettier --write .
git commit -am "Apply Prettier formatting"
```

### Step 2: Auto-Fix What's Possible

```bash
npx eslint . --fix
git commit -am "Auto-fix ESLint issues"
```

### Step 3: Address Remaining Issues

Run `npx eslint .` to see remaining issues. Fix incrementally:

1. **Fix imports** - Usually auto-fixable
2. **Add type annotations** - Required for all functions
3. **Reduce complexity** - Break down complex functions
4. **Remove dead code** - Delete unused variables and imports
5. **Fix async patterns** - Await promises properly

### Step 4: Type Check

```bash
npx tsc --noEmit
```

Fix type errors file by file.

## IDE Integration

### VS Code

Install extensions:

- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

### WebStorm / IntelliJ IDEA

1. Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable "Automatic ESLint configuration"
3. Settings → Languages & Frameworks → JavaScript → Prettier
4. Enable "On code reformat" and "On save"

## Troubleshooting

### "Too many errors"

Start by fixing auto-fixable issues:

```bash
npx eslint . --fix
```

Then address categories one at a time:

```bash
# Check specific rule
npx eslint . --rule '@typescript-eslint/explicit-function-return-type: error'
```

### "Type checking is slow"

Create separate configs for linting and type-checking:

```javascript
// eslint.config.js (fast, no type checking)
export default [
  ...agenticConfig,
  {
    languageOptions: {
      parserOptions: {
        project: false, // Disable type-aware linting for speed
      },
    },
  },
];
```

Use `tsc --noEmit` separately for type checking.

### "Rules are too strict"

That's the point! These rules catch real issues. But if you must:

1. Document WHY you're disabling a rule
2. Create a ticket to fix it properly later
3. Use per-file ignores for legacy code

## Rule Categories

### Security Rules (Plugin: eslint-plugin-security)

Detects common security vulnerabilities

### TypeScript Rules (Plugin: @typescript-eslint)

Enforces type safety and best practices

### Import Rules (Plugin: eslint-plugin-import)

Organizes imports and prevents cycles

### Promise Rules (Plugin: eslint-plugin-promise)

Ensures proper async/promise handling

### SonarJS Rules (Plugin: eslint-plugin-sonarjs)

Detects bugs and code smells, including duplicate code

### Unicorn Rules (Plugin: eslint-plugin-unicorn)

Modern JavaScript best practices

### Node.js Rules (Plugin: eslint-plugin-n)

Node.js-specific best practices

## Comparison with Python Package

| Python (Ruff/MyPy)          | JavaScript/TypeScript (ESLint)         |
| --------------------------- | -------------------------------------- |
| Bandit (S) - Security       | eslint-plugin-security                 |
| MyPy strict - Type checking | TypeScript strict + @typescript-eslint |
| F401, F841 - Dead code      | no-unused-vars, unicorn rules          |
| ERA - Commented code        | unicorn/no-commented-out-code          |
| C90 - Complexity            | complexity, sonarjs rules              |
| PLR - Refactoring           | sonarjs/no-identical-functions         |
| TRY - Error handling        | promise plugin rules                   |
| I - Import sorting          | eslint-plugin-import                   |
| ANN - Type hints            | @typescript-eslint explicit rules      |
| UP - Modern syntax          | unicorn modern patterns                |

## Contributing

Found an issue or want to suggest an improvement? Open an issue!

### Updating Rules

1. Explain why the change is needed
2. Show examples of false positives or conflicts
3. Consider impact on existing projects
4. Get team consensus

**Important:** Config changes affect all projects using these configs. Be conservative with changes.

## Support

- **Issues:** https://github.com/cajias/sca-skills/issues
- **Discussions:** Use GitHub Discussions for questions
- **Updates:** Check the repository for new versions

## License

MIT

## Maintainers

This configuration is maintained by the Engineering team. Changes require review and approval.
