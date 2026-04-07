---
name: checkpoint
description: บันทึกจุดของ session เพื่อกู้คืนได้หลัง context เต็ม
---

# Checkpoint Skill

## คำแนะนำ (Instructions)
บันทึก progress ปัจจุบันของ session เพื่อให้พอ context เต็มแล้วเริ่มใหม่ ยังรู้ได้ว่ากำลังทำอะไรอยู่

## ขั้นตอน (Steps)

1. **เก็บข้อมูลเหล่านี้:**
   - git status (files ที่แก้)
   - git log --oneline -5 (commits ล่าสุด)
   - TaskList (ถ้ามี)
   - เวลาปัจจุบัน

2. **สร้าง checkpoint:**
   ```
   J:\CodeAgent\my-oracle\.claude\CHECKPOINT.json
   ```

3. **บันทึก format:**
   ```json
   {
     "timestamp": "2026-04-07T...",
     "branch": "main",
     "modified_files": ["file1.ts", "file2.md"],
     "recent_commits": ["commit1", "commit2"],
     "active_tasks": ["task1", "task2"],
     "context": "กำลังทำอะไรอยู่",
     "next_steps": ["ทำอะไรต่อ"]
   }
   ```

4. **แสดงสรุปให้ผู้ใช้**

## หมายเหตุ
- Checkpoint ใหม่จะเขียนทับอันเก่า (เก็บแค่ล่าสุด)
- ใช้ร่วมกับ `/recap` เพื่อกู้คืน context
