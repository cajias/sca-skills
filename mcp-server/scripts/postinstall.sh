#!/bin/bash

# SCA Skills - Multi-Skill Installation Script
# This script copies skill files to Claude Code's skills directory

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SOURCE="$SCRIPT_DIR/../skills"

# Default destination base
DEFAULT_DEST_BASE="$HOME/.claude/skills"
DEST_BASE="${CLAUDE_SKILLS_DIR:-$DEFAULT_DEST_BASE}"

# Colors for output (if terminal supports them)
if [ -t 1 ]; then
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  BLUE='\033[0;34m'
  CYAN='\033[0;36m'
  NC='\033[0m' # No Color
else
  GREEN=''
  YELLOW=''
  BLUE=''
  CYAN=''
  NC=''
fi

echo ""
echo -e "${GREEN}SCA Skills MCP Server installed!${NC}"
echo ""

# Find available skills
AVAILABLE_SKILLS=()
if [ -d "$SKILLS_SOURCE" ]; then
  for skill_dir in "$SKILLS_SOURCE"/*/; do
    if [ -d "$skill_dir" ]; then
      skill_name=$(basename "$skill_dir")
      AVAILABLE_SKILLS+=("$skill_name")
    fi
  done
fi

if [ ${#AVAILABLE_SKILLS[@]} -eq 0 ]; then
  echo "No skills found to install."
  exit 0
fi

echo "This package includes ${#AVAILABLE_SKILLS[@]} Claude Code skill(s):"
echo ""
for i in "${!AVAILABLE_SKILLS[@]}"; do
  skill="${AVAILABLE_SKILLS[$i]}"
  case "$skill" in
    guardrails)
      echo -e "  ${CYAN}[$((i+1))]${NC} ${BLUE}guardrails${NC} - Automated code quality workflow (lint, fix, refactor)"
      ;;
    readme-writer)
      echo -e "  ${CYAN}[$((i+1))]${NC} ${BLUE}readme-writer${NC} - Create exceptional README documentation"
      ;;
    readme-evaluator)
      echo -e "  ${CYAN}[$((i+1))]${NC} ${BLUE}readme-evaluator${NC} - Evaluate README quality with actionable feedback"
      ;;
    *)
      echo -e "  ${CYAN}[$((i+1))]${NC} ${BLUE}$skill${NC}"
      ;;
  esac
done
echo ""
echo -e "Install location: ${BLUE}$DEST_BASE/{skill-name}/${NC}"
echo ""

# Check if running in non-interactive mode (CI/CD)
if [ ! -t 0 ]; then
  echo "Non-interactive mode detected. Skipping skill installation."
  echo "To install manually, run: sca-install-skill"
  exit 0
fi

# Prompt user
echo -e "${YELLOW}Install skills?${NC}"
echo "  [a]     - Install all skills"
echo "  [1,2..] - Install specific skills (comma-separated)"
echo "  [n]     - Skip installation"
echo "  [path]  - Install all to custom base path"
echo ""
read -p "Your choice [a/1,2.../n/path]: " response

# Process response
case "$response" in
  n|N|no|No|NO)
    echo ""
    echo "Skill installation skipped."
    echo "You can install later by running: sca-install-skill"
    exit 0
    ;;
  ""|a|A|all|All|ALL)
    SELECTED_SKILLS=("${AVAILABLE_SKILLS[@]}")
    ;;
  *[!/0-9,]*)
    # Contains non-numeric chars (except comma) - treat as path
    DEST_BASE="$response"
    SELECTED_SKILLS=("${AVAILABLE_SKILLS[@]}")
    ;;
  *)
    # Numeric selection
    SELECTED_SKILLS=()
    IFS=',' read -ra SELECTIONS <<< "$response"
    for sel in "${SELECTIONS[@]}"; do
      sel=$(echo "$sel" | tr -d ' ')
      if [[ "$sel" =~ ^[0-9]+$ ]] && [ "$sel" -ge 1 ] && [ "$sel" -le ${#AVAILABLE_SKILLS[@]} ]; then
        SELECTED_SKILLS+=("${AVAILABLE_SKILLS[$((sel-1))]}")
      fi
    done
    if [ ${#SELECTED_SKILLS[@]} -eq 0 ]; then
      echo "No valid skills selected."
      exit 0
    fi
    ;;
esac

# Install selected skills
echo ""
for skill in "${SELECTED_SKILLS[@]}"; do
  SKILL_SRC="$SKILLS_SOURCE/$skill"
  SKILL_DEST="$DEST_BASE/$skill"

  if [ ! -d "$SKILL_SRC" ]; then
    echo -e "${YELLOW}Warning: Skill '$skill' not found at $SKILL_SRC${NC}"
    continue
  fi

  echo -e "Installing ${BLUE}$skill${NC} to $SKILL_DEST"
  mkdir -p "$SKILL_DEST"
  cp -r "$SKILL_SRC"/* "$SKILL_DEST/"
done

echo ""
echo -e "${GREEN}Skills installed successfully!${NC}"
echo ""
echo "Next steps:"
echo ""
echo "  1. Add the MCP server to Claude Code:"
echo -e "     ${BLUE}claude mcp add sca -- npx @cajias/sca-mcp${NC}"
echo ""
echo "  2. Use skills in Claude Code:"
for skill in "${SELECTED_SKILLS[@]}"; do
  echo -e "     ${BLUE}claude --skill $skill${NC}"
done
echo ""
echo "  Or in interactive mode:"
echo "    - Ask Claude to 'run guardrails' for code quality"
echo "    - Ask Claude to 'write a README' for documentation"
echo "    - Ask Claude to 'evaluate this README' for feedback"
echo ""
