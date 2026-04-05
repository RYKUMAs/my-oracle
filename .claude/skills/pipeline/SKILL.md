---
name: pipeline
description: รัน multi-agent pipeline พร้อม Deep Research + Plan & Confirm (v3.0)
---

# Pipeline Skill v3.0

## 🎯 New Workflow: Research → Plan → Confirm → Build

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  DEEP       │ →  │   PLAN      │ →  │  CONFIRM    │ →  │   BUILD     │
│  RESEARCH   │    │   & SHOW    │    │  (ASK USER) │    │  (execute)  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Pipeline Types (v3.0)

### 1. New Project Pipeline (NEW!)
```
Researcher (Deep) → Planner → [WAIT FOR CONFIRM] → Architect → Engineer → Reviewer → Tester → Documenter
```
ใช้สำหรับ: **โปรเจกต์ใหม่ที่ต้องการ study ลึก**

**Flow:**
1. 🔍 **Deep Research** — ศึกษาลึก 3-5 เท่า
2. 📋 **Plan** — วางแผนพร้อม timeline
3. ⏸️ **CONFIRM** — **แจ้งคุณดู plan → รอ YES**
4. เมื่อคุณตอบ YES → เริ่ม implement

**Keywords:** `โปรเจกต์ใหม่`, `ใหม่`, `new project`

### 2. Research Pipeline (อัปเกรด)
```
Researcher (Deep) → Architect
```
ใช้สำหรับ: วิจัยเทคโนโลยีลึกๆ

**Keywords:** `research`, `วิจัย`, `เปรียบเทียบ`, `vs`, `--deep`

### 3. Production Pipeline
```
Architect → Engineer → Reviewer → Tester → Documenter
```
ใช้สำหรับ: Production release

### 4. Full Development Pipeline
```
Architect → Engineer → Reviewer → Tester
```
ใช้สำหรับ: Feature ใหม่

### 5. Bug Fix Pipeline
```
Debugger → Tester
```

### 6. Quick Pipeline
```
Engineer → Tester
```

## 📋 ตัวอย่าง Flow สำหรับโปรเจกต์ใหม่

```
User: /pipeline สร้างระบบ face recognition

Oracle: 🔍 เริ่ม Deep Research...
        └─ ค้นหา tech options...
        └─ เปรียบเทียบ performance, cost, risk...
        └─ แนะนำ: K230 + MicroPython

        📋 สร้าง Plan...
        └─ Phase 1: Setup (1-2 days)
        └─ Phase 2: Core (1 week)
        └─ Phase 3: Test (2-3 days)
        └─ Total: ~2 weeks

        ⏸️  รอการยืนยัน...

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        📋 PLAN SUMMARY
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Project: Face Recognition System
        Tech: K230 + MicroPython
        Timeline: 2 weeks

        Phases:
        1. Setup (1-2 days)
        2. Core (1 week)
        3. Test (2-3 days)

        Risks: Low complexity, proven tech

        ❓ ตกลงไหม? พิมพ์ YES เพื่อเริ่ม
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User: YES

Oracle: ✅ เริ่ม implement!
        🏗️ Architect...
        🔧 Engineer...
        👀 Reviewer...
        ✅ Tester...
        📚 Documenter...
```

## Usage

```
/pipeline [task]                    → auto-detect
/pipeline โปรเจกต์ใหม่ [ชื่อ]      → new project flow
/researcher [query] --deep          → deep research
/planner [task]                     → plan only
```
