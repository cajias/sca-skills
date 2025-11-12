# Canonical Linter Configurations

A collection of strict, opinionated linter configurations for multiple languages, designed to enforce code quality and consistency across all projects in an organization.

## Philosophy

**If it's worth enabling, it's worth enforcing everywhere.**

This repository provides canonical linting configurations with:
- **Minimal ignores** - Only rules that conflict with formatters are ignored
- **Maximum strictness** - All quality checks enabled
- **Language consistency** - Similar principles across all languages
- **Easy adoption** - Simple to integrate into any project

## Available Configurations

### 🐍 [Python](./python/)

Comprehensive linting for Python projects using:
- **Ruff** - 40+ rule categories enabled
- **MyPy** - Strict mode type checking
- **Black** - Code formatting (120 char lines)
- **Pylint** - Duplicate code detection (4+ lines)
- **80% coverage** required

**Key features:**
- Type hints everywhere
- Docstrings required
- Security checks (Bandit)
- Complexity limits (max 10)
- Dead code detection (unused imports, variables, arguments, commented code)
- Code clone detection (min 4 similar lines)

[View Python README →](./python/README.md)

### 🟦 [TypeScript/JavaScript](./typescript/)

Comprehensive linting for JavaScript/TypeScript projects using:
- **ESLint** - 200+ rules from multiple plugins
- **TypeScript** - Strict mode type checking
- **Prettier** - Code formatting (120 char lines)
- **Multiple plugins** - Security, complexity, duplicate code detection

**Key features:**
- Explicit return types required
- No implicit any
- Security vulnerability detection
- Complexity limits (max 10)
- Dead code detection (unused vars, imports, commented code)
- Duplicate code detection
- Proper async/promise handling

[View TypeScript/JavaScript README →](./typescript/README.md)

## Coming Soon

- ⚙️ **Go** - golangci-lint with comprehensive linters
- 🦀 **Rust** - Clippy with all lints
- ☕ **Java** - Checkstyle, SpotBugs, PMD
- 💎 **Ruby** - RuboCop with strict defaults

## Quick Start

Each language has its own setup method. See the language-specific README for detailed instructions:

- **[Python Setup →](./python/README.md)** - Install via pip, extend configurations in pyproject.toml
- **[TypeScript/JavaScript Setup →](./typescript/README.md)** - Install via npm, extend ESLint configs

### Common Installation Methods

All language configurations support similar installation patterns:

1. **Package Manager** - Install as a dependency (recommended)
2. **Direct Copy** - Copy configuration files into your project
3. **GitHub Template** - Use this repository as a template for new projects

See language-specific READMEs for complete setup instructions and examples.

## Structure

```
agentic-guardrails/
├── README.md                          # This file
├── LICENSE                            # MIT License
├── python/                            # Python linter configs
│   ├── README.md                      # Python-specific guide
│   ├── pyproject.toml                 # Pip package configuration
│   ├── MANIFEST.in                    # Package manifest
│   ├── pyproject-linters.toml         # Linter rules (source)
│   └── lint_configs/                  # Pip package contents
│       ├── __init__.py                # Package entry point
│       └── python/
│           └── pyproject-linters.toml # Linter rules (bundled)
├── typescript/                        # TypeScript/JavaScript configs
│   ├── README.md                      # TypeScript-specific guide
│   ├── package.json                   # NPM package configuration
│   ├── index.js                       # Package entry point
│   ├── eslint.config.js               # ESLint flat config (ESLint 9+)
│   ├── .eslintrc.js                   # ESLint legacy config
│   ├── .prettierrc.js                 # Prettier configuration
│   └── tsconfig.json                  # TypeScript strict config
├── go/                                # Coming soon
│   ├── README.md
│   └── .golangci.yml
└── rust/                              # Coming soon
    ├── README.md
    └── clippy.toml
```

## Usage

For detailed usage instructions, including examples for new projects, existing projects, and keeping configurations up to date, see the language-specific READMEs:

- **[Python Usage →](./python/README.md)** - pip install, ruff/mypy commands, CI/CD integration
- **[TypeScript/JavaScript Usage →](./typescript/README.md)** - npm install, eslint commands, IDE setup

## Configuration Principles

All configurations in this repository follow these principles:

### 1. Minimal Ignores

Only ignore rules that:
- Conflict with code formatters (e.g., line length when using Black/Prettier)
- Are fundamentally broken or produce false positives

