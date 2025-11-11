# Python Linting Configuration

Canonical linting configuration for Python projects with minimal ignores and comprehensive rule coverage.

## Quick Start

The recommended way to use this configuration across all your projects.

## Method 1: Extend from Package (Recommended)

Use Ruff's `extend` feature with the config bundled in the Python package. This approach provides version-managed configuration just like your other dependencies.

### Setup

```bash
# 1. Install (or add to requirements-dev.txt)
pip install agentic-guardrails

# 2. Get the config path and add to your pyproject.toml
python -c "from lint_configs import get_ruff_config_path; print(f'[tool.ruff]\nextend = \"{get_ruff_config_path()}\"')"
```

Copy the output into your `pyproject.toml`, then add your project-specific settings:

```toml
[tool.ruff]
extend = "/path/to/site-packages/lint_configs/ruff.toml"  # Path from command above
target-version = "py39"  # Your Python version

[tool.ruff.lint.isort]
known-first-party = ["your_package"]  # Add your package name
```

### Updating All Projects

When you want to update the configuration:

```bash
# Just upgrade the package (like any dependency)
pip install --upgrade agentic-guardrails

# All projects automatically use the new config - no per-project changes needed!
```

**Benefits:**
- ✅ **Version managed**: Use pip to manage versions just like dependencies
- ✅ **Automatic updates**: `pip install --upgrade` updates all projects
- ✅ **No version drift**: Lock versions in requirements.txt
- ✅ **Works in CI/CD**: Installs with your other dependencies
- ✅ **Zero manual downloads**: Everything through pip
- ✅ **Rollback support**: Pin to specific versions if needed

**Alternative: Environment Variable Approach**

If you prefer a home directory approach (useful for personal projects):

```bash
# One-time setup: Download to home directory
curl -o ~/.ruff.toml "https://raw.githubusercontent.com/cajias/lint-configs/main/python/ruff.toml"

# In pyproject.toml:
[tool.ruff]
extend = "${HOME}/.ruff.toml"
target-version = "py39"
```

To update: `curl -o ~/.ruff.toml "https://raw.githubusercontent.com/cajias/lint-configs/main/python/ruff.toml"`

**For Other Tools (MyPy, Pylint, Black):**

These tools don't support `extend` from external files, so you'll need to copy their sections into your `pyproject.toml`:

```bash
# Download the full config (includes all tools)
curl https://raw.githubusercontent.com/cajias/lint-configs/main/python/pyproject-linters.toml -o pyproject-linters.toml

# Copy the [tool.mypy], [tool.pylint.*], [tool.black] sections into your pyproject.toml
# Then delete pyproject-linters.toml
```

## Method 2: Direct Copy (Simplest)

Copy the configuration directly into your project:

```bash
# Download the config file
curl https://raw.githubusercontent.com/cajias/lint-configs/main/python/pyproject-linters.toml -o pyproject.toml

# Or copy just the [tool.*] sections into your existing pyproject.toml
```

**Benefits:**
- Complete control over configuration
- No dependencies
- Easy to customize per-project
- All tools (Ruff, MyPy, Pylint) configured in one file

## Method 3: Using the Python Package (Legacy)

If you previously installed the Python package, you can still use it to get the config path:

```bash
pip install agentic-guardrails
```

```python
from lint_configs import get_python_config_path
config_path = get_python_config_path()
print(config_path)  # Use with --config flag
```

**Note:** This approach requires using `--config` flags with every linting command, which is less convenient than Method 1's `extend` approach.

## Required Dependencies

Add these to your project's `pyproject.toml`:

```toml
[project.optional-dependencies]
dev = [
    "black>=23.0",
    "ruff>=0.1.9",
    "mypy>=1.0",
    "pylint>=3.0.0",
    "pytest>=7.0",
    "pytest-cov>=4.1.0",
]
```

Install with:

```bash
pip install -e ".[dev]"
```

## Configuration Customization

