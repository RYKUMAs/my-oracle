---
name: pipeline
description: รัน multi-agent pipeline พร้อม Deep Research + Plan & Confirm + Developer (v3.2)
---

# Pipeline Skill v3.2

## 🎯 New Workflow: Research → Plan → Confirm → Build

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  DEEP       │ →  │   PLAN      │ →  │  CONFIRM    │ →  │   BUILD     │
│  RESEARCH   │    │   & SHOW    │    │  (ASK USER) │    │  (execute)  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Pipeline Types (v3.2)

### 1. New Project (NEW!)
```
Researcher (Deep) → Planner → [WAIT FOR CONFIRM] → Architect → Engineer → Developer → Reviewer → Tester → Documenter
```

### 2. Production
```
Architect → Engineer → Developer → Reviewer → Tester → Documenter
```

### 3. Full Development
```
Architect → Engineer → Developer → Reviewer → Tester
```

### 4. Bug Fix
```
Debugger → Tester
```

### 5. Quick
```
Engineer → Developer → Tester
```

## สายการทำงานทั้งหมด (New)

```
Architect (ออกแบบ)
    ↓
Engineer (วางแผน)
    ↓
Developer (เขียนโค้ดจริง) ← เพิ่มใน v3.2
    ↓
Reviewer (ตรวจ)
    ↓
Tester (ทดสอบ)
    ↓
Documenter (เขียน docs)
```