### 2. Maximum Enforcement

Enable all available quality checks:
- Type safety
- Security scanning
- Complexity limits
- Code duplication detection
- Style consistency

### 3. Smart Exceptions

Reasonable per-file ignores for:
- Test files (allow asserts, magic values)
- Generated code (skip most checks)
- Scripts (allow prints, simple structure)

### 4. Coverage Requirements

Enforce minimum test coverage:
- Python: 80%
- TypeScript: 80%
- Go: 80%
- Others: TBD

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/lint.yml`:

```yaml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true  # Important: fetch lint-configs submodule

      - name: Set up environment
        uses: actions/setup-python@v5
        with:
          python-version: '3.9'

      - name: Install dependencies
        run: pip install -e ".[dev]"

      - name: Run linters
        run: |
          black --check .
          ruff check .
          mypy .
          pytest --cov
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
lint:
  image: python:3.9
  before_script:
    - git submodule update --init
    - pip install -e ".[dev]"
  script:
    - black --check .
    - ruff check .
    - mypy .
    - pytest --cov
```

## Contributing

### Adding a New Language

1. Create a directory: `mkdir <language>/`
2. Add canonical config files
3. Create `<language>/README.md` with:
   - Quick start instructions
   - Configuration overview
   - Usage examples
   - Customization guide
4. Update this root README with the new language
5. Open a PR

### Updating Existing Configs

1. Open an issue explaining:
   - Why the change is needed
   - Examples of false positives or conflicts
   - Impact on existing projects
2. Get consensus from the team
3. Make the change
4. Update the language-specific README
5. Open a PR

**Important:** Config changes affect all projects using these configs. Be conservative with changes.

## Language-Specific Guides

Each language directory contains:

- **`README.md`** - Detailed usage guide for that language
- **Config files** - The canonical configuration
- **Examples** - Sample projects using the config

See the language-specific READMEs for:
- Installation instructions
- Tool versions
- Customization options
- Migration guides
- Troubleshooting

## Philosophy: Why Strict Linting?

### Benefits

1. **Catch bugs early** - Type checking and linting catch issues before code review
2. **Consistent code style** - No bikeshedding in reviews
3. **Easier onboarding** - New developers know what's expected
4. **Better refactoring** - Type hints enable safe changes
5. **Living documentation** - Code is self-documenting
6. **Prevent technical debt** - Complexity and duplication caught early

### Trade-offs

- **Initial migration cost** - Existing projects need updates
- **Learning curve** - Developers must learn stricter patterns
- **False positives** - Occasionally need `# noqa` or similar

We believe the long-term benefits far outweigh these costs.

## FAQ

### Why not just use defaults?

Defaults are often too permissive. This leads to:
- Inconsistent code across projects
- Issues caught late in code review
- Technical debt accumulation

### Can I customize for my project?

Yes! These are starting points. You can:
- Add per-file ignores for special cases
- Adjust complexity thresholds
- Add project-specific rules

But document why and consider if it should be in the canonical config.

### What if I disagree with a rule?

1. Try following the rule for a while
2. If it's genuinely problematic, open an issue
3. Discuss with the team
4. Update the canonical config if consensus is reached

### How do I handle legacy code?

Use per-file ignores to gradually adopt strict rules. Each language configuration supports this pattern. See the language-specific READMEs for examples and syntax.

Create tickets to gradually improve legacy code over time.

## Publishing Packages

### Automated Publishing with GitHub Actions

The repository includes a GitHub Actions workflow that automatically publishes packages when a new release tag is created:

```bash
# 1. Update version numbers in language-specific files
# 2. Commit and tag
git add .
git commit -m "Bump version to 1.0.1"
git tag v1.0.1
git push origin v1.0.1

# 3. GitHub Actions automatically:
#    ✅ Builds all packages
#    ✅ Publishes to package registries
#    ✅ Creates a GitHub Release
```

**Supported registries:**
- Python: PyPI and GitHub Packages
- TypeScript/JavaScript: npm and GitHub Packages

See [.github/workflows/README.md](.github/workflows/README.md) for configuration details.

## Support

- **Issues:** Open an issue for questions or problems
- **Discussions:** Use GitHub Discussions for general questions
- **Contributing:** See CONTRIBUTING.md (coming soon)

## License

MIT

## Maintainers

This repository is maintained by the Engineering team. Changes require review and approval from at least 2 maintainers.