After copying the base configuration, customize these sections for your project:

### 1. Update Package Names

In your project's `pyproject.toml` (after copying from `pyproject-linters.toml`):

```toml
[tool.ruff.lint.isort]
known-first-party = ["your_package_name"]  # ← Your package

[tool.coverage.run]
source = ["your_package_name"]  # ← Your package
```

### 2. Adjust MyPy Third-Party Overrides

```toml
[[tool.mypy.overrides]]
module = ["third_party_lib.*"]  # Add your dependencies
ignore_missing_imports = true
```

### 3. (Optional) Add Project-Specific Per-File Ignores

```toml
[tool.ruff.lint.per-file-ignores]
"scripts/**/*.py" = [
    "T201",  # Allow print in scripts
]
"migrations/**/*.py" = [
    "E501",  # Long lines in generated migrations
]
```

## Usage

### Format and Lint

```bash
# Format code with Black
black .

# Lint with Ruff (auto-fix)
ruff check . --fix

# Lint without auto-fix (CI mode)
ruff check .

# Type check with MyPy
mypy .

# Check for duplicate code
pylint --disable=all --enable=duplicate-code src/
```

### Run Tests with Coverage

```bash
# Run tests
pytest

# Generate HTML coverage report
pytest --cov --cov-report=html
open htmlcov/index.html
```

### CI/CD Integration

Add to your CI pipeline (GitHub Actions example):

```yaml
name: Lint and Test

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: '3.9'

      - name: Install dependencies
        run: |
          pip install -e ".[dev]"

      - name: Format check
        run: black --check .

      - name: Lint
        run: ruff check .

      - name: Type check
        run: mypy .

      - name: Test with coverage
        run: pytest --cov --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
```

## Pre-commit Hook

Install pre-commit hooks to run linters automatically:

1. Create `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.9
    hooks:
      - id: ruff
        args: [--fix]

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: [types-all]
```

2. Install:

```bash
pip install pre-commit
pre-commit install
```

3. Run manually:

```bash
pre-commit run --all-files
```

## Configuration Overview

This configuration provides:

### Ruff
- **40+ rule categories** enabled
- **Only 2 rules ignored** (Black conflicts: E203, E501)
- **Line length**: 120 characters
- **Per-file ignores** for test files
- **Max complexity**: 10
- **Max function args**: 5
- **Dead code detection**: Unused imports, variables, arguments, commented code
- **Code clone detection**: Via Pylint (minimum 4 lines)

### MyPy
- **Strict mode** enabled
- Full type checking
- No untyped defs allowed

### Pylint
- **Duplicate code detection**
- Min similarity: 4 lines
- All checks enabled except those conflicting with Ruff

### Coverage
- **80% minimum** required
- Branch coverage enabled
- HTML, XML, and terminal reports

## What This Configuration Enforces

1. **Type hints everywhere** - All functions must have type annotations
2. **Docstrings required** - All public functions, classes, and methods need docstrings
3. **No commented code** - Use git history instead (ERA rules)
4. **Security checks** - Catches common vulnerabilities (Bandit)
5. **Complexity limits** - Functions must be simple (max complexity 10)
6. **Modern Python** - Enforces current best practices
7. **No duplicate code** - Catches copy-paste programming (Pylint min 4 lines)
8. **Pathlib usage** - Prefer pathlib over os.path
9. **Proper exception handling** - Exception chaining required

## Code Quality Detection

### Dead Code Detection

The configuration detects multiple types of dead code:

- **Unused imports** (F401) - Imports that are never used
- **Unused variables** (F841) - Variables assigned but never read
- **Unused function arguments** (ARG001-005) - Parameters that are never used
- **Commented-out code** (ERA001) - Code that should be removed or uncommented
- **Unreachable code** (W0101) - Code after return/raise statements
- **Pointless statements** (W0104) - Statements with no effect
- **Unused noqa comments** (RUF100) - Unnecessary linter suppressions
- **Unused type checking imports** (TCH004) - TYPE_CHECKING imports not used

