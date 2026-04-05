module.exports = {
  name: "debugger",
  description: "แก้ bug และวิเคราะห์ปัญหา",

  execute: async (context) => {
    console.log("🐛  Debugger: กำลังวิเคราะห์...");

    const error = context.error || context.input || "";
    const code = context.code || context.file || "";
    const memory = context.memory || {};

    // 1. วิเคราะห์ error
    const analysis = analyzeError(error);

    // 2. Trace หาต้นตอ
    const trace = traceRootCause(analysis, code);

    // 3. เสนอ solution
    const solutions = proposeSolutions(trace);

    // 4. สร้าง fix plan
    const fixPlan = {
      timestamp: new Date().toISOString(),
      error: error,
      analysis: analysis,
      root_cause: trace,
      solutions: solutions,
      recommended_fix: solutions[0] || null,
      prevention: generatePrevention(trace),
      regression_tests: generateRegressionTests(trace)
    };

    // 5. บันทึกลง memory
    if (memory.write) {
      const existingDebug = memory.read("debug.md") || { issues: [] };
      existingDebug.issues.push({
        error: error,
        fixed: new Date().toISOString(),
        solution: solutions[0]?.description || "N/A"
      });
      memory.write("debug.md", existingDebug);
    }

    console.log("✅ Debugger: วิเคราะห์เสร็จแล้ว");
    console.log("🎯 Root cause:", trace.cause || "unknown");

    return fixPlan;
  }
};

function analyzeError(error) {
  if (!error) return { type: "unknown", severity: "low" };

  let type = "unknown";
  let severity = "low";

  if (error.includes("TypeError") || error.includes("ReferenceError")) {
    type = "runtime";
    severity = "high";
  } else if (error.includes("SyntaxError")) {
    type = "syntax";
    severity = "critical";
  } else if (error.includes("Network") || error.includes("fetch")) {
    type = "network";
    severity = "medium";
  } else if (error.includes("test") || error.includes("assert")) {
    type = "test";
    severity = "low";
  }

  return { type, severity, message: error };
}

function traceRootCause(analysis, code) {
  return {
    cause: `Potential ${analysis.type} issue`,
    location: code ? "in provided code" : "unknown location",
    related_to: analysis.type,
    context: analysis.message
  };
}

function proposeSolutions(trace) {
  return [
    {
      id: 1,
      description: "Fix the root cause directly",
      approach: "surgical",
      confidence: 0.8
    },
    {
      id: 2,
      description: "Add defensive checks",
      approach: "defensive",
      confidence: 0.6
    }
  ];
}

function generatePrevention(trace) {
  return [
    "Add unit tests for this scenario",
    "Add type checking",
    "Add input validation"
  ];
}

function generateRegressionTests(trace) {
  return [
    `should handle ${trace.related_to} case`,
    "should not crash on similar input"
  ];
}
