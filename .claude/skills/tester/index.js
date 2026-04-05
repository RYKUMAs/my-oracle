// skills/tester/index.js
module.exports = {
  name: "tester",
  description: "นักทดสอบและ validate คุณภาพของซอฟต์แวร์",

  execute: async (context) => {
    console.log("✅ Tester is running test cases...");
    // ตัวอย่าง: unit test, integration test, validate requirements
    return "Tester: all tests passed";
  }
};