### Code Clone Detection

Pylint's duplicate code detection catches copy-paste programming:

- **Minimum similarity**: 4 lines of similar code triggers a warning
- **Smart matching**: Ignores comments, docstrings, and imports
- **Configurable**: Adjust `min-similarity-lines` if needed

**Run duplicate detection:**
```bash
pylint --disable=all --enable=duplicate-code src/
```

**Example output:**
```
Similar lines in 2 files
==UserManager:45
==AdminManager:67
  def validate_user(self, username: str) -> bool:
      if not username:
          return False
      if len(username) < 3:
          return False
      return True
```

## Migration from Looser Config

If you're applying this to an existing project, follow these steps:

### Quick Migration Steps

1. **Format first:**
   ```bash
   black .
   git commit -am "Apply Black formatting"
   ```

2. **Auto-fix what's possible:**
   ```bash
   ruff check . --fix
   git commit -am "Auto-fix linting issues"
   ```

3. **Fix incrementally by category:**
   ```bash
   # Imports
   ruff check . --select=I --fix

   # Type hints (will need manual work)
   ruff check . --select=ANN

   # Docstrings (will need manual work)
   ruff check . --select=D

   # Security
   ruff check . --select=S
   ```

4. **Add type hints:**
   ```bash
   mypy . > mypy-errors.txt
   # Fix file by file
   ```

5. **Add docstrings:**
   ```bash
   ruff check . --select=D
   # Add docstrings to public APIs
   ```

## Temporarily Relaxing Rules

If you need to temporarily relax rules during migration:

### For specific files:

```toml
[tool.ruff.lint.per-file-ignores]
"legacy/**/*.py" = ["ANN", "D"]  # Skip type hints and docstrings in legacy code
```

### For specific lines:

```python
# Use sparingly!
result = eval(user_input)  # noqa: S307 - Validated input
```

### For entire project (not recommended):

```toml
[tool.ruff.lint]
ignore = ["ANN"]  # Skip ALL type hints (not recommended!)
```

**Important:** Document WHY you're ignoring rules and create tickets to fix them later.

## IDE Integration

### VS Code

Install extensions:
- Python (ms-python.python)
- Ruff (charliermarsh.ruff)
- Pylance (ms-python.vscode-pylance)

Settings (`.vscode/settings.json`):

```json
{
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.ruffEnabled": true,
  "python.linting.mypyEnabled": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.ruff": true,
    "source.organizeImports.ruff": true
  }
}
```

### PyCharm

1. Settings → Tools → Black → Enable "On code reformat"
2. Settings → Tools → External Tools → Add Ruff
3. Settings → Tools → Mypy → Enable type checking

## Troubleshooting

### "Too many errors to fix at once"

Use `--statistics` to see which rules are violated most:

```bash
ruff check . --statistics
```

Fix the most common ones first.

### "MyPy errors are overwhelming"

Start with one directory:

```bash
mypy src/your_package/single_module.py
```

Or use `--check-untyped-defs` mode temporarily.

### "Coverage is below 80%"

Find what's not covered:

```bash
pytest --cov --cov-report=html
open htmlcov/index.html
```

Focus on critical paths first.

### "Pylint duplicate code false positives"

Adjust the threshold:

```toml
[tool.pylint.similarities]
min-similarity-lines = 6  # Increase from 4
```

Or ignore specific files:

```bash
pylint --disable=all --enable=duplicate-code --ignore=tests src/
```

## Support

- **Updates:** Run `git submodule update --remote` to get latest config
- **Questions:** Open an issue in the lint-configs repository

## Philosophy

This configuration follows the principle: **If it's worth enabling, it's worth enforcing everywhere.**

The only exceptions are:
1. Rules that conflict with Black
2. Reasonable relaxations for test files

Everything else is enforced to ensure consistent, high-quality code across all projects.
