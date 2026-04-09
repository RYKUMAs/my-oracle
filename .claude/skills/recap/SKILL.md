---
name: recap
description: สรุปสถานะปัจจุบันของเซสชัน (ฉลาด! อ่าน checkpoint + git + memory + session history)
---

# Recap Skill — Enhanced Version 🔬

## คำแนะนำ (Instructions)
- อ่าน **INDEX.json** ก่อน — ดูประวัติ session ทั้งหมด
- อ่าน **session ล่าสุด** — ดูว่าคราวก่อนทำอะไรไป
- อ่าน **CHECKPOINT.json** — สถานะปัจจุบัน
- อ่าน git status + git log — ดู files ที่แก้
- อ่าน Memory ล่าสุด
- อ่าน TaskList (ถ้ามี)
- รวมทุกอย่างสรุปให้ผู้ใช้

## ขั้นตอน (Steps)

### 1. อ่าน Session History (ใหม่!)
```
.claude/checkpoints/INDEX.json
```
→ ได้: ประวัติทุก session, session ล่าสุดคืออะไร

### 2. อ่าน Session ล่าสุด (ใหม่!)
```
.claude/checkpoints/sessions/[LAST_SESSION].json
```
→ ได้: context, next_steps, pending, status ของ session ก่อนหน้า

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
.claude/MEMORY/dashboard.md
```
→ ได้: agent stats, project status

### 6. อ่าน Tasks
```
TaskList
```
→ ได้: งานที่ค้างอยู่

### 7. สรุปแบบนี้:

```
## 🔬 Session Recap — [Oracle Name]

### 📜 Session ล่าสุด
**Session ID:** [2026-04-09-session1]
**สถานะ:** [completed / incomplete]
**สรุป:** [summary จาก INDEX]

### ⏳ ยังเหลือจากครั้งก่อน
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

### 📊 สถานะโดยรวม
[จาก dashboard.md]

### 📚 ประวัติ Session ล่าสุด
- 2026-04-09: session1 - หัวข้อ...
- 2026-04-08: session2 - หัวข้อ...
- 2026-04-07: session1 - หัวข้อ...
```

## Tips
- ถ้า context เต็ม → เรียก `/checkpoint` ก่อน
- พอมาใหม่ → เรียก `/recap` กู้คืน
- ทำเป็นนิสัย: เริ่ม session = `/recap`, จบ session = `/checkpoint`
- **ระบบใหม่:** recap จะแสดงประวัติ session ให้เห็นภาพรวม!

## โครงสร้าง Session History
```
.claude/checkpoints/
├── INDEX.json            ← อ่านตรงนี้ก่อนเสมอ
└── sessions/
    ├── 2026-04-07-session1.json
    ├── 2026-04-08-session2.json
    └── 2026-04-09-session3.json
```
