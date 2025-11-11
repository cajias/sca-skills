# GitHub Actions Workflows

## Publish Workflow

The `publish.yml` workflow automatically builds and publishes the Python package when you create a new version tag.

### How It Works

1. **Trigger**: Runs when you push a tag matching `v*` (e.g., `v1.0.0`, `v1.2.3`)
2. **Build**: Builds the Python package from the `python/` directory
3. **Release**: Creates a GitHub release with the built package files attached as assets
4. **Publish** (Optional): Can also publish to PyPI if `PYPI_API_TOKEN` secret is configured

### Setup Instructions

#### No Setup Required!

The workflow automatically creates GitHub Releases using the built-in `GITHUB_TOKEN`. No secrets needed!

#### Optional: Also Publish to PyPI

If you want to also publish to public PyPI:

1. Go to https://pypi.org/manage/account/token/
2. Create a new API token
3. Scope: "Entire account" or specific to `agentic-guardrails`
4. Copy the token (starts with `pypi-...`)
5. Go to your repository on GitHub
6. Navigate to: **Settings** → **Secrets and variables** → **Actions**
7. Click **New repository secret**
8. Name: `PYPI_API_TOKEN`
9. Value: (paste your token)

### Publishing a New Version

```bash
# 1. Update version in python/pyproject.toml and python/lint_configs/__init__.py
# Edit version = "1.0.1"

# 2. Commit the version bump
git add python/pyproject.toml python/lint_configs/__init__.py
git commit -m "Bump version to 1.0.1"

# 3. Create and push a tag
git tag v1.0.1
git push origin v1.0.1

# 4. GitHub Actions will automatically:
#    - Build the package
#    - Create a GitHub Release with package files
#    - (Optional) Publish to PyPI if token is configured
```

### Installing from GitHub

Users can install the package directly from GitHub:

**Install from a specific version tag:**
```bash
pip install git+https://github.com/cajias/lint-configs.git@v1.0.0#subdirectory=python
```

**Install from main branch (latest):**
```bash
pip install git+https://github.com/cajias/lint-configs.git@main#subdirectory=python
```

**Or in requirements-dev.txt:**
```
agentic-guardrails @ git+https://github.com/cajias/lint-configs.git@v1.0.0#subdirectory=python
```

**Or download the wheel from a release and install:**
1. Go to the Releases page
2. Download the `.whl` file
3. Run: `pip install agentic_guardrails-*.whl`

### Manual Triggering

You can also trigger the workflow manually:

1. Go to **Actions** tab in GitHub
2. Select **Publish Python Package** workflow
3. Click **Run workflow**
4. Choose the branch
5. Click **Run workflow**

This will build and check the package without publishing (useful for testing).

### Workflow Features

- ✅ **Automated builds** on version tags
- ✅ **Package validation** with `twine check`
- ✅ **GitHub Releases** with package files (wheel and source) attached
- ✅ **Installation instructions** in release notes
- ✅ **PyPI publishing** (optional, requires token)
- ✅ **Manual triggering** for testing

### Troubleshooting

**"PyPI upload failed" warning:**
- Add `PYPI_API_TOKEN` secret to your repository
- Make sure the token has correct permissions

**"GitHub Release not created":**
- Make sure you pushed a tag starting with `v` (e.g., `v1.0.0`)
- Check that the workflow has `contents: write` permission

**Package build fails:**
- Check that `python/pyproject.toml` is valid
- Ensure version number is updated
- Verify all files are included in MANIFEST.in

### Versioning

This project follows [Semantic Versioning](https://semver.org/):
- `v1.0.0` - Major release (breaking changes)
- `v1.1.0` - Minor release (new features, backwards compatible)
- `v1.0.1` - Patch release (bug fixes)

### Example Release Process

```bash
# Update version to 1.1.0
vim python/pyproject.toml  # Change version = "1.1.0"
vim python/lint_configs/__init__.py  # Change __version__ = "1.1.0"

# Commit
git add .
git commit -m "Release v1.1.0: Add TypeScript support"

# Tag and push
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main
git push origin v1.1.0

# GitHub Actions automatically:
# - Builds package
# - Creates GitHub Release with package files
# - (Optional) Publishes to PyPI
```

Users can then install with:
```bash
# From GitHub
pip install git+https://github.com/cajias/lint-configs.git@v1.1.0#subdirectory=python

# Or from PyPI (if published there)
pip install agentic-guardrails==1.1.0
```
