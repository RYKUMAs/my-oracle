module.exports = {
  name: "pipeline",
  description: "รัน multi-agent pipeline สำหรับงานซับซ้อน",

  execute: async (context) => {
    console.log("🔄 Pipeline: กำลังเริ่ม workflow...");

    const task = context.task || context.input || "";
    const pipelineType = context.pipeline || detectPipelineType(task);
    const memory = context.memory || {};

    // สร้าง shared context สำหรับ handoff
    const handoff = {
      task: task,
      pipeline_type: pipelineType,
      timestamp: new Date().toISOString(),
      data: {}
    };

    console.log(`📋 Pipeline Type: ${pipelineType}`);

    try {
      // เลือก pipeline ตามประเภทงาน
      const result = await runPipeline(pipelineType, handoff, context);

      // บันทึกสรุปลง memory
      if (memory.write) {
        memory.write("project.md", {
          phase: "completed",
          last_pipeline: pipelineType,
          last_run: new Date().toISOString(),
          result: result.summary
        });
      }

      console.log("✅ Pipeline: เสร็จสมบูรณ์");

      return {
        success: true,
        pipeline_type: pipelineType,
        summary: result.summary,
        handoff: handoff.data,
        recommendations: result.recommendations
      };

    } catch (error) {
      console.error("❌ Pipeline error:", error.message);

      // Debugger fallback
      if (memory.write) {
        memory.write("debug.md", {
          pipeline_error: {
            error: error.message,
            timestamp: new Date().toISOString()
          }
        });
      }

      return {
        success: false,
        error: error.message,
        suggestion: "ลอง /debugger เพื่อวิเคราะห์ปัญหา"
      };
    }
  }
};

function detectPipelineType(task) {
  if (!task) return "quick";

  const lower = task.toLowerCase();

  // Bug indicators
  if (lower.includes("bug") || lower.includes("error") ||
      lower.includes("fix") || lower.includes("crash")) {
    return "bugfix";
  }

  // Complex work indicators
  if (lower.includes("design") || lower.includes("architecture") ||
      lower.includes("system") || lower.includes("feature")) {
    return "full";
  }

  // Default
  return "quick";
}

async function runPipeline(type, handoff, context) {
  const pipelines = {
    // Full: Architect → Engineer → Tester
    full: async () => {
      console.log("🏗️  Phase 1: Architect");
      const architectResult = await runAgent("architect", {
        ...context,
        task: handoff.task
      });
      handoff.data.architecture = architectResult;

      console.log("🔧 Phase 2: Engineer");
      const engineerResult = await runAgent("engineer", {
        ...context,
        task: handoff.task,
        design: architectResult
      });
      handoff.data.implementation = engineerResult;

      console.log("✅ Phase 3: Tester");
      const testerResult = await runAgent("tester", {
        ...context,
        task: handoff.task,
        implementation: engineerResult
      });
      handoff.data.test = testerResult;

      return {
        summary: "Full development pipeline complete",
        recommendations: testerResult.approval === "APPROVED"
          ? ["Ready to deploy"]
          : ["Review test failures", "Fix reported bugs"]
      };
    },

    // Bugfix: Debugger → Tester
    bugfix: async () => {
      console.log("🐛  Phase 1: Debugger");
      const debuggerResult = await runAgent("debugger", {
        ...context,
        error: handoff.task
      });
      handoff.data.debug = debuggerResult;

      console.log("✅ Phase 2: Tester (regression)");
      const testerResult = await runAgent("tester", {
        ...context,
        requirements: "regression tests for: " + handoff.task
      });
      handoff.data.test = testerResult;

      return {
        summary: "Bug fix pipeline complete",
        recommendations: [
          "Apply recommended fix",
          "Run regression tests",
          "Monitor for recurrence"
        ]
      };
    },

    // Quick: Engineer → Tester
    quick: async () => {
      console.log("🔧 Phase 1: Engineer");
      const engineerResult = await runAgent("engineer", {
        ...context,
        task: handoff.task
      });
      handoff.data.implementation = engineerResult;

      console.log("✅ Phase 2: Tester");
      const testerResult = await runAgent("tester", {
        ...context,
        task: handoff.task
      });
      handoff.data.test = testerResult;

      return {
        summary: "Quick implementation complete",
        recommendations: ["Review implementation", "Run tests"]
      };
    }
  };

  return await (pipelines[type] || pipelines.quick)();
}

// Mock agent runner (ในที่นี้ import skills โดยตรง)
async function runAgent(agentName, context) {
  try {
    // Dynamically import the skill
    const skillPath = `../${agentName}/index.js`;
    const skill = require(skillPath);
    return await skill.execute(context);
  } catch (error) {
    return {
      error: `Agent ${agentName} failed: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
}
