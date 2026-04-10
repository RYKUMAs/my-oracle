---
name: recap
description: สรุปสถานะปัจจุบัน (ฉลาด! อ่าน checkpoint + git + memory + day history)
---

# Recap Skill — Daily Version 📅

## คำแนะนำ (Instructions)
- อ่าน **INDEX.json** ก่อน — ดูประวัติทุกวัน
- อ่าน **day ล่าสุด** — ดูว่าเมื่อวาน/วันนี้ทำอะไรไป
- อ่าน **CHECKPOINT.json** — สถานะปัจจุบัน
- อ่าน git status + git log — ดู files ที่แก้
- อ่าน Memory ล่าสุด
- อ่าน TaskList (ถ้ามี)
- รวมทุกอย่างสรุปให้ผู้ใช้

## ขั้นตอน (Steps)

### 1. อ่าน Day History
```
.claude/checkpoints/INDEX.json
```
→ ได้: ประวัติทุกวัน, วันล่าสุดคืออะไร

### 2. อ่าน Day ล่าสุด
```
.claude/checkpoints/days/[LAST_DAY].json
```
→ ได้: updates ทั้งหมดของวัน, context, next_steps, pending

### 3. อ่าน Checkpoint ปัจจุบัน
```
.claude/CHECKPOINT.json
```
→ ได้: context, next_steps, active_tasks

### 4. อ่าน Git Status
```
git status
git log --oneline -5
```
→ ได้: modified_files, recent_work

### 5. อ่าน Memory
```
.claude/MEMORY/MEMORY.md
```
→ ได้: agent stats, project status

### 6. อ่าน Tasks
```
TaskList
```
→ ได้: งานที่ค้างอยู่

### 7. สรุปแบบนี้:

```
## 🔬 Day Recap — [Oracle Name]

### 📅 วันล่าสุด
**Day:** 2026-04-09
**สถานะ:** [in_progress / completed]
**สรุป:** [summary จาก INDEX]

### 📝 Updates วันนี้
- 14:30 — ทำอะไร...
- 16:00 — ทำต่อ...
- 19:30 — ปิดท้าย...

### ⏳ ยังเหลือจากเมื่อวาน
- [ ] pending item 1
- [ ] pending item 2

### 📍 ตอนนี้ทำอะไรอยู่
จาก checkpoint: [context]

### 📁 ไฟล์ที่แก้
- file1.ts (modified)
- file2.md (modified)

### 📋 งานที่ค้าง
- [ ] Task 1
- [ ] Task 2

### 🎯 Next Steps
1. ...
2. ...

### 📚 ประวัติวันย้อนหลัง
- 2026-04-09 — หัวข้อ...
- 2026-04-08 — หัวข้อ...
- 2026-04-07 — หัวข้อ...
```

## Tips
- ถ้า context เต็ม → เรียก `/checkpoint` ก่อน
- พอมาใหม่ → เรียก `/recap` กู้คืน
- ทำเป็นนิสัย: เริ่มวัน = `/recap`, จบวัน = `/checkpoint`
- **ระบบใหม่:** วันละ 1 ไฟล์ สะสมทุกอย่าง!

## โครงสร้าง Day History
```
.claude/checkpoints/
├── INDEX.json            ← อ่านตรงนี้ก่อนเสมอ
└── days/
    ├── 2026-04-07.json
    ├── 2026-04-08.json
    └── 2026-04-09.json   ← วันนี้ อัปเดตรวม
```
