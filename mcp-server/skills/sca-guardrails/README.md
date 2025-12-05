# SCA Guardrails Skill

A Claude Code skill for automatically fixing code quality issues using AI-powered analysis.

## What It Does

This skill runs a complete code quality workflow:

1. **Assesses** your codebase using ESLint, Prettier, and other linters
2. **Auto-fixes** what linter tools can handle (formatting, simple errors)
3. **Claude fixes** what tools can't (complexity, types, dead code)
4. **Reports** remaining issues that need manual attention

## Installation

### 1. Install the MCP Server

```bash
# Clone the repo
git clone https://github.com/cajias/sca-skills.git
cd sca-skills/mcp-server
npm install && npm run build
```

### 2. Configure Claude Code

Add the MCP server to Claude Code:

```bash
claude mcp add sca -- node /path/to/sca-skills/mcp-server/dist/server.js
```

### 3. Install the Skill (Optional)

Copy the skill files to Claude's skills directory:

```bash
# Create skills directory if it doesn't exist
mkdir -p ~/.claude/skills/sca-guardrails

# Copy skill files
cp skill.md PROCEDURE.md README.md ~/.claude/skills/sca-guardrails/
```

## Usage

### Interactive Mode

In a Claude Code session:

```
You: Run static analysis on this project

Claude: [Assesses, fixes, and reports results]
```

### Headless Mode

```bash
# Run until completion
claude --skill sca-guardrails /path/to/project
```

## What Gets Fixed

### Auto-Fixed by Linters

- Formatting issues (Prettier)
- Import order (ESLint)
- Unused semicolons, trailing commas
- Simple code style issues

### Fixed by Claude

- **Complexity**: Functions exceeding complexity limits → refactored into smaller functions
- **Types**: `any` types → proper TypeScript types inferred from context
- **Dead Code**: Unused variables/exports → removed after confirming no usage
- **Long Functions**: Functions over 50 lines → split into focused helpers

### Requires Manual Review

- Deprecated API usage
- Circular dependencies
- Business logic issues
- Architecture decisions

## Configuration

The MCP server uses the `@sca-skills/eslint-config` package which includes:

- 200+ ESLint rules
- TypeScript strict mode
- Security checks (eslint-plugin-security)
- Code quality (eslint-plugin-sonarjs)
- React/JSX support
- Accessibility (jsx-a11y)
- Prettier integration

## Customization

### Using Your Own Config

If your project has its own ESLint config, the MCP server will detect and use it instead of the bundled config.

### Adjusting Rules

To customize rules, create or modify your project's `eslint.config.js`:

```javascript
import baseConfig from '@sca-skills/eslint-config/flat';

export default [
  ...baseConfig,
  {
    rules: {
      // Override specific rules
      complexity: ['error', 15], // Allow higher complexity
      '@typescript-eslint/no-explicit-any': 'warn', // Downgrade to warning
    },
  },
];
```

## Files

- `skill.md` - Core skill definition and workflow overview
- `PROCEDURE.md` - Detailed step-by-step instructions for Claude
- `README.md` - This file

## Troubleshooting

### "MCP server not found"

Ensure the SCA MCP server is configured. Run `claude mcp list` to check.

### "No issues found" but code has problems

Check if your project has a `tsconfig.json` - ESLint needs it for TypeScript files.

### Claude makes incorrect fixes

The skill is designed to verify each fix. If a fix introduces new issues, Claude will try alternatives. For complex cases, issues are marked for manual review.

## License

MIT
