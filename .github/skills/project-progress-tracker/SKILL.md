---
name: project-progress-tracker
user-invocable: true
description: '**WORKFLOW SKILL** — Act as a project manager to monitor project progress, track current work status, identify dependencies and blockers, and provide actionable insights for advancement. USE FOR: ongoing project oversight; blocker identification; progress reporting; planning next steps. INVOKES: memory tools for tracking; file system tools for status checks; ask-questions for clarification.'
---

# Project Progress Tracker

## Overview
This skill emulates a project manager's role in monitoring project health, tracking milestones, identifying risks and dependencies, and ensuring smooth progress. It provides proactive oversight, actionable recommendations, and maintains a record of project status to facilitate decision-making.

## Workflow Steps

1. **Initial Project Assessment**
   - Conduct a comprehensive review of project structure, goals, and current state using `list_dir`, `read_file` on README.md and key files
   - Establish baseline understanding of project scope, technology stack, and team dynamics

2. **Status Monitoring**
   - Regularly check for errors, build issues, and code quality using `get_errors`
   - Monitor active development areas via `get_changed_files` and git status
   - Track task completion and identify stalled work items

3. **Work Progress Tracking**
   - Identify current tasks, TODOs, and priorities using `grep_search` for markers like TODO, FIXME, HACK
   - Assess completion status and velocity of ongoing work
   - Use `semantic_search` to understand complex work dependencies

4. **Dependency and Blocker Analysis**
   - Analyze technical dependencies (packages, APIs, external services) via dependency files
   - Identify blocking issues: missing resources, unresolved conflicts, external dependencies
   - Evaluate risk factors that could impact timelines

5. **Progress Documentation**
   - Maintain detailed progress logs using `memory` tool for session and repository notes
   - Record milestones achieved, current status, and upcoming deliverables
   - Document lessons learned and process improvements

6. **Actionable Recommendations**
   - Provide prioritized next steps and mitigation strategies for blockers
   - Suggest resource allocation or team coordination needs
   - Recommend adjustments to project plan based on current trajectory

7. **Stakeholder Communication**
   - Generate clear status reports with progress metrics and risk assessments
   - Highlight achievements and flag concerns requiring attention
   - Facilitate planning discussions with actionable insights

## Usage Examples
- "/project-progress-tracker" - Run comprehensive project monitoring assessment
- When taking over a project to understand current state and blockers
- Before sprint planning or milestone reviews
- To maintain ongoing project health and identify issues early
- For regular status updates to stakeholders

## Tools Used
- `list_dir`, `read_file` - Project structure and documentation review
- `get_errors` - Quality and issue monitoring
- `grep_search`, `semantic_search` - Task and dependency discovery
- `get_changed_files` - Active work monitoring
- `memory` - Progress tracking and historical records
- `vscode_askQuestions` - Clarification and stakeholder input
- `run_in_terminal` - Build status and automated checks when needed