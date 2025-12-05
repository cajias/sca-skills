# Copilot Coding Agent Instructions

This file provides context and guidelines for GitHub Copilot coding agent when working on the `sca-skills` repository.

## Project Overview

**sca-skills** (formerly `sca-skills`) is a collection of strict, opinionated linter configurations for multiple programming languages. The project's philosophy is: **"If it's worth enabling, it's worth enforcing everywhere."**

### Repository Structure

```
sca-skills/
├── .github/                    # GitHub configuration
│   ├── workflows/              # CI/CD workflows
│   └── copilot-instructions.md # This file
├── python/                     # Python linting configurations
│   ├── lint_configs/           # Python package
│   ├── pyproject.toml          # Package configuration
│   ├── pyproject-linters.toml  # Linter rules (source)
│   └── README.md               # Python-specific documentation
├── README.md                   # Main documentation
└── LICENSE                     # MIT License
```

### Key Components

1. **Python Package (`python/lint_configs/`)**: Distributable package containing linting configurations
2. **Configuration Files**: Canonical linting rules for Ruff, MyPy, Pylint, Black, and Pytest
3. **Documentation**: Comprehensive guides for setup, usage, and migration

## Project Goals

- Provide **minimal ignore** configurations (only rules conflicting with formatters)
- Enable **maximum strictness** across all quality checks
- Ensure **language consistency** with similar principles across languages
- Enable **easy adoption** through simple integration methods

## Coding Conventions

### Python Code Style

This project enforces the same strict linting rules it provides to others:

1. **Formatting**: Black with 120-character lines
2. **Linting**: Ruff with 40+ rule categories enabled
3. **Type Checking**: MyPy in strict mode
4. **Coverage**: 80% minimum test coverage required
5. **Duplicate Code**: Pylint detects 4+ similar lines

### Specific Requirements

- **Type hints everywhere**: All functions must have complete type annotations
- **Docstrings required**: All public functions, classes, and methods need docstrings
- **No commented code**: Use git history instead (ERA rules)
- **Security checks**: All code must pass Bandit security checks
- **Complexity limits**: Functions must have cyclomatic complexity ≤ 10
- **Max function arguments**: 5 parameters maximum
- **Pathlib usage**: Prefer `pathlib` over `os.path`

### File Organization

- Configuration files go in language-specific directories (e.g., `python/`)
- Package code in `lint_configs/` subdirectory
- Documentation in README.md files at appropriate levels
- CI/CD workflows in `.github/workflows/`

## Development Workflow

### Setting Up Development Environment

```bash
# Clone repository
git clone https://github.com/cajias/sca-skills.git
cd sca-skills

# Set up Python environment (for Python package development)
cd python
pip install -e ".[dev]"
```

### Before Making Changes

1. **Understand the impact**: Configuration changes affect all projects using these configs
2. **Check existing issues**: Look for related discussions or requests
3. **Test locally**: Verify changes work with real projects

### Making Changes

#### For Configuration Updates

1. Edit the source configuration file (e.g., `python/pyproject-linters.toml`)
2. Update the bundled copy in the package (e.g., `python/lint_configs/python/pyproject-linters.toml`)
3. Update documentation to reflect changes
4. Update version in `pyproject.toml` and `__init__.py`
5. Test with actual projects

#### For Code Changes

1. Run formatters: `black .`
2. Run linters: `ruff check . --fix`
3. Run type checker: `mypy .`
4. Run tests: `pytest --cov` (if tests exist)
5. Check for duplicates: `pylint --disable=all --enable=duplicate-code src/`

### Testing

Currently, the project focuses on configuration distribution. When adding tests:

1. Place tests in `tests/` directory
2. Name test files `test_*.py`
3. Ensure 80% coverage minimum
4. Test both successful cases and edge cases

### Version Management

Version numbers follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes to configurations (rare)
- **MINOR**: New rules or significant changes
- **PATCH**: Bug fixes, documentation updates

Update versions in:

1. `python/pyproject.toml` → `[project].version`
2. `python/lint_configs/__init__.py` → `__version__`

## Publishing Process

### Automated Publishing (Preferred)

