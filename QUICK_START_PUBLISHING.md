# Quick Start: Publishing Python Lint Rules

This guide shows you how to publish a new version of the Python lint configuration package.

## Prerequisites

✅ Already done - no setup required! The GitHub Actions workflow is fully configured.

## Publishing a New Version

### Step 1: Update Version Numbers

Edit both files to match the new version:

**File 1: `python/pyproject.toml`**

```toml
[project]
name = "sca-skills"
version = "1.0.1"  # ← Update this
```

**File 2: `python/lint_configs/__init__.py`**

```python
__version__ = "1.0.1"  # ← Update this
```

### Step 2: Commit and Tag

```bash
# Commit version bump
git add python/pyproject.toml python/lint_configs/__init__.py
git commit -m "Bump version to 1.0.1"

# Create tag (must start with 'v')
git tag v1.0.1

# Push both commit and tag
git push origin main
git push origin v1.0.1
```

### Step 3: That's It

GitHub Actions will automatically:

1. ✅ Build the package (wheel + source)
2. ✅ Validate it with `twine check`
3. ✅ Create a GitHub Release
4. ✅ Attach package files to the release
5. ✅ Generate release notes with installation instructions

Watch the progress in the "Actions" tab on GitHub.

## How Users Install It

Once published, users can install the package:

### Option 1: From Git (Recommended)

```bash
pip install git+https://github.com/cajias/lint-configs.git@v1.0.1#subdirectory=python
```

### Option 2: In requirements.txt

```txt
sca-skills @ git+https://github.com/cajias/lint-configs.git@v1.0.1#subdirectory=python
```

### Option 3: Download from Release

1. Go to the Releases page
2. Download the `.whl` file
3. Run: `pip install agentic_guardrails-1.0.1-py3-none-any.whl`

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **Major** (v2.0.0) - Breaking changes (rules removed, behavior changes)
- **Minor** (v1.1.0) - New rules added (backwards compatible)
- **Patch** (v1.0.1) - Bug fixes, documentation updates

## Optional: Also Publish to PyPI

Want to make it available via `pip install sca-skills` (without git URL)?

1. Create a PyPI API token at <https://pypi.org/manage/account/token/>
2. Add it to GitHub repository secrets:
   - Go to: Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `PYPI_API_TOKEN`
   - Value: (paste your token)

The workflow will automatically publish to PyPI whenever you push a tag.

## Testing Before Release

Want to test before creating an official release?

1. **Test build locally:**

   ```bash
   cd python
   python -m pip install build twine
   python -m build
   twine check dist/*
   ```

2. **Test installation locally:**

   ```bash
   pip install python/dist/*.whl
   python -c "from lint_configs import __version__; print(__version__)"
   ```

3. **Test manual workflow run:**
   - Go to Actions tab
   - Select "Publish Python Package"
   - Click "Run workflow"
   - This builds but doesn't create a release

See `.github/workflows/TESTING.md` for detailed testing procedures.

## Troubleshooting

### Workflow didn't trigger

- Make sure tag starts with 'v': `v1.0.0` ✅, `1.0.0` ❌
- Check you pushed the tag: `git push origin v1.0.0`

### Build failed

- Check version numbers match in both files
- Try building locally first: `cd python && python -m build`

### Package import doesn't work

- Verify file structure: `lint_configs/python/pyproject-linters.toml` should exist
- Test locally before pushing tag

## Need Help?

- Check `.github/workflows/README.md` for detailed workflow documentation
- Check `.github/workflows/TESTING.md` for testing procedures
- Check the Actions tab for workflow run details
- Check past releases for examples

## Example: Complete Release Process

```bash
# Start from main branch
git checkout main
git pull origin main

# Update versions
vim python/pyproject.toml          # Change version to "1.0.1"
vim python/lint_configs/__init__.py # Change __version__ to "1.0.1"

# Test locally (optional but recommended)
cd python
python -m build
twine check dist/*
cd ..

# Commit
git add python/
git commit -m "Release v1.0.1: Fix configuration typo"

# Tag and push
git tag v1.0.1
git push origin main
git push origin v1.0.1

# Done! Check Actions tab to watch progress
# Release will appear at: https://github.com/cajias/lint-configs/releases
```

Users can then immediately install:

```bash
pip install git+https://github.com/cajias/lint-configs.git@v1.0.1#subdirectory=python
```
