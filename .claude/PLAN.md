# Multi-Agent Pipeline System - Implementation Plan

## Phase 1: Orchestrator Core (สร้างตัวคุม)
- [ ] สร้าง `/pipeline` skill — คุมลำดับ agents
- [ ] สร้าง shared context system — handoff data
- [ ] เชื่อมกับ Memory system

## Phase 2: Agent Skills Enhancement (อัปเกรด agents)
- [ ] Architect → อ่าน requirements → สร้าง design → บันทึก memory
- [ ] Engineer → อ่าน design → implement code → run tests
- [ ] Debugger → อ่าน error → trace → fix → verify
- [ ] Tester → อ่าน code → write tests → report

## Phase 3: Handoff Mechanism (ส่งต่อข้อมูล)
- [ ] สร้าง `handoff.json` — shared state
- [ ] Agent → บันทึก output → ต่อ agent อ่าน
- [ ] Rollback ถ้า agent ล้มเหลว

## Phase 4: Testing
- [ ] ทดสอบ pipeline: Architect → Engineer → Tester
- [ ] ทดสอบ debug pipeline: Debugger → Tester
- [ ] Benchmark performance

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PIPELINE ORCHESTRATOR                 │
│  (รับ command → แบ่ง task → dispatch agents → รวมผล)   │
└─────────────────────────────────────────────────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐
    │Architect│ ───→ │Engineer │ ───→ │ Tester  │
    └─────────┘      └─────────┘      └─────────┘
         │                                  │
         └──────→ ┌─────────┐ ←─────────────┘
                  │Debugger │  (ถ้ามี bug)
                  └─────────┘
                        │
                        ▼
                  ┌──────────┐
                  │  MEMORY  │  (บันทึกทุกอย่าง)
                  └──────────┘
```
