# Oracle Agents

## Overview
Multi-agent system สำหรับ Oracle "Apollo" แต่ละตัวมีบทบาทเฉพาะ

## Agents (4/4)

| Agent | Role | Command |
|-------|------|---------|
| **Architect** | System Design & Architecture | `/architect` |
| **Engineer** | Implementation & Coding | `/engineer` |
| **Debugger** | Bug Fixing & Troubleshooting | `/debugger` |
| **Tester** | Testing & Validation | `/tester` |

## การใช้งาน

### เรียก agent เดียว
```
/engineer สร้าง API สำหรับ login
```

### เรียกหลาย agents พร้อมกัน (ALGORITHM MODE)
```
/architect วาง design ระบบ notification
/engineer implement ตาม design
/tester เขียน test ครอบคลุม
```

## Workflow แนะนำ

งานซับซ้อน → เรียงลำดับ:
1. Architect → Engineer → Tester

งานแก้ bug → Debugger → Tester

งาน prototype → Engineer เดี่ยว

## Note
- Agents ทำงานผ่าน Task tool ใน Claude Code
- แต่ละตัวมี workflow และ output เฉพาะ
