# Troubleshooting

Common issues and how to fix them when using this ESLint configuration.

## "Too Many Errors"

### Problem

Running `eslint .` shows hundreds or thousands of errors.

### Solution

Fix errors incrementally by category:

```bash
# Fix auto-fixable issues first
npx eslint . --fix

# Then address categories one at a time
npx eslint . --rule '@typescript-eslint/explicit-function-return-type: error'
npx eslint . --rule 'complexity: error'
```

See the [Migration Guide](./MIGRATION.md) for a step-by-step approach.

## "Type Checking is Slow"

### Problem

ESLint takes forever to lint files, or your IDE becomes sluggish.

### Cause

Type-aware rules require TypeScript's type checker, which is CPU-intensive.

### Solution

#### Option 1: Disable Type-Aware Linting in Editor

Create separate configs for editor and CI:

```javascript
// eslint.config.js (fast, for editor)
import baseConfig from '@sca-skills/eslint-config/flat';

export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: false, // Disable type-aware linting for speed
      },
    },
  },
];
```

Then run type-aware linting separately:

```bash
npm run type-check
```

#### Option 2: Use ESLint Cache

```bash
# Add to package.json scripts
"lint": "eslint . --cache"
```

The cache file (`.eslintcache`) speeds up subsequent runs.

#### Option 3: Lint Changed Files Only

```bash
# In development - safe from command injection
git diff --name-only --diff-filter=ACMRTUXB -z | grep -zE '\.(ts|tsx|js|jsx)$' | xargs -0 npx eslint --
```

## "Rules Are Too Strict"

### Problem

Some rules flag valid code or make development difficult.

### Solution