The repository uses GitHub Actions for automated publishing:

```bash
# 1. Update version numbers (see Version Management above)
# 2. Commit changes
git add .
git commit -m "Bump version to X.Y.Z"

# 3. Create and push tag
git tag vX.Y.Z
git push origin vX.Y.Z

# GitHub Actions automatically:
# - Builds the package
# - Publishes to GitHub Packages
# - Creates a GitHub Release
# - (Optional) Publishes to PyPI if PYPI_API_TOKEN is set
```

### Manual Publishing

Only use if automated workflow fails:

```bash
cd python/
python -m build
twine upload dist/*
```

## Common Tasks

### Adding a New Linting Rule

1. Research the rule and its implications
2. Add to appropriate configuration file
3. Test with multiple projects
4. Document in the language-specific README
5. Update version and publish

### Adding a New Language

1. Create `<language>/` directory
2. Add canonical configuration files
3. Create `<language>/README.md` with setup instructions
4. Update root README.md with new language
5. Consider package distribution method

### Updating Documentation

1. Identify the appropriate README (root, language-specific, workflow)
2. Make changes clearly and concisely
3. Ensure examples are accurate and tested
4. Update version if substantive changes

## Key Principles for Changes

### Be Conservative

Configuration changes affect many projects. Only change if:

- Rule produces false positives consistently
- Rule conflicts with other tools (formatters)
- Rule is fundamentally broken
- Community consensus supports the change

### Document Thoroughly

- Explain **why** rules are enabled or disabled
- Provide examples of violations and fixes
- Include migration guidance for breaking changes

### Maintain Consistency

- Similar rules across languages when applicable
- Consistent documentation structure
- Uniform version management

### Minimize Ignores

Only ignore rules for valid reasons:

1. Conflicts with code formatters
2. False positives that can't be fixed
3. Per-file exceptions (tests, generated code)

## File-Specific Guidelines

### `.github/copilot-instructions.md` (This File)

- Update when project structure changes
- Keep coding conventions current
- Add new development workflows as they're established

### `python/pyproject-linters.toml`

- Source of truth for Python linting rules
- Changes must be synchronized with bundled copy
- Document rule changes in comments

### `python/lint_configs/__init__.py`

- Exports helper functions for configuration paths
- Update `__version__` with `pyproject.toml`
- Keep minimal - this is a utility module

### `README.md` Files

- Root README: Overview, philosophy, quick start for all languages
- Language READMEs: Detailed setup, usage, troubleshooting
- Workflow README: CI/CD and publishing details

## Security Considerations

### Linting Rules

- Always enable security-focused rules (Bandit, etc.)
- Don't ignore security warnings without documentation
- Test security rules against known vulnerabilities

### Package Publishing

- Use GitHub Actions with GITHUB_TOKEN (automatic)
- Optional PyPI token stored as repository secret
- Never commit tokens or credentials

## Integration with CI/CD

This project uses GitHub Actions workflows in `.github/workflows/`:

1. **publish.yml**: Automated package publishing on tags
2. Add linting/testing workflows as the project grows

When modifying workflows:

- Test locally with `act` when possible
- Use established GitHub Actions from marketplace
- Document any secrets or variables needed

## Getting Help

- **Issues**: Open for bugs, feature requests, or questions
- **Discussions**: For general questions about usage
- **Documentation**: Check language-specific READMEs first

## Summary for Copilot

When working on this repository:

1. ✅ **Follow strict linting**: This project practices what it preaches
2. ✅ **Think about impact**: Changes affect many downstream projects
3. ✅ **Test thoroughly**: Verify with real-world projects
4. ✅ **Document everything**: Explain the "why" not just the "what"
5. ✅ **Be conservative**: Only change configurations with good reason
6. ✅ **Update versions**: Bump version numbers for any configuration changes
7. ✅ **Synchronize files**: Keep source and bundled configs in sync
8. ✅ **No commented code**: Use git history instead
9. ✅ **Type everything**: Complete type hints on all functions
10. ✅ **Document publicly**: All public APIs need docstrings

Remember: This is a foundational project that other projects depend on. Quality and stability are paramount.
