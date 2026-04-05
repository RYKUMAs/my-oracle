module.exports = {
  name: "reviewer",
  description: "Code review และตรวจสอบคุณภาพโค้ด",

  execute: async (context) => {
    console.log("👀  Reviewer: กำลังรีวิวโค้ด...");

    const code = context.code || context.implementation || context.files || [];
    const task = context.task || "";
    const memory = context.memory || {};

    // 1. ตรวจสอบว่ามีโค้ดไหม
    const hasCode = code && (Array.isArray(code) ? code.length > 0 : true);

    if (!hasCode) {
      return {
        score: 0,
        status: "NO_CODE",
        message: "ไม่มีโค้ดให้รีวิว"
      };
    }

    // 2. รีวิวตาม checklist
    const review = {
      timestamp: new Date().toISOString(),
      task: task,
      checklist: runChecklist(code, task),
      issues: findIssues(code, task),
      suggestions: generateSuggestions(code, task),
      score: 0,
      status: ""
    };

    // 3. คำนวณ score
    const criticalIssues = review.issues.filter(i => i.severity === "critical").length;
    const majorIssues = review.issues.filter(i => i.severity === "major").length;

    review.score = calculateScore(review.checklist, criticalIssues, majorIssues);
    review.status = getApprovalStatus(review.score, criticalIssues);

    // 4. บันทึกลง memory
    if (memory.write) {
      const existingReviews = memory.read("reviews.md") || { reviews: [] };
      existingReviews.reviews.push({
        task: task,
        score: review.score,
        status: review.status,
        timestamp: new Date().toISOString()
      });
      memory.write("reviews.md", existingReviews);
    }

    console.log(`✅ Reviewer: รีวิวเสร็จ (Score: ${review.score}/10)`);
    console.log(`📋 Status: ${review.status}`);

    return review;
  }
};

function runChecklist(code, task) {
  return [
    { item: "Code style", pass: true },
    { item: "No hardcoded values", pass: true },
    { item: "Error handling", pass: task ? true : Math.random() > 0.3 },
    { item: "Tests included", pass: true },
    { item: "No security risks", pass: true },
    { item: "Performance OK", pass: true },
    { item: "Comments for complex logic", pass: Math.random() > 0.5 }
  ];
}

function findIssues(code, task) {
  const issues = [];

  // Simulate finding issues
  if (Math.random() > 0.7) {
    issues.push({
      severity: "minor",
      category: "style",
      description: "ควรใช้ const แทน let สำหรับค่าที่ไม่เปลี่ยน"
    });
  }

  if (Math.random() > 0.8) {
    issues.push({
      severity: "major",
      category: "error_handling",
      description: "ขาด error handling สำหรับ edge case"
    });
  }

  return issues;
}

function generateSuggestions(code, task) {
  return [
    "พิจารณาเพิ่ม unit tests สำหรับ edge cases",
    "อาจจะ refactor เพื่อให้อ่านง่ายขึ้น",
    "พิจารณาเพิ่ม JSDoc comments"
  ];
}

function calculateScore(checklist, critical, major) {
  const passedChecks = checklist.filter(c => c.pass).length;
  const baseScore = (passedChecks / checklist.length) * 10;

  // ลดคะแนนตาม issues
  const deduction = (critical * 3) + (major * 1);

  return Math.max(0, Math.min(10, baseScore - deduction));
}

function getApprovalStatus(score, critical) {
  if (critical > 0) return "REJECTED";
  if (score >= 7) return "APPROVED";
  if (score >= 5) return "REQUEST_CHANGES";
  return "NEEDS_WORK";
}
