// skills/engineer/index.js
module.exports = {
  name: "engineer",
  description: "นักพัฒนาที่เขียนโค้ดและ implement features ตาม design",

  execute: async (context) => {
    console.log("🔧 Engineer is implementing code...");
    // ตัวอย่าง: สร้างฟังก์ชัน, API, หรือ feature
    return "Engineer: implementation done";
  }
};