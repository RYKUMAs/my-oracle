// skills/architect/index.js
module.exports = {
  name: "architect",
  description: "ออกแบบระบบและวางแผน architecture สำหรับโปรเจกต์",
  
  execute: async (context) => {
    console.log("🏗️ Architect is analyzing the system design...");
    // ตัวอย่าง: วิเคราะห์ requirement และออกแบบ module
    return "Architect: system design completed";
  }
};

execute: async (context) => {
  console.log("🏗️ Architect reading memory...");

  const memory = context.memory.read("project.md");

  if (!memory) {
    console.log("⚠️ No memory found, run /learn first");
    return;
  }

  console.log("📦 Loaded Memory:", memory);

  const plan = {
    ...memory,
    architecture: "Pipeline: Camera → Detect → Recognize → Display"
  };

  console.log("📐 Final Plan:", plan);

  return plan;
}