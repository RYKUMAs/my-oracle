# Oracle Multi-Agent System v2.1

## Overview
ระบบ multi-agent สำหรับ Oracle "Apollo" พร้อม handoff mechanism, pipeline orchestration และ agents ใหม่

## Agents (7/7)

| Agent | Role | Icon | Input | Output |
|-------|------|------|-------|--------|
| **Researcher** 🔍 | วิจัยเทคโนโลยี | Research query | Tech comparison, recommendations |
| **Architect** 🏗️ | System Design | Task/Requirements | Architecture plan, APIs |
| **Engineer** 🔧 | Implementation | Design/Task | Code, files, dependencies |
| **Reviewer** 👀 | Code Review | Implementation | Score, issues, approval |
| **Debugger** 🐛 | Bug Fixing | Error/Logs | Root cause, solutions |
| **Tester** ✅ | Validation | Code/Implementation | Test report, bugs |
| **Documenter** 📚 | Documentation | Code/Architecture | README, API docs |

## Pipelines

### 1. Production Pipeline (NEW!)
```
Researcher → Architect → Engineer → Reviewer → Tester → Documenter
```
ใช้สำหรับ: Production release, deployment

**Keywords:** `production`, `release`, `deploy`, `เอาขึ้น`

### 2. Research Pipeline (NEW!)
```
Researcher → Architect
```
ใช้สำหรับ: วิจัยเทคโนโลยี, เปรียบเทียบ

**Keywords:** `research`, `วิจัย`, `เปรียบเทียบ`, `vs`

### 3. Full Development Pipeline
```
Architect → Engineer → Reviewer → Tester
```
ใช้สำหรับ: Feature ใหม่, งานซับซ้อน

### 4. Bug Fix Pipeline
```
Debugger → Tester
```
ใช้สำหรับ: Bug, error, crash

### 5. Quick Pipeline
```
Engineer → Tester
```
ใช้สำหรับ: Small fix, simple task

## Usage

### เรียก pipeline (แนะนำ)
```
/pipeline สร้าง face recognition API
/pipeline release เอาขึ้น production
/pipeline วิจัย React vs Vue
/pipeline แก้บั๊ก login
```

### เรียก agent เดี่ยว
```
/researcher แนะนำ framework สำหรับ real-time
/architect วาง design ระบบ notification
/engineer implement ตาม design
/reviewer รีวิวโค้ด PR #123
/documenter สร้าง docs สำหรับ project
```

## Architecture

```
                    ┌──────────────────────────────────┐
                    │     PIPELINE ORCHESTRATOR v2.1    │
                    │  (auto-detect + route agents)     │
                    └──────────────────────────────────┘
                                 │
         ┌───────────┬───────────┼───────────┬───────────┐
         ▼           ▼           ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
    │Research │ │Architect│ │Engineer │ │Reviewer │ │Document │
    │   er    │ │         │ │         │ │         │ │   er    │
    └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
         │           │           │           │           │
         └───────────┴───────────┴───────────┴───────────┘
                                 │
         ┌───────────┬───────────┼───────────┬───────────┐
         ▼           ▼           ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
    │Debugger │ │ Tester  │ │  MEMORY │ │ HANDOFF │ │REPORT   │
    └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

## Example Workflows

### Production Release
```
/pipeline release face recognition system

🔍 Researcher: ค้นความต้องการเทคโนโลยี
🏗️  Architect: ออกแบบ pipeline
🔧 Engineer: Implement
👀 Reviewer: Review (8/10) ✅
✅ Tester: Tests passed
📚 Documenter: สร้าง 5 ไฟล์ docs

✅ Ready to deploy!
```

### Quick Bug Fix
```
/pipeline แก้บั๊ก login crash

🐛 Debugger: พบ null pointer exception
✅ Tester: Regression tests passed

✅ Fix applied!
```

## Version History
- **v2.1** — เพิ่ม Researcher, Reviewer, Documenter
- **v2.0** — Pipeline orchestrator + handoff
- **v1.0** — Basic agents (4 ตัวแรก)
