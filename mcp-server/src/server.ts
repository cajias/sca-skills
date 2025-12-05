#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { fix, FixInput } from './tools/fix.js';
import { lint, LintInput } from './tools/lint.js';

const server = new Server(
  {
    name: 'sca-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'lint',
        description:
          'Run linters on a project and return structured issues. Returns errors categorized by fixability: auto-fixable (by linter tools), Claude-fixable (complexity, types), and manual-only.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to the project or file to lint',
            },
            language: {
              type: 'string',
              enum: ['typescript', 'python', 'auto'],
              description: 'Language to lint (auto-detects if not specified)',
              default: 'auto',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'fix',
        description:
          'Run linter auto-fix on a project. This runs eslint --fix, prettier --write, etc. Only fixes issues that tools can auto-fix; Claude-fixable issues require separate handling.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to the project or file to fix',
            },
            language: {
              type: 'string',
              enum: ['typescript', 'python', 'auto'],
              description: 'Language to fix (auto-detects if not specified)',
              default: 'auto',
            },
          },
          required: ['path'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'lint': {
        const input = args as unknown as LintInput;
        const result = await lint(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }
      case 'fix': {
        const input = args as unknown as FixInput;
        const result = await fix(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: message }),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('SCA MCP server started');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
