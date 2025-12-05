// Canonical ESLint Configuration (Flat Config - ESLint 9+)
// This configuration enforces strict code quality standards with minimal ignores.
// Mirrors the Python package rules adapted for JavaScript/TypeScript.

const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const securityPlugin = require('eslint-plugin-security');
const sonarjsPlugin = require('eslint-plugin-sonarjs');
const unicornPlugin = require('eslint-plugin-unicorn');
const promisePlugin = require('eslint-plugin-promise');
const nodePlugin = require('eslint-plugin-n');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const noOnlyTestsPlugin = require('eslint-plugin-no-only-tests');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const noUnsanitizedPlugin = require('eslint-plugin-no-unsanitized');

module.exports = [
  {
    // Files to lint
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],

    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.examples.json'],
      },
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: importPlugin,
      security: securityPlugin,
      sonarjs: sonarjsPlugin,
      unicorn: unicornPlugin,
      promise: promisePlugin,
      n: nodePlugin,
      prettier: prettierPlugin,
      'no-only-tests': noOnlyTestsPlugin,
      'no-unsanitized': noUnsanitizedPlugin,
    },

    rules: {
      // ============================================================
      // SECURITY RULES (mirrors Python Bandit 'S' rules)
      // ============================================================
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-possible-timing-attacks': 'error',
      'security/detect-pseudoRandomBytes': 'error',

      // XSS Protection - Prevent unsafe DOM manipulation
      'no-unsanitized/method': 'error', // Disallow unsafe methods like document.write(), insertAdjacentHTML()
      'no-unsanitized/property': 'error', // Disallow unsafe property assignments like innerHTML, outerHTML

      // ============================================================
      // TYPESCRIPT STRICT CHECKS (mirrors Python ANN/mypy)
      // ============================================================
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/promise-function-async': 'error',

      // ============================================================
      // DEAD CODE DETECTION (mirrors Python F401, F841, ERA, ARG)
      // ============================================================
      'no-unused-vars': 'off', // Use TypeScript version
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-expressions': 'error',
      'no-unreachable': 'error',
      'no-constant-condition': 'error',
      'no-useless-return': 'error',
      'no-useless-escape': 'error',
      // Note: unicorn/no-commented-out-code requires v51+ (commented code detection)

      // ============================================================
      // COMPLEXITY LIMITS (mirrors Python C90, PLR)
      // ============================================================
      complexity: ['error', 10], // Max cyclomatic complexity
      'max-depth': ['error', 4], // Max nesting depth
      'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
      'max-params': ['error', 5], // Max function parameters
      'max-statements': ['error', 50], // Max statements per function
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-identical-functions': 'error', // Duplicate code detection

      // ============================================================
      // ERROR HANDLING (mirrors Python TRY, BLE)
      // ============================================================
      'no-throw-literal': 'error',
      '@typescript-eslint/no-throw-literal': 'error',
      // Note: @typescript-eslint/only-throw-error requires v7+
      'promise/catch-or-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',
      'promise/always-return': 'error',
      'promise/no-nesting': 'error',

      // ============================================================
      // CODE QUALITY & BEST PRACTICES
      // ============================================================

      // Avoid common bugs (mirrors Python B, PIE)
      eqeqeq: ['error', 'always'], // Require === and !==
      'no-var': 'error', // Use let/const
      'prefer-const': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      '@typescript-eslint/no-implied-eval': 'error',

      // Naming conventions (mirrors Python N)
      camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE', 'PascalCase'],
        },
      ],

      // Async patterns (JavaScript-specific)
      '@typescript-eslint/require-await': 'error',
      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'error',
      'require-atomic-updates': 'error',

      // Import organization (mirrors Python I, isort)
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      'import/no-cycle': 'error',
      'import/newline-after-import': 'error',

      // Modern JavaScript/TypeScript (mirrors Python UP)
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'object-shorthand': ['error', 'always'],
      'unicorn/prefer-module': 'error',
      'unicorn/prefer-node-protocol': 'error',

      // ============================================================
      // NODE.JS BEST PRACTICES (critical for backend applications)
      // ============================================================

      // Deprecated APIs and process management
      'n/no-deprecated-api': 'error',
      'n/no-process-exit': 'error',

      // Path handling (prevent cross-platform issues)
      'n/no-path-concat': 'error', // Use path.join() instead of string concatenation

      // Module management (catch issues at lint time)
      'n/no-missing-import': 'error', // Detect non-existent imports
      'n/no-missing-require': 'error', // Detect non-existent requires
      'n/no-extraneous-import': 'error', // Ensure dependencies are listed in package.json
      'n/no-extraneous-require': 'error',

      // Publishing safety
      'n/no-unpublished-import': 'error', // Prevent importing dev dependencies in production code
      'n/no-unpublished-require': 'error',

      // Callback error handling (prevent silent failures)
      'n/handle-callback-err': 'error', // Require error handling in callbacks
      'n/no-callback-literal': 'error', // Enforce error-first callback pattern

      // Module loading best practices
      'n/no-new-require': 'error', // Disallow new require()
      'n/exports-style': ['error', 'module.exports'], // Consistent export style

      // Performance warnings
      'n/no-sync': 'warn', // Warn about blocking operations (fs.readFileSync, etc.)

      // Modern Node.js patterns
      'n/prefer-promises/dns': 'error', // Use promise-based DNS
      'n/prefer-promises/fs': 'error', // Use promise-based file system APIs
      'n/hashbang': 'error', // Correct shebang for executable scripts

      // Prevent common issues
      'no-console': 'warn', // Warn on console.log (allow with comment)
      'no-debugger': 'error',
      'no-alert': 'error',
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/no-use-of-empty-return-value': 'error',
      'sonarjs/prefer-immediate-return': 'error',

      // Unicorn best practices
      'unicorn/better-regex': 'error',
      'unicorn/catch-error-name': 'error',
      'unicorn/consistent-destructuring': 'error',
      'unicorn/consistent-function-scoping': 'error',
      'unicorn/custom-error-definition': 'error',
      'unicorn/error-message': 'error',
      'unicorn/escape-case': 'error',
      'unicorn/expiring-todo-comments': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/new-for-builtins': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/no-array-for-each': 'error',
      'unicorn/no-array-push-push': 'error',
      'unicorn/no-console-spaces': 'error',
      'unicorn/no-empty-file': 'error',
      'unicorn/no-instanceof-array': 'error',
      'unicorn/no-invalid-remove-event-listener': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/no-nested-ternary': 'error',
      'unicorn/no-new-array': 'error',
      'unicorn/no-new-buffer': 'error',
      'unicorn/no-null': 'error',
      'unicorn/no-object-as-default-parameter': 'error',
      'unicorn/no-static-only-class': 'error',
      'unicorn/no-thenable': 'error',
      'unicorn/no-this-assignment': 'error',
      'unicorn/no-unreadable-array-destructuring': 'error',
      'unicorn/no-unreadable-iife': 'error',
      'unicorn/no-useless-fallback-in-spread': 'error',
      'unicorn/no-useless-length-check': 'error',
      'unicorn/no-useless-promise-resolve-reject': 'error',
      'unicorn/no-useless-spread': 'error',
      'unicorn/no-useless-switch-case': 'error',
      'unicorn/no-useless-undefined': 'error',
      'unicorn/no-zero-fractions': 'error',
      'unicorn/number-literal-case': 'error',
      'unicorn/prefer-add-event-listener': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-array-flat': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-array-index-of': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-at': 'error',
      'unicorn/prefer-code-point': 'error',
      'unicorn/prefer-date-now': 'error',
      'unicorn/prefer-default-parameters': 'error',
      'unicorn/prefer-event-target': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-modern-math-apis': 'error',
      'unicorn/prefer-negative-index': 'error',
      'unicorn/prefer-number-properties': 'error',
      'unicorn/prefer-object-from-entries': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-prototype-methods': 'error',
      'unicorn/prefer-set-has': 'error',
      'unicorn/prefer-spread': 'error',
      'unicorn/prefer-string-replace-all': 'error',
      'unicorn/prefer-string-slice': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-string-trim-start-end': 'error',
      'unicorn/prefer-type-error': 'error',
      'unicorn/throw-new-error': 'error',

      // ============================================================
      // PRETTIER INTEGRATION
      // ============================================================
      'prettier/prettier': 'error',
    },
  },

  // Test files - relaxed rules (mirrors Python test file ignores)
  {
    files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}', '**/test/**/*', '**/tests/**/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'sonarjs/no-duplicate-string': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'unicorn/no-null': 'off',
      // Prevent .only() in tests from being committed
      'no-only-tests/no-only-tests': 'error',
    },
  },

  // Scripts and configuration files - relaxed rules
  {
    files: ['**/*.config.{js,ts}', '**/scripts/**/*'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'unicorn/prefer-module': 'off',
    },
  },

  // React/JSX files - additional rules for React projects
  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    rules: {
      // React hooks rules (critical for correctness)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Accessibility rules
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/no-access-key': 'error',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-distracting-elements': 'error',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/scope': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
      // React best practices
      'react/jsx-no-target-blank': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/require-render-return': 'error',
    },
  },

  // Prettier integration - disable conflicting rules
  prettierConfig,
];
