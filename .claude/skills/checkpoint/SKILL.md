---
name: checkpoint
description: บันทึกจุดของ session เพื่อกู้คืนได้หลัง context เต็ม
---

# Checkpoint Skill — Daily System 📅

## คำแนะนำ (Instructions)
บันทึก progress ของ **วันนี้** → วันละ 1 ไฟล์ สะสมทุกอย่างไว้ในวันเดียว
→ **ระบบใหม่: เก็บเป็นรายวัน ไม่เป็นราย session อีกต่อไป!**

## ขั้นตอน (Steps)

1. **เก็บข้อมูลเหล่านี้:**
   - git status (files ที่แก้)
   - git log --oneline -5 (commits ล่าสุด)
   - TaskList (ถ้ามี)
   - เวลาปัจจุบัน (YYYY-MM-DD)

2. **Day ID = วันที่วันนี้:**
   ```
   YYYY-MM-DD
   ```
   - ตัวอย่าง: `2026-04-09`

3. **สร้าง/อัปเดต ไฟล์วัน:**
   ```
   .claude/checkpoints/days/YYYY-MM-DD.json
   ```
   → **ถ้าไฟล์มีอยู่แล้ว อัปเดตเพิ่ม ไม่สร้างใหม่!**

4. **Format ไฟล์วัน:**
   ```json
   {
     "day": "2026-04-09",
     "last_update": "2026-04-09T19:30:00+07:00",
     "working_directory": "J:\\CodeAgent\\my-oracle",
     "is_git_repo": true,
     "branch": "main",
     "updates": [
       {
         "time": "14:30",
         "context": "กำลังทำอะไรอยู่",
         "next_steps": ["ทำอะไรต่อ"],
         "status": "in_progress"
       },
       {
         "time": "19:30",
         "context": "ทำต่อจากเดิม เพิ่มเติม...",
         "next_steps": ["ทำอะไรต่อใหม่"],
         "status": "in_progress"
       }
     ],
     "modified_files": ["file1.ts", "file2.md"],
     "untracked_files": [],
     "recent_commits": ["commit1", "commit2"],
     "active_tasks": ["task1", "task2"],
     "pending": ["เรื่องที่ยังไม่เสร็จ"],
     "summary": "สรุปวันนี้ทั้งหมด"
   }
   ```

5. **อัปเดต INDEX.json:**
   ```json
   {
     "days": [
       {
         "day": "2026-04-09",
         "last_update": "2026-04-09T19:30:00+07:00",
         "title": "หัวข้อเดือนวันนี้",
         "status": "in_progress",
         "summary": "สรุปวันนี้แบบสั้นๆ"
       }
     ]
   }
   ```

6. **อัปเดต CHECKPOINT.json:**
   - เหมือนเดิม (เผื่อ /recap ใช้)
   - ใช้ `current_day` แทน `current_session_id`

7. **แสดงสรุปให้ผู้ใช้:**
   - Day: 2026-04-09
   - Update ที่: 19:30
   - สรุปสิ่งที่บันทึก

## หมายเหตุ
- **Day files** → วันละ 1 ไฟล์ อัปเดตรวมทั้งวัน
- **CHECKPOINT.json** → เขียนทับทุกครั้ง
- **INDEX.json** → เก็บประวัติทุกวัน
- `/recap` → อ่านไฟล์วันล่าสุด ได้ context ทั้งวัน

## ตัวอย่างการใช้
```
User: /checkpoint
→ อัปเดต day 2026-04-09 (update ที่ 2)
→ สรุป: "บันทึก progress วันนี้แล้ว"
```

## โครงสร้างไฟล์
```
.claude/
├── CHECKPOINT.json           ← วันปัจจุบัน (เขียนทับ)
├── checkpoints/
│   ├── INDEX.json            ← ประวัติทุกวัน
│   └── days/
│       ├── 2026-04-07.json
│       ├── 2026-04-08.json
│       └── 2026-04-09.json   ← อัปเดตรวมทั้งวัน
```
