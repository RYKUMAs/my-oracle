// skills/debugger/index.js
module.exports = {
  name: "debugger",
  description: "นักวิจัยและแก้ไขปัญหา bug และ error",

  execute: async (context) => {
    console.log("🐛 Debugger is tracing errors...");
    // ตัวอย่าง: ตรวจ log, trace stack, หรือแก้ bug
    return "Debugger: bug fixed";
  }
};