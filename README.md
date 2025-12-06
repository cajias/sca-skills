# SCA Skills - Shareable Linting Configurations

Comprehensive, strict linting configurations for TypeScript/JavaScript, Python, and Markdown.
Designed to enforce best practices and catch issues in AI-generated code.

## Packages

This repository contains shareable linting configurations published to npm:

- **[@sca-skills/eslint-config](./typescript/)** - ESLint configuration with 220+ rules
- **[@sca-skills/markdownlint-config](./markdown/)** - Markdownlint configuration with 40+ rules
- **[Python configs](./python/)** - Ruff, MyPy, Black, and Pylint configurations

## Quick Start

### TypeScript/JavaScript

```bash
npm install --save-dev @sca-skills/eslint-config eslint typescript
```

Create `eslint.config.js`:

```javascript
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

### Markdown

```bash
npm install --save-dev @sca-skills/markdownlint-config markdownlint-cli
```

Create `.markdownlint.json`:

```json
{
  "extends": "@sca-skills/markdownlint-config"
}
```

### Python

```bash
pip install ruff mypy black pylint
```

Add to `pyproject.toml`:

```toml
[tool.ruff]
extend = "python/ruff.toml"
```

## Features

### TypeScript/JavaScript (@sca-skills/eslint-config)

- **220+ rules** across multiple ESLint plugins
- **Security** - XSS protection, eval prevention, unsafe regex detection
- **Node.js** - Path validation, callback handling, async patterns
- **React** - Hooks rules, accessibility (WCAG 2.1)
- **TypeScript** - Strict types, explicit returns, no `any`
- **Complexity** - Max cyclomatic 10, max params 5, max nesting 4

[Full documentation →](./typescript/README.md)

### Markdown (@sca-skills/markdownlint-config)

- **40+ markdown rules** for documentation quality
- **120 character line length** limit
- **ATX-style headings** required
- **Fenced code blocks** with language specifiers
- **Consistent list indentation** (2 spaces)

[Full documentation →](./markdown/README.md)

### Python

- **Ruff** - 40+ rule categories (E, F, I, B, W, C90, PLR, SIM, RET, ANN)
- **MyPy** - Strict type checking
- **Black** - Code formatting
- **Pylint** - Duplicate code detection (4+ line duplicates)

[Full documentation →](./python/README.md)

## Philosophy

> "If it's worth enabling, it's worth enforcing everywhere."

These configurations:

- Enforce strict quality standards for AI-generated code
- Only disable rules that conflict with formatters (Prettier/Black)
- Provide consistent standards across TypeScript, Python, and Markdown
- Mirror each other's strictness levels

## Comparison

| Feature                 | TypeScript        | Python      | Markdown  |
| ----------------------- | ----------------- | ----------- | --------- |
| Line length             | Configurable      | 100         | 120       |
| Type checking           | TypeScript strict | MyPy strict | N/A       |
| Security                | XSS, eval, regex  | Bandit (S)  | N/A       |
| Complexity              | Max 10            | Max 10      | N/A       |
| Dead code detection     | Yes               | Yes         | N/A       |
| Import sorting          | Yes               | Yes         | N/A       |
| Code formatting         | Prettier          | Black       | Prettier  |
| Documentation standards | N/A               | N/A         | 40+ rules |

## Claude Code Skills

**Note:** Claude Code skills have been moved to the [claude-skills](https://github.com/cajias/claude-skills) repository.

The claude-skills repository includes:

- SCA guardrails workflow skill
- README writer and evaluator skills
- And uses these linting configs as dependencies

## MCP Server

The MCP server in this repository provides lint/fix tools for Claude Code integration.

See [mcp-server/README.md](./mcp-server/README.md) for details.

## Contributing

Config changes affect all projects using these packages. Please:

1. Open an issue explaining the change
2. Show examples of false positives or conflicts
3. Consider impact on existing projects
4. Get consensus before submitting PR

## License

MIT

## Support

- **Issues:** [GitHub Issues](https://github.com/cajias/lint-configs/issues)
- **Discussions:** [GitHub Discussions](https://github.com/cajias/lint-configs/discussions)