#### Temporary: Disable Inline with Documentation

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Legacy API requires any
function processLegacyData(data: any): Result {
  // ...
}
```

Always document WHY you're disabling the rule.

#### Per-File: Relax Rules for Specific Files

```javascript
// eslint.config.js
export default [
  ...baseConfig,
  {
    files: ['src/legacy/**/*.ts'],
    rules: {
      complexity: 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
```

#### Project-Wide: Adjust Rule Severity

```javascript
// eslint.config.js
export default [
  ...baseConfig,
  {
    rules: {
      'max-lines-per-function': ['error', { max: 100 }], // Increase limit
      complexity: ['warn', 15], // Warn instead of error
    },
  },
];
```

**Important:** These rules catch real issues. Only relax them if you have a good reason and document why.

## Specific Rule Issues

### `@typescript-eslint/no-explicit-any`

#### Problem

Error: "Unexpected any. Specify a different type."

#### Cause

Using `any` type bypasses type checking.

#### Solution

**Preferred:** Use proper types:

```typescript
// ❌ Bad
function process(data: any) {
  return data.value;
}

// ✅ Good
interface Data {
  value: string;
}
function process(data: Data): string {
  return data.value;
}
```

**Acceptable:** Use `unknown` for truly unknown types:

```typescript
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

// Then narrow the type
const data = parseJson(text);
if (isValidData(data)) {
  // TypeScript knows data type here
}
```

### `complexity`

#### Problem

Error: "Function has complexity of 15. Maximum allowed is 10."

#### Cause

Function has too many independent paths (if/else, loops, etc.).

#### Solutions

**1. Extract functions:**

```typescript
// ❌ Complex
function processOrder(order: Order): Result {
  if (order.isPaid) {
    if (order.isShipped) {
      if (order.isDelivered) {
        // ...
      }
    }
  }
}

// ✅ Simplified
function processOrder(order: Order): Result {
  if (!canProcess(order)) return Result.invalid();
  return processValidOrder(order);
}

function canProcess(order: Order): boolean {
  return order.isPaid && order.isShipped && order.isDelivered;
}
```

**2. Use lookup tables:**

```typescript
// ❌ Complex switch
function getStatus(code: number): string {
  switch (code) {
    case 100:
      return 'Continue';
    case 200:
      return 'OK';
    // ... many cases
  }
}

// ✅ Lookup table
const STATUS_CODES: Record<number, string> = {
  100: 'Continue',
  200: 'OK',
  // ...
};

function getStatus(code: number): string {
  return STATUS_CODES[code] ?? 'Unknown';
}
```

### `n/no-path-concat`

#### Problem

Error: "Use path.join() instead of concatenating paths with +."

#### Cause

String concatenation for file paths breaks on Windows.

#### Solution

```typescript
// ❌ Bad - breaks on Windows
const configPath = __dirname + '/config.json';

// ✅ Good - cross-platform
import path from 'node:path';
const configPath = path.join(__dirname, 'config.json');
```

### `n/no-sync`

#### Problem

Warning: "Unexpected sync method: 'readFileSync'."

#### Cause

Synchronous operations block the event loop.

#### Solution

```typescript
// ❌ Blocking
const data = fs.readFileSync('file.txt', 'utf8');

// ✅ Non-blocking
const data = await fs.promises.readFile('file.txt', 'utf8');
```

**Note:** Sync operations are acceptable in:

- Build scripts
- CLI tools (not servers)
- Initialization code (before server starts)

Use inline disable for legitimate cases:

```typescript
// eslint-disable-next-line n/no-sync -- OK in build script
const config = fs.readFileSync('config.json', 'utf8');
```

### `no-unsanitized/property`

#### Problem

Error: "Unsafe assignment to innerHTML."

#### Cause

Directly setting `innerHTML` can cause XSS vulnerabilities.

#### Solution

```typescript
// ❌ XSS vulnerability
element.innerHTML = userInput;

// ✅ Safe - use textContent
element.textContent = userInput;

// ✅ Safe - sanitize HTML
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### `unicorn/prefer-module`

#### Problem

Error: "Use ESM export instead of module.exports."

#### Cause

Mixing CommonJS (`module.exports`) with ES modules.

#### Solution

```javascript
// ❌ CommonJS
module.exports = {
  foo: 'bar',
};

// ✅ ES modules
export default {
  foo: 'bar',
};
```

If you must use CommonJS (e.g., config files):

```javascript
// In eslint.config.js
export default [
  {
    files: ['*.config.js'],
    rules: {
      'unicorn/prefer-module': 'off',
    },
  },
];
```

## "ESLint Couldn't Find Config"

### Problem

Error: "No ESLint configuration found in /path/to/project"

### Cause

ESLint can't locate your config file.

### Solution

1. **Ensure config file exists:**

```bash
ls eslint.config.js  # For ESLint 9+
ls .eslintrc.js      # For ESLint 8
```

1. **Check file name:**
   - ESLint 9: `eslint.config.js` (flat config)
   - ESLint 8: `.eslintrc.js` or `.eslintrc.json`

2. **Verify config is valid:**

```bash
npx eslint --print-config src/index.ts
```

## "Cannot Find Module '@sca-skills/eslint-config'"

### Problem

Error when importing the config package.

### Cause

Package not installed or wrong package name.

### Solution

```bash
# Install the package
npm install --save-dev @sca-skills/eslint-config

# Verify it's installed
npm list @sca-skills/eslint-config
```

## "Parsing Error: Cannot Read File tsconfig.json"

### Problem

Error: "Cannot read file '/path/to/tsconfig.json'"

### Cause

ESLint's TypeScript parser can't find `tsconfig.json`.

### Solution

1. **Ensure tsconfig.json exists:**

```bash
ls tsconfig.json
```

1. **Update parserOptions:**

```javascript
export default [
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json', // Or ['./tsconfig.json', './tsconfig.test.json']
      },
    },
  },
];
```

1. **For monorepos:**

```javascript
parserOptions: {
  project: ['./packages/*/tsconfig.json'];
}
```

## Prettier and ESLint Conflicts

### Problem

Prettier and ESLint make conflicting changes.

### Cause

Overlapping rules between tools.

### Solution

This config already includes `eslint-config-prettier` to disable conflicting rules. If issues persist:

1. **Verify prettier config is loaded:**

```bash
npm list eslint-config-prettier
```

1. **Run Prettier first:**

```bash
npx prettier --write .
npx eslint . --fix
```

1. **Check .prettierrc.js matches ESLint:**

```javascript
// .prettierrc.js should match ESLint's formatting expectations
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  tabWidth: 2,
};
```

## "Import Not Found" False Positives

### Problem

Error: "Unable to resolve path to module" when import is valid.

### Cause

`eslint-plugin-import` can't resolve the path.

### Solution

1. **Install dependencies:**

```bash
npm install
```

1. **Check import resolver settings:**

```javascript
// eslint.config.js
export default [
  {
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
];
```

1. **Verify TypeScript paths:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## CI Failures

### Problem

Linting passes locally but fails in CI.

### Cause

Different Node versions, cached files, or different dependencies.

### Solution

1. **Match Node versions:**

```yaml
# .github/workflows/ci.yml
- uses: actions/setup-node@v4
  with:
    node-version: '20' # Match your local version
```

1. **Use `npm ci` instead of `npm install`:**

```yaml
- run: npm ci
```

1. **Don't cache .eslintcache:**

```yaml
- uses: actions/cache@v3
  with:
    path: node_modules
    # Don't cache .eslintcache
```

1. **Run same commands locally:**

```bash
# Exactly what CI runs
npm ci
npm run lint
npm run type-check
```

## Getting More Help

If you're still stuck:

1. **Check the error message carefully** - it usually tells you exactly what's wrong

2. **Search existing issues:**
   - [This project's issues](https://github.com/cajias/lint-configs/issues)
   - [ESLint issues](https://github.com/eslint/eslint/issues)
   - Plugin-specific issues

3. **Provide minimal reproduction:**
   - The exact error message
   - Your config file
   - Minimal code that triggers the error
   - Node/npm/package versions

4. **File an issue:**
   - Include all information from step 3
   - Explain what you've already tried
