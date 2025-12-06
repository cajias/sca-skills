# ESLint Configuration for AI-Generated Code

Comprehensive ESLint configuration for JavaScript/TypeScript projects with strict rules for security, code quality,
and maintainability. Designed to keep AI-generated code in check with 220+ rules across multiple categories.

## Highlights

- **🔒 Security** - XSS protection, eval prevention, timing attacks, unsafe regex
- **🚀 Node.js** - Path validation, callback handling, dependency checking, async APIs
- **⚛️ React** - Hooks rules, accessibility (WCAG), best practices
- **🎯 TypeScript** - Strict types, explicit returns, no `any`
- **📊 Complexity** - Max cyclomatic 10, max params 5, max nesting 4
- **🧹 Quality** - Dead code detection, duplicate code, modern patterns

Compatible with ESLint 9 flat config and ESLint 8 legacy config.

## Quick Start

### Installation

```bash
npm install --save-dev @sca-skills/eslint-config
```

### Basic Setup

**For ESLint 9+ (Flat Config - Recommended):**

```javascript
// eslint.config.js
import config from '@sca-skills/eslint-config/flat';

export default [
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
];
```

**For ESLint 8 (Legacy Config):**

```javascript
// .eslintrc.js
module.exports = {
  extends: ['@sca-skills/eslint-config/legacy'],
  parserOptions: {
    project: './tsconfig.json',
  },
};
```

### Usage

```bash
# Lint your code
npx eslint .

# Auto-fix issues
npx eslint . --fix

# Type check
npx tsc --noEmit
```

## What This Configuration Enforces

### Type Safety

```typescript
// ❌ Bad - no return type
function calculate(a: number, b: number) {
  return a + b;
}

// ✅ Good - explicit return type
function calculate(a: number, b: number): number {
  return a + b;
}
```

### Security

```typescript
// ❌ Bad - XSS vulnerability
element.innerHTML = userInput;

// ✅ Good - safe alternatives
element.textContent = userInput;
// or
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Node.js Best Practices

```typescript
// ❌ Bad - path concatenation breaks on Windows
const config = __dirname + '/config.json';

// ✅ Good - cross-platform
import path from 'node:path';
const config = path.join(__dirname, 'config.json');
```

### Async Patterns

```typescript
// ❌ Bad - floating promise
someAsyncFunction();

// ✅ Good - proper handling
await someAsyncFunction();
```

### Complexity Limits

```typescript
// ❌ Bad - too many parameters
function process(a, b, c, d, e, f) {
  // More than 5 parameters
}

// ✅ Good - use config object
interface ProcessConfig {
  a: string;
  b: number;
  c: boolean;
}
function process(config: ProcessConfig) {
  // Single parameter, clear interface
}
```

## Package Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . && prettier --check .",
    "lint:fix": "eslint . --fix && prettier --write .",
    "type-check": "tsc --noEmit"
  }
}
```

## CI/CD Integration

```yaml
# .github/workflows/lint.yml
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
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
```

## Customization

### Relax Specific Rules

```javascript
// eslint.config.js
import config from '@sca-skills/eslint-config/flat';

export default [
  ...config,
  {
    rules: {
      'max-lines-per-function': ['error', { max: 100 }], // Increase limit
      complexity: ['warn', 15], // Warn instead of error
    },
  },
];
```

### Per-Directory Rules

```javascript
export default [
  ...config,
  {
    files: ['src/legacy/**/*.ts'],
    rules: {
      complexity: 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
```

### Inline Overrides

Use sparingly and document why:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Legacy API requires any
function processLegacy(data: any): Result {
  // ...
}
```

## Rule Categories

### Security (eslint-plugin-security, eslint-plugin-no-unsanitized)

- XSS protection (innerHTML, document.write)
- Eval detection
- Regex injection
- Timing attacks
- CSRF prevention
- Insecure randomness

### Node.js (eslint-plugin-n)

- Cross-platform path handling
- Module dependency validation
- Callback error handling
- Performance (sync operation warnings)
- Publishing safety
- Modern promise-based APIs

### TypeScript (@typescript-eslint)

- Explicit return types
- No implicit `any`
- Strict boolean expressions
- No floating promises
- Proper async handling

### React (eslint-plugin-react, react-hooks, jsx-a11y)

- Hooks rules (exhaustive deps)
- Accessibility (WCAG 2.1)
- JSX best practices
- Component patterns

### Code Quality (eslint-plugin-sonarjs, eslint-plugin-unicorn)

- Duplicate code detection
- Cognitive complexity limits
- Modern JavaScript patterns
- Dead code detection

### Promises (eslint-plugin-promise)

- Catch or return
- No nesting
- Proper error handling

## Philosophy

> "If it's worth enabling, it's worth enforcing everywhere."

This configuration:

- Enforces strict quality standards for AI-generated code
- Only disables rules that conflict with Prettier
- Mirrors the Python package rule set (Ruff + MyPy + Bandit)
- Provides per-file relaxation for test files and config files

## Comparison with Python Package

| Python (Ruff/MyPy)          | JavaScript/TypeScript (ESLint)                        |
| --------------------------- | ----------------------------------------------------- |
| Bandit (S) - Security       | eslint-plugin-security + eslint-plugin-no-unsanitized |
| MyPy strict - Type checking | TypeScript strict + @typescript-eslint                |
| F401, F841 - Dead code      | no-unused-vars, unicorn rules                         |
| C90 - Complexity            | complexity, sonarjs rules                             |
| PLR - Refactoring           | sonarjs/no-identical-functions                        |
| TRY - Error handling        | promise plugin rules                                  |
| I - Import sorting          | eslint-plugin-import                                  |
| ANN - Type hints            | @typescript-eslint explicit rules                     |
| UP - Modern syntax          | unicorn modern patterns                               |

## Advanced Guides

- **[Migration Guide](./docs/MIGRATION.md)** - Apply to existing projects
- **[IDE Setup](./docs/IDE_SETUP.md)** - VS Code, WebStorm, Vim, Emacs
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues and fixes

## Dependencies

This package includes all required ESLint plugins. Peer dependencies:

```bash
npm install --save-dev \
  eslint@">=8.0.0" \
  typescript@">=5.0.0" \
  prettier@"^3.1.0"
```

All plugins are bundled as dependencies for easier installation.

## Support

- **Issues:** [GitHub Issues](https://github.com/cajias/lint-configs/issues)
- **Discussions:** [GitHub Discussions](https://github.com/cajias/lint-configs/discussions)

## Contributing

Config changes affect all projects using this package. Please:

1. Open an issue explaining the change
2. Show examples of false positives or conflicts
3. Consider impact on existing projects
4. Get consensus before submitting PR

## License

MIT

## Maintainers

Maintained by the Engineering team. Changes require review and approval.
