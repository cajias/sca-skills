"""Canonical linting configurations for Python projects."""

from pathlib import Path

__version__ = "1.0.0"

# Get the package directory
_PACKAGE_DIR = Path(__file__).parent


def get_python_config_path() -> Path:
    """Get the path to the Python linter configuration file.

    Returns:
        Path: Absolute path to pyproject-linters.toml

    Example:
        >>> from lint_configs import get_python_config_path
        >>> config_path = get_python_config_path()
        >>> print(config_path)
        /path/to/site-packages/lint_configs/python/pyproject-linters.toml
    """
    return _PACKAGE_DIR / "python" / "pyproject-linters.toml"


__all__ = ["get_python_config_path", "__version__"]
