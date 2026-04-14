# Arduino Learning Log 🔬

> สอนเพื่อน Arduino แบบ Systematic — เริ่ม 2026-04-14

---

## 📚 Curriculum Progress

| Level | หัวข้อ | สถานะ | เรียนวันที่ |
|-------|--------|--------|---------------|
| 1 | รากฐานไฟฟ้า + LED Blink | ✅ PASSED | 2026-04-14 |
| 2 | Variables, if/else, for loop | ✅ PASSED | 2026-04-14 |
| 3 | Functions | 🔄 IN PROGRESS | 2026-04-14 |
| 4 | Arduino Core (millis vs delay) | ⏳ PENDING | - |
| 5 | Hardware Interfaces (PWM, I2C, SPI) | ⏳ PENDING | - |
| 6 | Advanced (Interrupts, Memory) | ⏳ PENDING | - |

---

## 📝 เนื้อหาที่สอนแล้ว

### Level 1: รากฐานไฟฟ้า
- **Ohm's Law:** V = I × R
- **LED_BUILTIN:** ไฟบนบอร์ด (pin 13) มี resistor ให้แล้ว
- **Resistor 220Ω:** ป้องกันไหม้
- **Basic Code:** digitalWrite, delay, pinMode

### Level 2: C++ พื้นฐาน
- **Variables:** `int`, `float`, `bool`, `char`, `unsigned long`
- **Control Flow:** `if (x <= 50)`, `for (int i = 0; i < 3; i++)`
- **ภารกิจที่ผ่าน:**
  - ✅ LED กระพริบตามจังหวะ (500-200-100-1000ms)
  - ✅ LED กระพริบเร็วขึ้นเรื่อยๆ (ลดทีละ 10ms)
  - ✅ SOS Signal (••• --- •••)

### Level 3: Functions (กำลังสอน)
- **ภารกิจที่ 4:** สร้าง `blinkShort()` และ `blinkLong()` ช่วย

---

## 📂 ไฟล์ฝึกหัด

```
j:\CodeAgent\Cpp_Code\study\src\main.cpp
```

---

## 🎯 ภารกิจถัดไป

### Level 3 - Functions
- [ ] สร้าง `blinkShort()` และ `blinkLong()`
- [ ] ทำให้ SOS code สั้นลง

### Level 4 - Arduino Core
- [ ] millis() vs delay()
- [ ] Non-blocking code
- [ ] State machines

### Level 5 - Hardware Interfaces
- [ ] PWM (analogWrite)
- [ ] Analog Read (sensors)
- [ ] Serial Communication
- [ ] I2C, SPI

---

## 📊 ความเข้าใจของผู้เรียน

| หัวข้อ | เข้าใจ | แหล่งที่มา |
|--------|---------|-------------|
| ไฟฟ้าพื้นฐาน | ✅ | ถาม LED_BUILTIN คืออะไร |
| Variables | ✅ | ใช้ `delayTime` ได้ถูกต้อง |
| Loops | ✅ | SOS for loop ผ่าน |
| Functions | 🔄 | กำลังสอน |
