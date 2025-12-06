# Markdownlint Configuration for AI-Generated Documentation

Strict markdownlint configuration for markdown files with comprehensive rules for documentation quality
and consistency. Designed to keep AI-generated documentation in check with 40+ rules.

## Highlights

- **📏 Line Length** - 120 character limit (configurable for code blocks and tables)
- **📑 Heading Style** - ATX-style headings (`#` syntax)
- **📝 Code Blocks** - Fenced code blocks with language specifiers required
- **📋 Lists** - Consistent indentation and formatting
- **🔗 Links** - Valid link syntax and reference handling
- **✨ Consistency** - Uniform markdown style across all documentation

Compatible with markdownlint-cli 0.35.0+

## Quick Start

### Installation

```bash
npm install --save-dev @lint-configs/markdownlint-config markdownlint-cli
```

### Basic Setup

Create a `.markdownlint.json` in your project root:

```json
{
  "extends": "@lint-configs/markdownlint-config"
}
```

Or use the config directly:

```bash
# Using the package directly
npx markdownlint -c node_modules/@lint-configs/markdownlint-config/.markdownlint.json '**/*.md'
```

### Usage

```bash
# Lint your markdown files
npx markdownlint '**/*.md'

# Auto-fix issues
npx markdownlint '**/*.md' --fix

# Lint specific files
npx markdownlint README.md docs/**/*.md
```

## What This Configuration Enforces

### Heading Style (MD003)

```markdown
<!-- ❌ Bad - Setext-style headings -->

# Title

## Subtitle

<!-- ✅ Good - ATX-style headings -->

# Title

## Subtitle
```

### Line Length (MD013)

```markdown
<!-- ❌ Bad - Line exceeds 120 characters -->

This is a very long line that goes on and on and on and exceeds the maximum line length of 120 characters which makes it hard to read.

<!-- ✅ Good - Wrapped to stay under 120 characters -->

This is a very long line that goes on and on and on and exceeds the maximum
line length of 120 characters which makes it hard to read.
```

### Code Block Language (MD040)

```markdown
<!-- ❌ Bad - Missing language specifier -->

\`\`\`
npm install
\`\`\`

<!-- ✅ Good - Language specified -->

\`\`\`bash
npm install
\`\`\`
```

### List Indentation (MD007)

```markdown
<!-- ❌ Bad - Inconsistent indentation -->

- Item 1
  - Subitem (3 spaces)
  - Another subitem (4 spaces)

<!-- ✅ Good - Consistent 2-space indentation -->

- Item 1
  - Subitem
  - Another subitem
```

### Duplicate Headings (MD024)

```markdown
<!-- ❌ Bad - Duplicate headings at same level -->

## Installation

Instructions...

## Installation

More instructions...

<!-- ✅ Good - Unique headings or different levels -->

## Installation

Instructions...

### Alternative Installation

More instructions...
```

## Package Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "lint:md": "markdownlint '**/*.md' --ignore node_modules",
    "lint:md:fix": "markdownlint '**/*.md' --ignore node_modules --fix"
  }
}
```

## CI/CD Integration

```yaml
# .github/workflows/lint.yml
name: Lint Markdown

on: [push, pull_request]

jobs:
  markdown:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint:md
```

## Customization

### Extend and Override

```json
{
  "extends": "@lint-configs/markdownlint-config",
  "MD013": {
    "line_length": 100
  }
}
```

### Disable Specific Rules

```json
{
  "extends": "@lint-configs/markdownlint-config",
  "MD013": false
}
```

### Inline Overrides

Use sparingly and document why:

```markdown
<!-- markdownlint-disable MD013 -->

This is a very long line that needs to exceed the limit for a specific reason like a long URL.

<!-- markdownlint-enable MD013 -->
```

## Rule Categories

### Headings

- **MD001** - Heading levels increment by one
- **MD003** - Heading style (ATX)
- **MD018** - No space after hash on atx heading
- **MD019** - Multiple spaces after hash on atx heading
- **MD020** - No space inside hashes on closed atx heading
- **MD021** - Multiple spaces inside hashes on closed atx heading
- **MD022** - Headings surrounded by blank lines
- **MD023** - Headings must start at the beginning of the line
- **MD024** - No duplicate headings (siblings only)
- **MD025** - Single top-level heading
- **MD026** - No trailing punctuation in heading
- **MD041** - First line in file should be a top-level heading (disabled)
- **MD043** - Required heading structure

### Lists

- **MD004** - Unordered list style
- **MD005** - Inconsistent indentation for list items
- **MD006** - Start bullets at beginning of line
- **MD007** - Unordered list indentation (2 spaces)
- **MD029** - Ordered list item prefix
- **MD030** - Spaces after list markers
- **MD032** - Lists surrounded by blank lines

### Code Blocks

- **MD031** - Fenced code blocks surrounded by blank lines
- **MD040** - Language specified for fenced code blocks
- **MD046** - Code block style (fenced)
- **MD048** - Code fence style

### Links & Images

- **MD042** - No empty links
- **MD044** - Proper names capitalized
- **MD045** - Images have alt text
- **MD051** - Link fragments

### Spacing & Formatting

- **MD009** - No trailing spaces
- **MD010** - No hard tabs
- **MD012** - No multiple consecutive blank lines
- **MD013** - Line length (120 chars)
- **MD027** - No multiple spaces after blockquote symbol
- **MD028** - No blank line inside blockquote
- **MD033** - No inline HTML (disabled for flexibility)
- **MD034** - No bare URLs
- **MD037** - No spaces inside emphasis markers
- **MD038** - No spaces inside code span elements
- **MD039** - No spaces inside link text

## Philosophy

> "Consistent documentation is readable documentation."

This configuration:

- Enforces strict quality standards for AI-generated documentation
- Ensures consistency across all markdown files
- Catches common documentation errors early
- Mirrors the strictness of Python (Ruff) and TypeScript (ESLint) configs

## Comparison with Other Packages

| Python (Ruff)         | TypeScript (ESLint)       | Markdown (markdownlint) |
| --------------------- | ------------------------- | ----------------------- |
| Line length: 100      | Line length: configurable | Line length: 120        |
| Import sorting        | Import plugin             | N/A                     |
| Complexity limits     | Complexity rules          | N/A                     |
| Type checking (MyPy)  | TypeScript strict         | N/A                     |
| Code formatting       | Prettier                  | Markdownlint auto-fix   |
| Consistent everywhere | Consistent everywhere     | Consistent everywhere   |

## Support

- **Issues:** [GitHub Issues](https://github.com/cajias/lint-configs/issues)
- **Discussions:** [GitHub Discussions](https://github.com/cajias/lint-configs/discussions)

## Contributing

Config changes affect all projects using this package. Please:

1. Open an issue explaining the change
2. Show examples of false positives or conflicts
3. Consider impact on existing projects
4. Get consensus before submitting PR

## License

MIT

## Maintainers

Maintained by the Engineering team. Changes require review and approval.
