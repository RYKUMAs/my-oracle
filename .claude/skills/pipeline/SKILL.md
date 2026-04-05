---
name: pipeline
description: รัน multi-agent pipeline สำหรับงานซับซ้อน (v2.1)
---

# Pipeline Skill

## คำแนะนำ (Instructions)
เรียก agents หลายตัวตามลำดับที่เหมาะสมกับประเภทงาน

## Pipeline Types (v2.1)

### 1. Production Pipeline (ใหม่!)
```
Researcher → Architect → Engineer → Reviewer → Tester → Documenter
```
ใช้สำหรับ: Production release, deployment, งานเต็มรูปแบบ

**Keywords:** production, release, deploy, เอาขึ้น

### 2. Research Pipeline (ใหม่!)
```
Researcher → Architect
```
ใช้สำหรับ: วิจัยเทคโนโลยี, เปรียบเทียบ tools

**Keywords:** research, วิจัย, เปรียบเทียบ, vs

### 3. Full Development Pipeline (อัปเกรด)
```
Architect → Engineer → Reviewer → Tester
```
ใช้สำหรับ: feature ใหม่, งานที่ต้องออกแบบ

**Keywords:** design, architecture, system, feature

### 4. Bug Fix Pipeline
```
Debugger → Tester
```
ใช้สำหรับ: แก้ bug, error, crash

**Keywords:** bug, error, fix, crash

### 5. Quick Implementation
```
Engineer → Tester
```
ใช้สำหรับ: small fix, simple feature

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

## New Agents (v2.1)
- **Researcher** 🔍 — วิจัยเทคโนโลยี
- **Reviewer** 👀 — Code review
- **Documenter** 📚 — สร้าง docs
