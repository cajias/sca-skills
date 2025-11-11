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

## Coming Soon

- 🟦 **TypeScript/JavaScript** - ESLint, Prettier, TypeScript strict mode
- ⚙️ **Go** - golangci-lint with comprehensive linters
- 🦀 **Rust** - Clippy with all lints
- ☕ **Java** - Checkstyle, SpotBugs, PMD
- 💎 **Ruby** - RuboCop with strict defaults

## Quick Start

### Python Projects (Recommended Method)

Use Ruff's `extend` feature with version-managed configuration:

```bash
# 1. Install the package (like any dependency)
pip install agentic-guardrails

# 2. Get the config path for your pyproject.toml
python -c "from lint_configs import get_ruff_config_path; print(f'[tool.ruff]\nextend = \"{get_ruff_config_path()}\"')"

# 3. Copy the output to your pyproject.toml
```

**To update all projects:**
```bash
pip install --upgrade agentic-guardrails
# All projects automatically use the new config!
```

**What this gives you:**
- ✅ Version managed like dependencies (pip install, pip upgrade)
- ✅ Works in CI/CD automatically with other dependencies
- ✅ Zero duplication across projects
- ✅ Pin versions or upgrade as needed
- ✅ No manual curl commands

See the [Python README](./python/README.md) for complete setup instructions.

### Alternative: Direct Copy

Copy the configuration file directly into your project:

```bash
# Python
curl https://raw.githubusercontent.com/cajias/lint-configs/main/python/pyproject-linters.toml -o pyproject.toml

# Or copy the [tool.*] sections into your existing pyproject.toml
```

**Benefits:**
- Complete control over configuration
- No dependencies
- Easy to customize per-project

### Method 3: GitHub Template

Use this repository as a GitHub template when creating new projects.

**Benefits:**
- Start new projects with configs already set up
- Includes all documentation

## Structure

```
lint-configs/
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
├── typescript/                        # Coming soon
│   ├── README.md
│   ├── package.json
│   ├── .eslintrc.js
│   ├── .prettierrc.js
│   └── tsconfig.json
├── go/                                # Coming soon
│   ├── README.md
│   └── .golangci.yml
└── rust/                              # Coming soon
    ├── README.md
    └── clippy.toml
```

## Usage Examples

### For New Projects

When starting a new project:

```bash
# 1. Create your project
mkdir my-new-project && cd my-new-project
git init

# 2. Add lint-configs as a dependency
echo 'agentic-guardrails' >> requirements-dev.txt
pip install -r requirements-dev.txt

# 3. Extend the config in your pyproject.toml
cat >> pyproject.toml << 'EOF'
[tool.ruff]
line-length = 120  # or keep default from package
extend = "python/pyproject-linters.toml"  # Will find in site-packages

[tool.ruff.lint.isort]
known-first-party = ["my_package"]  # Customize for your project

[tool.coverage.run]
source = ["my_package"]  # Customize for your project
EOF

# 4. Commit
git add .
git commit -m "Add linting configuration"
```

### For Existing Projects

Gradually adopt the configuration:

```bash
# 1. Install the package
pip install agentic-guardrails

# 2. Add to your pyproject.toml
# Add this line to your [tool.ruff] section:
# extend = "python/pyproject-linters.toml"

# 3. See what needs to be fixed
ruff check .
mypy .

# 4. Fix incrementally
ruff check . --fix              # Auto-fix what's possible
ruff check . --select=I --fix   # Fix imports
# ... continue with other categories

# 5. Commit when ready
git commit -am "Apply canonical linting configuration"
```

### Keeping Configs Up to Date

Update all projects to the latest config:

```bash
# Update the package
pip install --upgrade agentic-guardrails

# Test changes
ruff check .
mypy .

# Commit if all looks good
pip freeze > requirements-dev.txt
git add requirements-dev.txt
git commit -m "Update linting configuration to v1.1.0"
```

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

Use per-file ignores:

```toml
[tool.ruff.lint.per-file-ignores]
"legacy/**/*.py" = ["ANN", "D"]  # Relax for legacy code
```

But create tickets to gradually improve legacy code.

## Publishing the Package

### Automated Publishing with GitHub Actions (Recommended)

The repository includes a GitHub Actions workflow that automatically publishes to GitHub Packages.

**Quick start (no setup required!):**

```bash
# 1. Update version number
# Edit python/pyproject.toml and python/lint_configs/__init__.py

# 2. Commit and tag
git add .
git commit -m "Bump version to 1.0.1"
git tag v1.0.1
git push origin v1.0.1

# 3. GitHub Actions automatically:
#    ✅ Builds the package
#    ✅ Publishes to GitHub Packages
#    ✅ Creates a GitHub Release
#    ✅ (Optional) Also publishes to PyPI if token is set
```

**No setup required!** GitHub Packages uses the automatic `GITHUB_TOKEN`.

**Optional: Also publish to PyPI:**

1. Create a PyPI API token at https://pypi.org/manage/account/token/
2. Add it to GitHub repository secrets as `PYPI_API_TOKEN`
3. See [.github/workflows/README.md](.github/workflows/README.md) for details

### Manual Publishing

#### To GitHub Packages:

```bash
cd python/

# 1. Update version
# Edit pyproject.toml and lint_configs/__init__.py

# 2. Build the package
python -m build

# 3. Publish to GitHub Packages
export GITHUB_TOKEN=your_personal_access_token
twine upload --repository-url https://pypi.pkg.github.com/cajias dist/*

# 4. Tag the release (from repo root)
cd ..
git tag v1.0.0
git push origin v1.0.0
```

#### To PyPI (public):

```bash
cd python/

# 1. Build
python -m build

# 2. Upload to TestPyPI first (recommended)
twine upload --repository testpypi dist/*

# 3. Test installation
pip install --index-url https://test.pypi.org/simple/ agentic-guardrails

# 4. If all looks good, upload to PyPI
twine upload dist/*
```

### Alternative: Install from Git

If you don't want to publish to PyPI, install directly from Git:

```bash
pip install git+https://github.com/cajias/lint-configs.git@main
```

In `requirements-dev.txt`:
```
agentic-guardrails @ git+https://github.com/cajias/lint-configs.git@v1.0.0
```

## Support

- **Issues:** Open an issue for questions or problems
- **Discussions:** Use GitHub Discussions for general questions
- **Contributing:** See CONTRIBUTING.md (coming soon)

## License

MIT

## Maintainers

This repository is maintained by the Engineering team. Changes require review and approval from at least 2 maintainers.
