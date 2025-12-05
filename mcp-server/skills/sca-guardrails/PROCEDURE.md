# SCA Guardrails Procedure

Detailed step-by-step workflow for fixing code quality issues.

## Prerequisites

- MCP server `sca` is configured and accessible
- Project has TypeScript/JavaScript files to lint
- Claude has Read and Edit tool access

## Step 1: Initial Assessment

Call the lint tool to understand the current state:

```
sca.lint({ path: "." })
```

Parse the response:

- `summary.total`: Total number of issues
- `summary.fixable`: Issues that linter tools can auto-fix
- `summary.claudeFixable`: Issues that Claude can fix
- `issues[]`: Array of individual issues

If `summary.total === 0`, report success and exit.

## Step 2: Auto-Fix Pass

Run the automated fixers:

```
sca.fix({ path: "." })
```

This executes:

- `eslint --fix` for JavaScript/TypeScript
- `prettier --write` for formatting
- (Future: `ruff --fix` for Python)

## Step 3: Re-assess

Lint again to see what remains:

```
sca.lint({ path: "." })
```

Now `summary.fixable` should be 0 or near 0.
Remaining issues are either:

- `claudeFixable: true` → Proceed to Step 4
- `claudeFixable: false` → Report as manual issues in Step 5

## Step 4: Claude Fix Loop

For each issue where `claudeFixable: true`:

### 4.1 Read the File

```
Read({ file_path: issue.file })
```

Focus on the area around `issue.line`.

### 4.2 Understand the Violation

Based on `issue.rule`, determine the fix strategy:

| Rule                                 | Strategy                                           |
| ------------------------------------ | -------------------------------------------------- |
| `complexity`                         | Identify extractable logic, create helper function |
| `max-lines-per-function`             | Split into smaller, focused functions              |
| `max-depth`                          | Extract nested logic into separate functions       |
| `@typescript-eslint/no-explicit-any` | Infer correct type from usage context              |
| `@typescript-eslint/no-unused-vars`  | If truly unused, remove. If needed, use it.        |
| `sonarjs/cognitive-complexity`       | Simplify conditional logic, extract methods        |
| `sonarjs/no-identical-functions`     | Refactor duplicates into shared helper             |

### 4.3 Apply the Fix

```
Edit({
  file_path: issue.file,
  old_string: "...",
  new_string: "..."
})
```

Ensure the fix:

- Preserves existing functionality
- Follows project naming conventions
- Doesn't introduce new issues

### 4.4 Verify the Fix

Lint just that file:

```
sca.lint({ path: issue.file })
```

If the issue is gone, move to the next issue.
If the issue persists, try an alternative approach or mark as manual.

### 4.5 Track Progress

Update the todo list:

```
TodoWrite({
  todos: [
    { content: "Fix complexity in auth.ts", status: "completed", ... },
    { content: "Fix no-any in api.ts", status: "in_progress", ... },
    ...
  ]
})
```

## Step 5: Final Report

After all Claude-fixable issues are addressed:

1. Run final lint:

```
sca.lint({ path: "." })
```

2. Generate summary:

```
## Code Quality Report

### Fixed Issues
- X issues auto-fixed by linters
- Y issues fixed by Claude:
  - Refactored complex function in src/auth.ts
  - Added types to src/api.ts
  - Removed dead code in src/utils.ts

### Remaining Issues (Manual Review Required)
- src/legacy.ts:42 - Deprecated API usage (requires migration)
- src/config.ts:15 - Circular dependency (requires architecture change)

### Statistics
- Total issues found: N
- Auto-fixed: X
- Claude-fixed: Y
- Manual: Z
- Success rate: ((X + Y) / N) * 100%
```

## Error Handling

### ESLint Fails to Run

- Check if project has `tsconfig.json`
- Check if path exists
- Report error to user with diagnostic info

### Fix Introduces New Issues

- Revert the change
- Try alternative fix
- If repeated failures, mark as manual

### Timeout/Rate Limits

- Save progress to todo list
- Report current state
- Allow user to resume

## Tips for Effective Fixes

### Complexity Reduction

- Look for early returns to reduce nesting
- Extract switch/case logic into lookup objects
- Break long if-else chains into separate functions

### Type Inference

- Check function call sites for expected types
- Look at similar code patterns in the codebase
- Use generic types when appropriate

### Dead Code

- Search for usages across the codebase before removing
- Check if it's exported and used elsewhere
- Consider if it's intentionally unused (future use)

## Example Session

```
User: "Run static analysis on this project"

Claude: Let me assess the code quality.

[Calls sca.lint]

Found 47 issues:
- 38 auto-fixable
- 6 Claude-fixable
- 3 manual

Running auto-fix...

[Calls sca.fix]

Auto-fixed 38 issues. Now fixing remaining 6 with Claude...

[For each Claude-fixable issue:]
- Reading src/auth.ts:42 (complexity)
- Extracting validateCredentials() helper function
- Verified: complexity reduced from 15 to 8 ✓

[After all fixes:]

Done! Fixed 44 issues total:
- 38 auto-fixed by linters
- 6 fixed by Claude (refactored 3 complex functions, added types to 2 files, removed 1 dead export)

3 issues require manual review:
- src/legacy.ts:42 - Uses deprecated crypto.createCipher
- src/config.ts:15 - Circular import with types.ts
- tests/e2e.ts:100 - Test timeout configuration

Would you like me to help with any of these?
```
