---
name: planner
description: วางแผนงานและขอการยืนยันก่อนเริ่มทำ (Plan & Confirm)
---

# Planner Skill

## คำแนะนำ (Instructions)
วางแผนงานอย่างละเอียดและขอการยืนยันจากผู้ใช้ก่อนเริ่ม implement

## ขั้นตอน (Steps)

### Phase 1: วิเคราะห์
- อ่าน research results (ถ้ามี)
- วิเคราะห์ requirements
- ระบุ scope และ boundaries

### Phase 2: วางแผน
- แบ่งงานเป็น phases
- ระบุ deliverables แต่ละ phase
- ประเมณ effort และ timeline
- ระบุ risks และ mitigations

### Phase 3: สร้างเอกสารแผน
- Project overview
- Tech stack (จาก research)
- Implementation phases
- Timeline estimate
- Resource requirements
- Risk assessment

### Phase 4: แจ้งและขอยืนยัน
- แสดงแผนงานอย่างละเอียด
- อธิบายสิ่งที่จะทำ
- ขอ approval จากผู้ใช้
- **รอ YES ก่อนเริ่มทำ**

## Output
- Plan document อย่างละเอียด
- Questions สำหรับ confirm
- **ไม่เริ่ม implement จนกว่าผู้ใช้จะตอบ YES**

## Usage
```
/planner [ชื่อโปรเจกต์/งาน]
```

หรือใช้อัตโนมัติหลังจาก `/researcher --deep`
