# Oracle Multi-Agent System v2.0

## Overview
ระบบ multi-agent สำหรับ Oracle "Apollo" พร้อม handoff mechanism และ pipeline orchestration

## Agents (4/4)

| Agent | Role | Input | Output |
|-------|------|-------|--------|
| **Architect** | System Design | Task/Requirements | Architecture plan, file structure, APIs |
| **Engineer** | Implementation | Design/Task | Code, files, dependencies |
| **Debugger** | Bug Fixing | Error/Logs | Root cause, solutions, prevention |
| **Tester** | Validation | Code/Implementation | Test report, coverage, bugs |

## Pipelines

### 1. Full Development Pipeline
```
Architect → Engineer → Tester
```
ใช้สำหรับ: Feature ใหม่, งานที่ต้องออกแบบ

**Handoff:**
- Architect → ส่ง design → Engineer
- Engineer → ส่ง implementation → Tester

### 2. Bug Fix Pipeline
```
Debugger → Tester
```
ใช้สำหรับ: Bug, error, crash

**Handoff:**
- Debugger → ส่ง fix plan → Tester (regression tests)

### 3. Quick Pipeline
```
Engineer → Tester
```
ใช้สำหรับ: Small fix, simple task

## Usage

### เรียก agent เดียว
```
/engineer สร้าง API สำหรับ login
```

### เรียก pipeline (แนะนำ)
```
/pipeline สร้างระบบ notification
```
ระบบจะ auto-detect และเลือก pipeline ที่เหมาะสม

### เรียก pipeline แบบระบุ
```
/pipeline แก้บั๊ก login ไม่ได้ --type=bugfix
```

## Implementation Details

### Handoff Data Structure
```javascript
{
  task: "original task",
  pipeline_type: "full|bugfix|quick",
  timestamp: "ISO string",
  data: {
    architecture: { /* Architect output */ },
    implementation: { /* Engineer output */ },
    test: { /* Tester output */ }
  }
}
```

### Memory Integration
ทุก agent บันทึก output ลง `.claude/MEMORY/`:
- `architecture.md` — Architect outputs
- `implementation.md` — Engineer outputs
- `debug.md` — Debugger outputs
- `test.md` — Tester outputs

## Workflow Example

```
User: /pipeline สร้าง face recognition API

Pipeline: 📋 Type = full (complex task)

🏗️  Architect: Designing...
  → Pattern: REST API + Service Layer
  → Components: [Camera, FaceDetect, FaceRecognize, MQTT]

🔧 Engineer: Implementing...
  → Files: 8 generated
  → Dependencies: 5 identified

✅ Tester: Validating...
  → Coverage: 85%
  → Status: APPROVED

✅ Pipeline complete
  → Recommendations: ["Ready to deploy"]
```
