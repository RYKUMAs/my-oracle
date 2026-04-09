---
name: checkpoint
description: บันทึกจุดของ session เพื่อกู้คืนได้หลัง context เต็ม
---

# Checkpoint Skill

## คำแนะนำ (Instructions)
บันทึก progress ปัจจุบันของ session เพื่อให้พอ context เต็มแล้วเริ่มใหม่ ยังรู้ได้ว่ากำลังทำอะไรอยู่
→ **ระบบใหม่: เก็บเป็น session แยกไฟล์ พอกลับมาอ่านได้เรื่อง!**

## ขั้นตอน (Steps)

1. **เก็บข้อมูลเหล่านี้:**
   - git status (files ที่แก้)
   - git log --oneline -5 (commits ล่าสุด)
   - TaskList (ถ้ามี)
   - เวลาปัจจุบัน (YYYY-MM-DD)

2. **สร้าง Session ID:**
   ```
   วันที่ + ลำดับ = YYYY-MM-DD-sessionN
   ```
   - อ่าน `.claude/checkpoints/INDEX.json`
   - นับว่าวันนี้มีกี่ session แล้ว
   - session ถัดไป = จำนวนปัจจุบัน + 1
   - ตัวอย่าง: `2026-04-09-session1`, `2026-04-09-session2`

3. **สร้างไฟล์ session:**
   ```
   .claude/checkpoints/sessions/YYYY-MM-DD-sessionN.json
   ```

4. **บันทึก format:**
   ```json
   {
     "id": "2026-04-09-session1",
     "timestamp": "2026-04-09T14:30:00+07:00",
     "date": "2026-04-09",
     "working_directory": "J:\\CodeAgent\\my-oracle",
     "is_git_repo": true,
     "branch": "main",
     "modified_files": ["file1.ts", "file2.md"],
     "untracked_files": [],
     "recent_commits": ["commit1", "commit2"],
     "active_tasks": ["task1", "task2"],
     "context": "กำลังทำอะไรอยู่",
     "next_steps": ["ทำอะไรต่อ"],
     "title": "หัวข้อ session สั้นๆ",
     "status": "in_progress",
     "pending": ["เรื่องที่ยังไม่เสร็จ 1", "เรื่องที่ยังไม่เสร็จ 2"]
   }
   ```

5. **อัปเดต INDEX.json:**
   ```json
   {
     "sessions": [
       {
         "id": "2026-04-09-session1",
         "timestamp": "2026-04-09T14:30:00+07:00",
         "date": "2026-04-09",
         "title": "หัวข้อ session สั้นๆ",
         "status": "in_progress",
         "summary": "สรุป session แบบสั้นๆ 1-2 บรรทัด"
       }
     ]
   }
   ```

6. **อัปเดต CHECKPOINT.json:**
   - เหมือนเดิม (เผื่อ /recap ใช้)
   - แต่เพิ่ม field `current_session_id` ด้วย

7. **แสดงสรุปให้ผู้ใช้:**
   - Session ID: 2026-04-09-sessionX
   - สรุปสิ่งที่บันทึก

## หมายเหตุ
- **Session files** → เก็บไปเรื่อยๆ ไม่จำกัด ค่อยลบเอง
- **CHECKPOINT.json** → เขียนทับทุกครั้ง (เหมือนเดิม)
- **INDEX.json** → เก็บประวัติทุก session
- ใช้ร่วมกับ `/recap` เพื่อกู้คืน context และดู session ก่อนหน้า

## ตัวอย่างการใช้
```
User: /checkpoint
→ บันทึก session 2026-04-09-session1
→ สรุป: "บันทึก session 2026-04-09-session1 แล้ว"
```

## โครงสร้างไฟล์
```
.claude/
├── CHECKPOINT.json           ← session ปัจจุบัน (เขียนทับ)
├── checkpoints/
│   ├── INDEX.json            ← ประวัติทุก session
│   └── sessions/
│       ├── 2026-04-07-session1.json
│       ├── 2026-04-08-session2.json
│       └── 2026-04-09-session3.json
```
