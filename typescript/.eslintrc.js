// Canonical ESLint Configuration (Legacy Format - ESLint 8.x)
// This configuration enforces strict code quality standards with minimal ignores.
// Mirrors the Python package rules adapted for JavaScript/TypeScript.

module.exports = {
  root: true,
  
  parser: '@typescript-eslint/parser',
  
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.examples.json'],
  },

  env: {
    node: true,
    es2022: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:security/recommended',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:n/recommended',
    'prettier', // Must be last to override conflicting rules
  ],

  plugins: [
    '@typescript-eslint',
    'import',
    'security',
    'sonarjs',
    'unicorn',
    'promise',
    'n',
  ],

  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
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

    // ============================================================
    // TYPESCRIPT STRICT CHECKS (mirrors Python ANN/mypy)
    // ============================================================
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: false,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
    }],
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
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-unused-expressions': 'error',
    'no-unreachable': 'error',
    'no-constant-condition': 'error',
    'no-useless-return': 'error',
    'no-useless-escape': 'error',
    // Note: unicorn/no-commented-out-code requires v51+ (commented code detection)
    
    // ============================================================
    // COMPLEXITY LIMITS (mirrors Python C90, PLR)
    // ============================================================
    'complexity': ['error', 10], // Max cyclomatic complexity
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
    'eqeqeq': ['error', 'always'], // Require === and !==
    'no-var': 'error', // Use let/const
    'prefer-const': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    
    // Naming conventions (mirrors Python N)
    'camelcase': ['error', { properties: 'never', ignoreDestructuring: true }],
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
    'import/order': ['error', {
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
        'type',
      ],
      'newlines-between': 'always',
      'alphabetize': { order: 'asc', caseInsensitive: true },
    }],
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

    // Node.js best practices
    'n/no-deprecated-api': 'error',
    'n/no-process-exit': 'error',

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
  },

  overrides: [
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
  ],
};
