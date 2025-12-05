/**
 * Canonical Prettier Configuration
 * Matches Python Black settings where applicable (120 char line length)
 */

module.exports = {
  // Line length to match Python Black config
  printWidth: 120,

  // Use single quotes (common in JS ecosystem)
  singleQuote: true,

  // Trailing commas for cleaner diffs
  trailingComma: 'all',

  // Consistent arrow function parentheses
  arrowParens: 'always',

  // Semicolons for clarity
  semi: true,

  // Tab width
  tabWidth: 2,
  useTabs: false,

  // Quote properties only when needed
  quoteProps: 'as-needed',

  // JSX settings
  jsxSingleQuote: false,
  jsxBracketSameLine: false,

  // Bracket spacing
  bracketSpacing: true,

  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',

  // End of line
  endOfLine: 'lf',

  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',

  // Prose wrap
  proseWrap: 'preserve',
};
