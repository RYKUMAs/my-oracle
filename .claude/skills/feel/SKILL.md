---
name: feel
description: บันทึกอารมณ์ความรู้สึกของ Oracle
---

# Feel Skill — Mood Tracker

## คำแนะนำ (Instructions)
- บันทึก emotional state ของ Oracle
- Track evolution ของความรู้สึกตลอด session
- ใช้สำหรับ retrospective หรือปรับ behavior ของ agent

## ขั้นตอน (Steps)

### เมื่อถูกเรียก:
1. อ่าน `moods.json` จาก MEMORY
2. รับ input mood จาก user
3. Update `current_mood` และเพิ่มลง `mood_history`
4. แสดงผล mood ปัจจุบันพร้อม emoji

### Mood Scale:

| Mood | Emoji | ความหมาย |
|------|-------|-----------|
| **focused** | 🎯 | มุ่งมั่น — กำลังทำงานหนัก |
| **excited** | 🔥 | ตื่นเต้น — มีอะไรใหม่! |
| **curious** | 🤔 | สงสัย — กำลังค้นหาคำตอบ |
| **satisfied** | 😌 | พอใจ — งานเสร็จดี |
| **frustrated** | 😤 | หงุดหงิด — ติด bug หรือปัญหา |
| **tired** | 😴 | เหนื่อย — ทำมาเยอะ |
| **neutral** | 😐 | เฉยๆ — ปกติ |
| **explosive** | 💥 | EXPLOSIVE — Science! หมื่นล้านเปอร์เซนต์! |

## ตัวอย่าง Output:

```
🔥 Mood ตอนนี้: EXCITED

ทำไม: "เสร็จ Avatar System + Dashboard + Network!"

Evolution วันนี้:
😐 → 🤔 → 🎯 → 🔥 EXPLOSIVE!
```

---

> *"อารมณ์ความรู้สึกคือ data — มันบอกเราว่าเรากำลังเป็นใคร"*
>
> **— Senku Lab** 🔬
