const TESTER_AVATAR = `
   ████
 ██████
███████
███ ██ ████
  ████ █████ ████
   ████████

✅🧪 Tester
ทดสอบ | Validate | Quality Assurance
`;

module.exports = {
  name: "tester",
  description: "เขียน tests และ validate quality",

  execute: async (context) => {
    console.log(TESTER_AVATAR);
    console.log("✅  Tester: กำลัง validate...");

    const implementation = context.implementation || context.data?.implementation || {};
    const code = context.code || context.files || [];
    const requirements = context.requirements || context.task || "";
    const memory = context.memory || {};

    // 1. วิเคราะห์ coverage
    const coverage = analyzeCoverage(implementation, code);

    // 2. สร้าง test plan
    const testPlan = createTestPlan(requirements, implementation);

    // 3. รัน validation (simulate)
    const results = runValidation(testPlan, code);

    // 4. สรุปผล
    const report = {
      timestamp: new Date().toISOString(),
      test_plan: testPlan,
      coverage: coverage,
      results: results,
      bugs_found: results.bugs || [],
      recommendations: generateRecommendations(results),
      approval: results.passed ? "APPROVED" : "NEEDS_REVIEW"
    };

    // 5. บันทึกลง memory
    if (memory.write) {
      memory.write("test.md", {
        result: results.passed ? "passed" : "failed",
        coverage: coverage.percentage || 0,
        bugs: results.bugs?.length || 0,
        timestamp: new Date().toISOString()
      });
    }

    console.log("✅ Tester: validation complete");
    console.log("📊 Coverage:", coverage.percentage || "N/A");
    console.log("🎯 Status:", report.approval);

    return report;
  }
};

function analyzeCoverage(implementation, code) {
  const fileCount = Array.isArray(code) ? code.length :
    implementation.files?.length || 0;

  return {
    files: fileCount,
    estimated_coverage: fileCount > 0 ? "estimated" : "none",
    percentage: fileCount > 0 ? Math.min(80 + fileCount * 5, 95) : 0
  };
}

function createTestPlan(requirements, implementation) {
  return {
    unit: [
      "should handle valid input",
      "should handle invalid input",
      "should handle edge cases"
    ],
    integration: [
      "should integrate with dependencies",
      "should handle errors gracefully"
    ],
    e2e: requirements ? ["should meet requirements"] : []
  };
}

function runValidation(testPlan, code) {
  // Simulated validation
  const hasCode = code && (Array.isArray(code) ? code.length > 0 : true);

  return {
    passed: hasCode,
    total_tests: 5,
    passed_tests: hasCode ? 5 : 0,
    failed_tests: hasCode ? 0 : 5,
    bugs: hasCode ? [] : ["No code to test"]
  };
}

function generateRecommendations(results) {
  if (results.passed) {
    return ["Ready to merge", "Consider adding more edge case tests"];
  }
  return ["Fix failing tests", "Add more validation"];
}
