# sca-skills

Claude Code skills for static code analysis.

## Highlights

- **Strict configs** - ESLint, Ruff, MyPy with maximum strictness
- **MCP server** - Lint/fix tools for Claude Code
- **Claude skills** - README writer, README evaluator, guardrails workflow

## Usage

```bash
# TypeScript/JavaScript
npx eslint . --config eslint.config.js

# Python
ruff check .
mypy .
```

## Installation

### TypeScript/JavaScript

#### Option 1: Install from GitHub Packages

```bash
# 1. Authenticate with GitHub Packages (one-time setup)
# Create a Personal Access Token at https://github.com/settings/tokens
# with 'read:packages' scope, then:
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> ~/.npmrc

# 2. Configure npm to use GitHub Packages for @sca-skills scope
echo "@sca-skills:registry=https://npm.pkg.github.com" >> ~/.npmrc

# 3. Install the package
npm install -D @sca-skills/eslint-config

# 4. Use in your eslint.config.js
# import config from '@sca-skills/eslint-config';
# export default config;
```

#### Option 2: Install from GitHub Release

```bash
# Install from a specific version tag
npm install -D https://github.com/cajias/sca-skills/releases/download/v1.0.0/typescript.tgz

# Or install directly from Git
npm install -D git+https://github.com/cajias/sca-skills.git#subdirectory=typescript
```

#### Option 3: Copy Config Directly

Copy `typescript/eslint.config.js` to your project root, then install dependencies:

```bash
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-sonarjs eslint-plugin-security eslint-plugin-no-only-tests \
  prettier eslint-config-prettier
```

### Python

#### Option 1: Install from GitHub Release

```bash
# Install from a specific version tag
pip install git+https://github.com/cajias/sca-skills.git@v1.0.0#subdirectory=python

# Or install from the latest main branch
pip install git+https://github.com/cajias/sca-skills.git#subdirectory=python

# Then use in your project
# from lint_configs import get_python_config_path
```

#### Option 2: Install from PyPI (if published)

```bash
pip install sca-skills
```

#### Option 3: Copy Config Directly

Copy `python/pyproject.toml` linter sections to your project, then install:

```bash
pip install ruff mypy black pylint
```

## What's Included

### Python

- **Ruff** - 40+ rule categories
- **MyPy** - Strict type checking
- **Black** - Code formatting
- **Pylint** - Duplicate code detection

### TypeScript/JavaScript

- **ESLint** - 200+ rules
- **Prettier** - Code formatting
- **Security plugins** - Vulnerability detection
- **Complexity limits** - Max 10

See [Python README](./python/README.md) and [TypeScript README](./typescript/README.md) for details.

## MCP Server

An MCP server is included for Claude Code integration:

```bash
# Clone the repo
git clone https://github.com/cajias/sca-skills.git
cd sca-skills/mcp-server
npm install && npm run build

# Add to Claude Code
claude mcp add sca -- node /path/to/sca-skills/mcp-server/dist/server.js
```

Provides `lint` and `fix` tools for automated code quality workflows.

## CI/CD Integration

```yaml
# .github/workflows/lint.yml
name: Lint
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install ruff mypy
      - run: ruff check . && mypy .
```

## Contributing

1. Open an issue explaining the change
2. Get consensus
3. Make the change and open a PR

Config changes affect all projects using these configs. Be conservative.

## License

MIT
