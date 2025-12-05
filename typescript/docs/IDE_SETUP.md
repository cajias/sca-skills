# IDE Integration

Configure your editor to work seamlessly with this ESLint configuration.

## VS Code

### Required Extensions

Install these extensions:

- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)

```bash
# Install via command line
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

### Workspace Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Per-Language Settings

If you need different formatters for different file types:

```json
{
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Troubleshooting VS Code

#### ESLint Not Working

1. **Check ESLint output panel:**
   - View → Output → Select "ESLint" from dropdown
   - Look for configuration errors

2. **Restart ESLint server:**
   - Cmd/Ctrl + Shift + P
   - Type "ESLint: Restart ESLint Server"

3. **Check ESLint is installed:**

```bash
npm list eslint
```

4. **Verify working directory:**
   - ESLint extension must be able to find your config file
   - Check "eslint.workingDirectories" setting if using monorepo

#### Auto-Fix Not Working

Ensure `source.fixAll.eslint` is enabled in `editor.codeActionsOnSave`.

If still not working:

1. Check ESLint extension is enabled (bottom right of VS Code)
2. Verify file type is in `eslint.validate`
3. Check for conflicting extensions (disable other formatters)

## WebStorm / IntelliJ IDEA

### Enable ESLint

1. **Go to Settings:**
   - macOS: `Preferences` → `Languages & Frameworks` → `JavaScript` → `Code Quality Tools` → `ESLint`
   - Windows/Linux: `Settings` → `Languages & Frameworks` → `JavaScript` → `Code Quality Tools` → `ESLint`

2. **Enable ESLint:**
   - Check "Automatic ESLint configuration"
   - Or manually set "ESLint package" to `node_modules/eslint`

3. **Set Node interpreter:**
   - Should auto-detect, or point to your Node.js installation

### Enable Prettier

1. **Go to Settings:**
   - `Languages & Frameworks` → `JavaScript` → `Prettier`

2. **Configure Prettier:**
   - Set "Prettier package" to `node_modules/prettier`
   - Check "On code reformat"
   - Check "On save"

### Enable Auto-Fix

1. **Go to Settings:**
   - `Tools` → `Actions on Save`

2. **Enable:**
   - Check "Run eslint --fix"
   - Check "Run Prettier"

### Keyboard Shortcuts

Add custom shortcuts for common actions:

1. **Settings** → **Keymap**
2. Search for "Fix ESLint Problems"
3. Right-click → Add Keyboard Shortcut (e.g., `Ctrl+Alt+L`)

## Vim / Neovim

### Using ALE (Asynchronous Lint Engine)

Install ALE:

```vim
" Using vim-plug
Plug 'dense-analysis/ale'
```

Configure in `.vimrc` or `init.vim`:

```vim
" Enable ESLint
let g:ale_linters = {
\   'javascript': ['eslint'],
\   'typescript': ['eslint', 'tsserver'],
\}

" Enable auto-fix on save
let g:ale_fixers = {
\   'javascript': ['eslint', 'prettier'],
\   'typescript': ['eslint', 'prettier'],
\}
let g:ale_fix_on_save = 1

" Customize signs
let g:ale_sign_error = '✗'
let g:ale_sign_warning = '⚠'
```

### Using coc.nvim

Install coc-eslint:

```vim
:CocInstall coc-eslint coc-prettier
```

Configure in `coc-settings.json`:

```json
{
  "eslint.autoFixOnSave": true,
  "prettier.requireConfig": true,
  "coc.preferences.formatOnSaveFiletypes": ["javascript", "typescript", "json"]
}
```

## Emacs

### Using Flycheck

Install flycheck and dependencies:

```elisp
;; In your init.el or .emacs
(use-package flycheck
  :ensure t
  :init (global-flycheck-mode))

(use-package flycheck-eslint
  :ensure t)
```

Configure for TypeScript:

```elisp
(add-hook 'typescript-mode-hook
          (lambda ()
            (flycheck-mode 1)
            (setq flycheck-checker 'javascript-eslint)))
```

### Auto-Fix on Save

```elisp
(defun eslint-fix-file ()
  (interactive)
  (call-process "npx" nil nil nil "eslint" "--fix" (buffer-file-name)))

(add-hook 'after-save-hook
          (lambda ()
            (when (memq major-mode '(js-mode typescript-mode))
              (eslint-fix-file))))
```

## Sublime Text

### Install Packages

Using Package Control:

1. Install "SublimeLinter"
2. Install "SublimeLinter-eslint"
3. Install "JsPrettier"

### Configure SublimeLinter

Settings → Package Settings → SublimeLinter → Settings:

```json
{
  "linters": {
    "eslint": {
      "args": ["--resolve-plugins-relative-to", "."],
      "selector": "source.js, source.ts, source.jsx, source.tsx"
    }
  }
}
```

### Configure Prettier

Settings → Package Settings → JsPrettier → Settings:

```json
{
  "auto_format_on_save": true,
  "auto_format_on_save_excludes": []
}
```

## Common IDE Issues

### "ESLint couldn't find config file"

**Cause:** IDE can't locate `eslint.config.js` or `.eslintrc.js`

**Fix:**

1. Ensure config file is in project root
2. Restart IDE
3. Check IDE's working directory setting

### "Rules not being applied"

**Cause:** IDE using different ESLint version or config

**Fix:**

1. Check IDE is using project's local ESLint (`node_modules/eslint`)
2. Verify `package.json` has correct `eslint` version
3. Clear IDE caches and restart

### "Too slow / IDE freezing"

**Cause:** Type-aware rules are CPU intensive

**Fix:**

1. Disable type-aware linting in editor, use separate type-check command:

```javascript
// eslint.config.js
export default [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: false, // Disable for editor
      },
    },
  },
];
```

2. Run full type-check separately:

```bash
npm run type-check
```

3. Increase IDE memory limits (check IDE docs)

### Prettier and ESLint Conflicts

**Cause:** Running both formatters with conflicting rules

**Fix:**

This config already includes `eslint-config-prettier` to disable conflicting rules. If issues persist:

1. Ensure `eslint-config-prettier` is installed
2. Check it's properly loaded in config
3. Run Prettier first, then ESLint

## Performance Tips

1. **Disable on large files:**

```json
// VS Code settings.json
{
  "eslint.rules.customizations": [{ "rule": "*", "severity": "off", "files": "**/*.min.js" }]
}
```

2. **Exclude node_modules explicitly:**

```javascript
// eslint.config.js
export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  },
  // ... rest of config
];
```

3. **Use ESLint cache:**

```bash
# In package.json scripts
"lint": "eslint . --cache"
```

## Recommended Workflow

1. **Write code** - Don't worry about linting yet
2. **Save file** - Auto-format with Prettier
3. **Auto-fix** - ESLint fixes what it can on save
4. **Review warnings** - Check inline ESLint warnings
5. **Manual fixes** - Address remaining issues
6. **Type check** - Run `npm run type-check` before commit
7. **Pre-commit hook** - Let husky/lint-staged catch any remaining issues

## Further Reading

- [VS Code ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [WebStorm ESLint](https://www.jetbrains.com/help/webstorm/eslint.html)
- [Vim ALE](https://github.com/dense-analysis/ale)
- [coc-eslint](https://github.com/neoclide/coc-eslint)
