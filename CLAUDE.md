## Multi-Agent System

Available agents:
- architect → system design
- engineer → implementation
- debugger → bug fixing
- tester → validation

Always select the best agent before solving a task.

## Agent Selection Rule

- If task involves error → use debugger
- If task involves coding → use engineer
- If task involves validation → use tester

## Autonomous Execution Rule

For complex tasks:
- Use dev-loop workflow
- Continue until verified success
- Do NOT stop at partial completion

## Workflow Rule

For complex, technical, or multi-step tasks:
- Automatically use dev-loop workflow
- Continue until solution is verified
- Do NOT stop at first answer

## Project Structure Rule

When creating code:

- ALWAYS organize files into proper folders
- NEVER place all code in root directory

### Required structure:

- /src → source code
- /tests → test files
- /scripts → utility scripts
- /config → configuration files

### Rules:
- Create folders if they do not exist
- Place each file in the correct directory
- Keep root clean (only CLAUDE.md, README.md)


## File Creation Rule

When generating code:

1. First define project structure
2. Then create folders
3. Then create files inside folders

DO NOT write code before defining structure

## Skills

Available skills:
- debug-python → fix Python errors
- motor-debug → debug stepper motor
- vision-pipeline → optimize camera pipeline

Prefer using skills over raw reasoning

## Web Development Rule

For web-related tasks:
- Use web-engineer agent
- Use web-project skill
- Always create structured project

Never:
- Put everything in one file

## Learning Rule

When given a URL:
- Read and extract key knowledge
- Summarize into structured format
- Save into .claude/MEMORY.md under reference

## Knowledge Rule

Always read:
- .claude/MEMORY.md
- .claude/KNOWLEDGE.md
before answering

## Knowledge Write Rule

When using web-learning skill:
- MUST append knowledge into .claude/KNOWLEDGE.md
- Use clear sections
- Do not overwrite existing content


## Startup Knowledge Load

At session start:
- Read .claude/KNOWLEDGE.md
- Apply knowledge in all answers

## MicroPython Rule

For embedded or hardware tasks:
- Use micropython-engineer agent
- Use micropython-dev skill
- Ensure compatibility with MicroPython

Never:
- Use unsupported Python libraries