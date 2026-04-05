---
name: pipeline
description: รัน multi-agent pipeline สำหรับงานซับซ้อน
---

# Pipeline Skill

## คำแนะนำ (Instructions)
เรียก agents หลายตัวตามลำดับที่เหมาะสมกับประเภทงาน

## Pipeline Types

### 1. Full Development Pipeline
```
Architect → Engineer → Tester
```
ใช้สำหรับ: feature ใหม่, งานที่ต้องออกแบบ

### 2. Bug Fix Pipeline
```
Debugger → Tester
```
ใช้สำหรับ: แก้ bug, error, crash

### 3. Quick Implementation
```
Engineer → Tester
```
ใช้สำหรับ: small fix, simple feature

### 4. Architecture Review
```
Architect (เดี่ยว)
```
ใช้สำหรับ: ขอคำแนะนำ design

## ขั้นตอน
1. วิเคราะห์ประเภทงาน
2. เลือก pipeline ที่เหมาะสม
3. เรียก agents ตามลำดับ
4. ส่ง output จาก agent ก่อน → input ของ agent ถัดไป
5. รวมผลและบันทึกลง Memory

## Output
- สรุปผลจากทุก agent
- Handoff data สำหรับ session ถัดไป
- Memory update
