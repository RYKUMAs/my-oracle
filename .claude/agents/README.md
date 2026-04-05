# Oracle Multi-Agent System v3.0

## Overview
ระบบ multi-agent สำหรับ Oracle "Apollo" พร้อม **Deep Research + Plan & Confirm** workflow

## 🔥 New in v3.0

### New Project Workflow
```
Deep Research → Plan → [CONFIRM] → Build
```

สำหรับโปรเจกต์ใหม่:
1. 🔍 **Deep Research** — ศึกษาลึก 3-5 เท่า
2. 📋 **Plan** — วางแผนพร้อม timeline
3. ⏸️ **CONFIRM** — **แจ้งคุณดู → รอ YES**
4. ✅ เมื่อคุณตอบ YES → เริ่ม implement

## Agents (8/8)

| Agent | Role | Icon | สำหรับ |
|-------|------|------|---------|
| **Researcher** 🔍 | Deep Research | วิจัยเทคโนโลยีลึกๆ |
| **Planner** 📋 | Plan & Show | วางแผน + แจ้ง |
| **Architect** 🏗️ | System Design | ออกแบบ architecture |
| **Engineer** 🔧 | Implementation | เขียนโค้ด |
| **Reviewer** 👀 | Code Review | ตรวจคุณภาพ |
| **Debugger** 🐛 | Bug Fixing | แก้ปัญหา |
| **Tester** ✅ | Validation | เทส |
| **Documenter** 📚 | Documentation | เขียน docs |

## Pipelines

### 1. New Project (NEW!)
```
Researcher (Deep) → Planner → [WAIT CONFIRM] → Architect → Engineer → Reviewer → Tester → Documenter
```
ใช้สำหรับ: **โปรเจกต์ใหม่**

**Keywords:** `โปรเจกต์ใหม่`, `ใหม่`, `new project`

### 2. Research (Deep)
```
Researcher (Deep) → Architect
```
ใช้สำหรับ: วิจัยลึก

### 3. Production
```
Architect → Engineer → Reviewer → Tester → Documenter
```

### 4. Full Development
```
Architect → Engineer → Reviewer → Tester
```

### 5. Bug Fix
```
Debugger → Tester
```

### 6. Quick
```
Engineer → Tester
```

## Usage

### สำหรับโปรเจกต์ใหม่ (แนะนำ)
```
/pipeline โปรเจกต์ใหม่ [ชื่อโปรเจกต์]
```

**ตัวอย่าง:**
```
/pipeline โปรเจกต์ใหม่ ระบบ face recognition
```

**Flow:**
1. 🔍 Deep Research → ได้ recommendation
2. 📋 Plan → ได้ timeline
3. ⏸️ **แจ้งคุณดู** → พิมพ์ `YES` เพื่อเริ่ม
4. ✅ Implement → เริ่มสร้างจริง

### สำหรับงานทั่วไป
```
/pipeline [task]              → auto-detect
/architect [task]             → ออกแบบ
/engineer [task]              → implement
/researcher [query] --deep    → วิจัยลึก
/planner [task]               → วางแผน
/documenter [project]         → สร้าง docs
```

## Example: New Project Flow

```
You: /pipeline โปรเจกต์ใหม่ ระบบ face recognition

Oracle:
🔍 Phase 1: Deep Research
   └─ Comparing: K230 vs ESP32 vs Raspberry Pi
   └─ Recommendation: K230 + MicroPython
   └─ Confidence: 85%

📋 Phase 2: Planning
   └─ Phase 1: Setup (1-2 days)
   └─ Phase 2: Core (1 week)
   └─ Phase 3: Test (2-3 days)
   └─ Total: ~2 weeks

⏸️  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📋 PLAN SUMMARY
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Project: Face Recognition System
   Tech: K230 + MicroPython
   Timeline: 2 weeks

   ❓ ตกลงไหม? พิมพ์ YES เพื่อเริ่ม
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You: YES

Oracle: ✅ เริ่ม implement!
   🏗️ Architect...
   🔧 Engineer...
   👀 Reviewer...
   ✅ Tester...
   📚 Documenter...

   ✅ เสร็จแล้ว!
```

## Version History
- **v3.0** — Deep Research + Plan & Confirm workflow
- **v2.1** — เพิ่ม Researcher, Reviewer, Documenter
- **v2.0** — Pipeline orchestrator + handoff
- **v1.0** — Basic agents (4 ตัวแรก)
