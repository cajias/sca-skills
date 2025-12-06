/**
 * Canonical ESLint Configuration for AI-Generated Code
 *
 * This package provides strict ESLint configurations that mirror the Python
 * package rules, adapted for JavaScript/TypeScript patterns.
 *
 * @module @lint-configs/eslint-config
 */

// Export the legacy configuration (default export)
module.exports = require('./.eslintrc.js');

// Also export named exports for both formats
module.exports.flat = require('./eslint.config.js');
module.exports.legacy = require('./.eslintrc.js');
