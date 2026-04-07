---
name: recap
description: สรุปสถานะปัจจุบันของเซสชัน (ฉลาด! อ่าน checkpoint + git + memory)
---

# Recap Skill — Enhanced Version 🔬

## คำแนะนำ (Instructions)
- อ่าน CHECKPOINT.json ก่อน (ถ้ามี) — จะได้รู้ว่าทำอะไรอยู่
- อ่าน git status + git log — ดู files ที่แก้
- อ่าน Memory ล่าสุด
- อ่าน TaskList (ถ้ามี)
- รวมทุกอย่างสรุปให้ผู้ใช้

## ขั้นตอน (Steps)

### 1. อ่าน Checkpoint (ถ้ามี)
```
.claude/CHECKPOINT.json
```
→ ได้: context, next_steps, active_tasks

### 2. อ่าน Git Status
```
git status
git log --oneline -5
```
→ ได้: modified_files, recent_work

### 3. อ่าน Memory
```
.claude/MEMORY/MEMORY.md
.claude/MEMORY/dashboard.md
```
→ ได้: agent stats, project status

### 4. อ่าน Tasks
```
TaskList
```
→ ได้: งานที่ค้างอยู่

### 5. สรุปแบบนี้:

```
## 🔬 Session Recap — [Oracle Name]

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
```

## Tips
- ถ้า context เต็ม → เรียก `/checkpoint` ก่อน
- พอมาใหม่ → เรียก `/recap` กู้คืน
- ทำเป็นนิสัย: เริ่ม session = `/recap`, จบ session = `/checkpoint`
