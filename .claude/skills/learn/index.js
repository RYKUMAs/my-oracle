module.exports = {
  name: "learn",
  description: "สำรวจ codebase และบันทึก insight",

  execute: async (context) => {
    console.log("🔍 Learning from codebase...");

    // 🔥 ตัวอย่าง insight (คุณสามารถ parse จริงได้ภายหลัง)
    const insight = {
      project: "K230 Face Recognition",
      detected_modules: [
        "face_detection",
        "face_recognition",
        "camera_pipeline"
      ],
      language: "MicroPython",
      source: "examples/05-AI-Demo"
    };

    console.log("🧠 Insight:", insight);

    // ✅ บันทึกลง memory
    context.memory.write("project.md", insight);

    return insight;
  }
};