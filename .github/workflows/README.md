# GitHub Actions Workflows

## Publish Workflow

The `publish.yml` workflow automatically builds and publishes packages for multiple languages when you create a new version tag.

### How It Works

1. **Trigger**: Runs when you push a tag matching `v*` (e.g., `v1.0.0`, `v1.2.3`)
2. **Build**: Builds packages from both `python/` and `typescript/` directories
3. **Release**: Creates a GitHub release with package files attached as assets
4. **Publish** (Optional): Can also publish to PyPI and npm if tokens are configured

### Packages Built

- **Python**: pip package for Python linting configurations
- **TypeScript/JavaScript**: npm package for ESLint configurations

### Setup Instructions

#### No Setup Required!

The workflow automatically creates GitHub Releases using the built-in `GITHUB_TOKEN`. No secrets needed!

#### Optional: Publish to Public Registries

**To publish Python to PyPI:**

1. Go to https://pypi.org/manage/account/token/
2. Create a new API token
3. Scope: "Entire account" or specific to `agentic-guardrails`
4. Copy the token (starts with `pypi-...`)
5. Go to your repository on GitHub
6. Navigate to: **Settings** → **Secrets and variables** → **Actions**
7. Click **New repository secret**
8. Name: `PYPI_API_TOKEN`
9. Value: (paste your token)

**To publish TypeScript/JavaScript to npm:**

1. Go to https://www.npmjs.com/settings/[username]/tokens
2. Create a new "Automation" token
3. Copy the token
4. Go to your repository on GitHub
5. Navigate to: **Settings** → **Secrets and variables** → **Actions**
6. Click **New repository secret**
7. Name: `NPM_TOKEN`
8. Value: (paste your token)

### Publishing a New Version

```bash
# 1. Update version numbers
# Python: Edit python/pyproject.toml and python/lint_configs/__init__.py
# TypeScript: Edit typescript/package.json

# 2. Commit the version bump
git add python/pyproject.toml python/lint_configs/__init__.py typescript/package.json
git commit -m "Bump version to 1.0.1"

# 3. Create and push a tag
git tag v1.0.1
git push origin v1.0.1

# 4. GitHub Actions will automatically:
#    - Build both Python and TypeScript packages
#    - Create a GitHub Release with package files
#    - (Optional) Publish to PyPI if PYPI_API_TOKEN is configured
#    - (Optional) Publish to npm if NPM_TOKEN is configured
#    - Publish TypeScript to GitHub Packages
```

### Installing from GitHub

Users can install packages directly from GitHub:

**Python from a specific version tag:**
```bash
pip install git+https://github.com/cajias/lint-configs.git@v1.0.0#subdirectory=python
```

**TypeScript from npm (if published):**
```bash
npm install @agentic-guardrails/eslint-config@1.0.0
```

**TypeScript from GitHub Packages:**
```bash
npm install @agentic-guardrails/eslint-config@v1.0.0
```

**Or download wheel from a release and install:**
1. Go to the Releases page
2. Download the `.whl` file
3. Run: `pip install agentic_guardrails-*.whl`

### Manual Triggering

You can also trigger the workflow manually:

1. Go to **Actions** tab in GitHub
2. Select **Publish Packages** workflow
3. Click **Run workflow**
4. Choose the branch
5. Click **Run workflow**

This will build and check packages without publishing (useful for testing).

### Workflow Features

- ✅ **Automated builds** on version tags for both Python and TypeScript
- ✅ **Package validation** (Python: `twine check`, TypeScript: npm install)
- ✅ **GitHub Releases** with package files attached
- ✅ **Installation instructions** in release notes
- ✅ **PyPI publishing** (optional, requires PYPI_API_TOKEN)
- ✅ **npm publishing** (optional, requires NPM_TOKEN)
- ✅ **GitHub Packages publishing** for TypeScript (automatic)
- ✅ **Manual triggering** for testing

### Troubleshooting

**"PyPI upload failed" warning:**
- Add `PYPI_API_TOKEN` secret to your repository
- Make sure the token has correct permissions

**"npm publish failed" warning:**
- Add `NPM_TOKEN` secret to your repository
- Make sure the token is an "Automation" token with publish access
- Verify package name is not already taken

**"GitHub Release not created":**
- Make sure you pushed a tag starting with `v` (e.g., `v1.0.0`)
- Check that the workflow has `contents: write` permission

**Package build fails:**
- Python: Check that `python/pyproject.toml` is valid and version is updated
- TypeScript: Check that `typescript/package.json` is valid and version is updated
- Verify all files are included in MANIFEST.in (Python) or package.json files array (TypeScript)

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
vim typescript/package.json  # Change "version": "1.1.0"

# Commit
git add .
git commit -m "Release v1.1.0: Add new features"

# Tag and push
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main
git push origin v1.1.0

# GitHub Actions automatically:
# - Builds both Python and TypeScript packages
# - Creates GitHub Release with package files
# - (Optional) Publishes to PyPI and npm
```

Users can then install with:
```bash
# Python from GitHub
pip install git+https://github.com/cajias/lint-configs.git@v1.1.0#subdirectory=python

# Python from PyPI (if published there)
pip install agentic-guardrails==1.1.0

# TypeScript from npm (if published there)
npm install @agentic-guardrails/eslint-config@1.1.0

# TypeScript from GitHub Packages
npm install @agentic-guardrails/eslint-config@v1.1.0
```
