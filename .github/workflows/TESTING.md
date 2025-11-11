# Testing the Publish Workflow

This document describes how to test the publish workflow before creating an actual release.

## Manual Testing

### 1. Test Package Build Locally

```bash
cd python

# Clean previous builds
rm -rf dist/ build/ *.egg-info

# Install build tools
pip install build twine

# Build the package
python -m build

# Check the package
twine check dist/*

# List contents
ls -lh dist/
```

Expected output:
- Two files: `agentic_guardrails-X.Y.Z-py3-none-any.whl` and `agentic_guardrails-X.Y.Z.tar.gz`
- Twine check should pass with no errors

### 2. Test Package Installation

```bash
# Create a test virtual environment
python -m venv /tmp/test_install
source /tmp/test_install/bin/activate

# Install from wheel
pip install python/dist/agentic_guardrails-*.whl

# Test import
python -c "from lint_configs import get_python_config_path, __version__; print(f'Version: {__version__}'); print(f'Config path: {get_python_config_path()}')"

# Verify config file exists
python -c "from lint_configs import get_python_config_path; import os; assert os.path.exists(get_python_config_path()), 'Config file not found!'; print('✅ Config file exists')"

# Clean up
deactivate
rm -rf /tmp/test_install
```

### 3. Test GitHub Installation Method

```bash
# Create a test virtual environment
python -m venv /tmp/test_git_install
source /tmp/test_git_install/bin/activate

# Install from GitHub (replace 'main' with actual tag when testing)
pip install git+https://github.com/cajias/lint-configs.git@main#subdirectory=python

# Test import
python -c "from lint_configs import __version__; print(f'Version: {__version__}')"

# Clean up
deactivate
rm -rf /tmp/test_git_install
```

### 4. Test in a Sample Project

Create a test project to verify the configuration works:

```bash
# Create test project
mkdir /tmp/test_project
cd /tmp/test_project

# Initialize
python -m venv venv
source venv/bin/activate

# Install the package
pip install git+https://github.com/cajias/lint-configs.git@main#subdirectory=python

# Install linting tools
pip install ruff mypy pylint black

# Create a sample pyproject.toml
cat > pyproject.toml << 'EOF'
[tool.ruff]
extend = "python/pyproject-linters.toml"

[tool.mypy]
# MyPy will use settings from the extended config
EOF

# Create a sample Python file
cat > sample.py << 'EOF'
"""Sample module to test linting."""


def hello(name: str) -> str:
    """Greet someone.
    
    Args:
        name: The person to greet
        
    Returns:
        A greeting message
    """
    return f"Hello, {name}!"


if __name__ == "__main__":
    print(hello("World"))
EOF

# Run linters
echo "Testing Ruff..."
ruff check sample.py

echo "Testing MyPy..."
mypy sample.py

echo "Testing Black..."
black --check sample.py

# Clean up
cd /
rm -rf /tmp/test_project
```

## Testing the GitHub Actions Workflow

### Option 1: Manual Workflow Dispatch

1. Go to the repository on GitHub
2. Navigate to "Actions" tab
3. Select "Publish Python Package" workflow
4. Click "Run workflow"
5. Select the branch
6. Click "Run workflow"

This will run the workflow without creating a release (since it's not triggered by a tag).

### Option 2: Create a Test Tag

```bash
# Update version to a test version
vim python/pyproject.toml  # Change version to "1.0.0-test"
vim python/lint_configs/__init__.py  # Change __version__ to "1.0.0-test"

# Commit
git add python/
git commit -m "Test release v1.0.0-test"

# Create and push a test tag
git tag v1.0.0-test
git push origin v1.0.0-test

# Watch the Actions tab on GitHub to see the workflow run
```

After testing, delete the test release and tag:

```bash
# Delete tag locally and remotely
git tag -d v1.0.0-test
git push origin :refs/tags/v1.0.0-test

# Delete the release on GitHub (go to Releases page and delete manually)
```

## Verification Checklist

Before creating an official release, verify:

- [ ] Package builds successfully without warnings
- [ ] `twine check` passes
- [ ] Package installs correctly from wheel
- [ ] Package installs correctly from GitHub
- [ ] Config file is accessible via `get_python_config_path()`
- [ ] Version number is updated in both `pyproject.toml` and `__init__.py`
- [ ] Linters can extend the configuration
- [ ] GitHub Actions workflow runs without errors
- [ ] Release is created with correct files attached
- [ ] Release notes contain correct installation instructions

## Common Issues

### Issue: "Module not found" after installation

**Cause**: Package structure issue or import error

**Fix**: Check that `lint_configs/__init__.py` exists and contains the correct imports

### Issue: "Config file not found"

**Cause**: The config file wasn't included in the package

**Fix**: Check `MANIFEST.in` includes the config file and rebuild

### Issue: Build warnings about duplicate files

**Cause**: File is listed both in packages and force-include

**Fix**: Remove the duplicate from one of the locations in `pyproject.toml`

### Issue: Workflow doesn't trigger

**Cause**: Tag doesn't match the pattern `v*`

**Fix**: Ensure tag starts with 'v' (e.g., `v1.0.0`, not `1.0.0`)

### Issue: Release not created

**Cause**: Missing permissions or workflow error

**Fix**: Check that the workflow has `contents: write` permission in the `permissions` section
