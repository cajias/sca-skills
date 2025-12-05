import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { execa } from 'execa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to our bundled eslint config
const ESLINT_CONFIG_PATH = resolve(
  __dirname,
  '../../node_modules/@sca-skills/eslint-config/eslint.config.js'
);

export interface EslintMessage {
  ruleId: string | null;
  severity: 1 | 2;
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  fix?: {
    range: [number, number];
    text: string;
  };
}

export interface EslintFileResult {
  filePath: string;
  messages: EslintMessage[];
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
}

export interface EslintIssue extends EslintMessage {
  filePath: string;
}

export async function runEslint(targetPath: string, fix: boolean): Promise<EslintFileResult[]> {
  // Resolve the target path
  const resolvedPath = resolve(targetPath);

  // Find the eslint binary in our package's node_modules
  const eslintBin = resolve(__dirname, '../../node_modules/.bin/eslint');

  const args = [resolvedPath, '--format', 'json', '--no-error-on-unmatched-pattern'];

  // Try to use the bundled config, but fall back to project's config if it exists
  try {
    // Check if target project has its own eslint config
    const { stdout: configCheck } = await execa('ls', ['-la', resolvedPath], { reject: false });
    const hasOwnConfig = configCheck.includes('eslint.config') || configCheck.includes('.eslintrc');

    if (!hasOwnConfig) {
      // Use our bundled config
      args.push('--config', ESLINT_CONFIG_PATH);
    }
  } catch {
    // If check fails, try with bundled config
    args.push('--config', ESLINT_CONFIG_PATH);
  }

  if (fix) {
    args.push('--fix');
  }

  try {
    const { stdout } = await execa(eslintBin, args, {
      reject: false, // ESLint exits with non-zero when there are issues
      cwd:
        resolvedPath.endsWith('.ts') || resolvedPath.endsWith('.js')
          ? dirname(resolvedPath)
          : resolvedPath,
    });

    if (!stdout || stdout.trim() === '') {
      return [];
    }

    return JSON.parse(stdout) as EslintFileResult[];
  } catch (error) {
    // If eslint fails completely, return empty results
    console.error('ESLint error:', error);
    return [];
  }
}
