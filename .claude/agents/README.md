# Oracle Multi-Agent System v3.1

## Overview
ระบบ multi-agent สำหรับ Oracle "Apollo" พร้อม **Deep Research + Plan & Confirm + Diagrams**

## 🔥 New in v3.1

### Diagram Generation
- **Documenter v2.0** — สร้าง docs พร้อม diagrams
- **Diagrammer Agent** — สร้าง diagram เฉพาะทาง (Flowchart, Box, Sequence)

## Agents (9/9)

| Agent | Icon | Role | v |
|-------|------|------|---|
| **Researcher** | 🔍 | Deep Research | - |
| **Planner** | 📋 | Plan & Confirm | - |
| **Architect** | 🏗️ | System Design | - |
| **Engineer** | 🔧 | Implementation | - |
| **Reviewer** | 👀 | Code Review | - |
| **Debugger** | 🐛 | Bug Fixing | - |
| **Tester** | ✅ | Validation | - |
| **Documenter** | 📚 | Docs + Diagrams | v2.0 ⭐ |
| **Diagrammer** | 📊 | Diagrams Only | NEW ⭐ |

## Pipelines

### 1. New Project
```
Research → Plan → [CONFIRM] → Build → Docs + Diagrams
```

### 2. Production
```
Architect → Engineer → Reviewer → Tester → Documenter → Diagrammer
```

### 3. Full Development
```
Architect → Engineer → Reviewer → Tester → Documenter
```

## Usage

### เมื่อเสร็จโปรเจกต์ (สร้าง docs + diagrams)

**Option 1: Documenter (เร็ว)**
```
/documenter [project]
```
ได้:
- README.md
- API.md
- ARCHITECTURE.md (พร้อม diagram)
- **FLOWCHART.md** (NEW!)
- CONTRIBUTING.md
- CHANGELOG.md

**Option 2: Diagrammer (เฉพาะ diagrams)**
```
/diagrammer [code] --type=flowchart
/diagrammer [project] --type=all
```
ได้:
- Flowchart (Mermaid)
- Box Diagram
- Sequence Diagram
- Architecture Diagram

**Option 3: ทั้งคู่ (ครบ)**
```
/documenter [project]
/diagrammer [project] --type=all
```

### เปรียบเทียบ

| ต้องการ | ใช้ตัวไหน |
|----------|-----------|
| Docs ครบ + diagram พื้นฐาน | `/documenter` |
| Diagram ลึกๆ / เฉพาะส่วน | `/diagrammer` |
| ทั้งหมด (ครบที่สุด) | `/documenter` → `/diagrammer` |

## Example: เสร็จโปรเจกต์

```
You: /documenter face-recognition

Oracle:
✅ สร้าง 6 ไฟล์:
   - README.md
   - API.md
   - ARCHITECTURE.md (พร้อม diagram)
   - FLOWCHART.md
   - CONTRIBUTING.md
   - CHANGELOG.md

You: /diagrammer face-recognition --type=all

Oracle:
✅ สร้าง 4 diagrams:
   - Flowchart
   - Box Diagram
   - Sequence Diagram
   - Architecture Diagram
```

## Diagram Format

ทุก diagram ใช้ **Mermaid** format — สามารถ:
- Paste ใน GitHub/GitLab/Notion (native support)
- Render ที่ https://mermaid.live
- Export เป็น PNG/SVG

## Version History
- **v3.1** — Documenter v2.0 + Diagrammer agent
- **v3.0** — Deep Research + Plan & Confirm workflow
- **v2.1** — เพิ่ม Researcher, Reviewer, Documenter
- **v2.0** — Pipeline orchestrator + handoff
- **v1.0** — Basic agents (4 ตัวแรก)
