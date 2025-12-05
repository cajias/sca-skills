# SCA Guardrails

AI-powered code quality workflow that automatically fixes lint errors until the codebase is clean.

## Trigger

This skill activates when the user asks to:

- "Fix lint errors"
- "Clean up code quality"
- "Run static analysis"
- "Make the code pass linting"
- "Fix all the warnings and errors"

## Required MCP Server

This skill requires the `sca` MCP server to be configured:

```json
{
  "mcpServers": {
    "sca": {
      "command": "npx",
      "args": ["@cajias/sca-mcp"]
    }
  }
}
```

## Workflow Overview

### Phase 1: Assessment

1. Call `sca.lint({ path: "." })`
2. Categorize issues:
   - **Auto-fixable**: ESLint --fix, Prettier --write can handle
   - **Claude-fixable**: Complexity, types, dead code - Claude can refactor
   - **Manual-only**: Architecture issues, business logic

### Phase 2: Auto-Fix

1. Call `sca.fix({ path: "." })`
2. Re-lint to see remaining issues

### Phase 3: Claude Fixes

For each Claude-fixable issue:

1. Read the file containing the issue
2. Understand the rule violation
3. Apply an intelligent fix using the Edit tool
4. Re-lint to verify the fix worked

Common Claude fixes:

- `complexity` → Extract helper functions
- `no-explicit-any` → Add proper TypeScript types
- `no-unused-vars` → Remove dead code or use the variable
- `max-lines-per-function` → Split into smaller functions

### Phase 4: Report

Summarize what was fixed and what remains for manual review.

## Execution Modes

### Interactive Mode

When running in an interactive Claude Code session:

- Use TodoWrite to track progress
- Provide periodic updates to the user
- Ask before making significant refactors

### Headless Mode

When invoked as `claude --skill sca-guardrails`:

- Run the full workflow autonomously
- Exit 0 if codebase is clean
- Exit 1 if issues remain with summary of what couldn't be fixed

## See Also

- `PROCEDURE.md` for detailed step-by-step instructions
- `README.md` for installation and configuration
