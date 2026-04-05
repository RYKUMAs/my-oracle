module.exports = {
  name: "pipeline",
  description: "รัน multi-agent pipeline สำหรับงานซับซ้อน (v2.1)",

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

  // Production indicators (full + docs)
  if (lower.includes("production") || lower.includes("release") ||
      lower.includes("deploy") || lower.includes("เอาขึ้น")) {
    return "production";
  }

  // Research indicators
  if (lower.includes("research") || lower.includes("วิจัย") ||
      lower.includes("เปรียบเทียบ") || lower.includes("vs")) {
    return "research";
  }

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
    // Production: Researcher → Architect → Engineer → Reviewer → Tester → Documenter
    production: async () => {
      console.log("🔍 Phase 1: Researcher");
      const researcherResult = await runAgent("researcher", {
        ...context,
        query: handoff.task
      });
      handoff.data.research = researcherResult;

      console.log("🏗️  Phase 2: Architect");
      const architectResult = await runAgent("architect", {
        ...context,
        task: handoff.task,
        research: researcherResult
      });
      handoff.data.architecture = architectResult;

      console.log("🔧 Phase 3: Engineer");
      const engineerResult = await runAgent("engineer", {
        ...context,
        task: handoff.task,
        design: architectResult
      });
      handoff.data.implementation = engineerResult;

      console.log("👀 Phase 4: Reviewer");
      const reviewerResult = await runAgent("reviewer", {
        ...context,
        task: handoff.task,
        implementation: engineerResult
      });
      handoff.data.review = reviewerResult;

      if (reviewerResult.status === "REJECTED") {
        return {
          summary: "Production pipeline stopped - Code rejected",
          recommendations: ["Fix critical issues", "Re-run review"]
        };
      }

      console.log("✅ Phase 5: Tester");
      const testerResult = await runAgent("tester", {
        ...context,
        task: handoff.task,
        implementation: engineerResult
      });
      handoff.data.test = testerResult;

      console.log("📚 Phase 6: Documenter");
      const documenterResult = await runAgent("documenter", {
        ...context,
        task: handoff.task,
        implementation: engineerResult,
        architecture: architectResult
      });
      handoff.data.docs = documenterResult;

      return {
        summary: "Production pipeline complete",
        recommendations: [
          testerResult.approval === "APPROVED" ? "Tests passed" : "Review test failures",
          `Docs generated: ${documenterResult.summary?.total_files || 0} files`,
          reviewerResult.score >= 7 ? "Code approved" : "Review requested changes"
        ]
      };
    },

    // Research: Researcher → Architect
    research: async () => {
      console.log("🔍 Phase 1: Researcher");
      const researcherResult = await runAgent("researcher", {
        ...context,
        query: handoff.task
      });
      handoff.data.research = researcherResult;

      console.log("🏗️  Phase 2: Architect (optional design)");
      const architectResult = await runAgent("architect", {
        ...context,
        task: handoff.task,
        research: researcherResult
      });
      handoff.data.architecture = architectResult;

      return {
        summary: "Research pipeline complete",
        recommendations: [
          `Recommended: ${researcherResult.recommendation?.name || "See research results"}`,
          "Review architecture proposal"
        ]
      };
    },

    // Full: Architect → Engineer → Reviewer → Tester
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

      console.log("👀 Phase 3: Reviewer");
      const reviewerResult = await runAgent("reviewer", {
        ...context,
        task: handoff.task,
        implementation: engineerResult
      });
      handoff.data.review = reviewerResult;

      console.log("✅ Phase 4: Tester");
      const testerResult = await runAgent("tester", {
        ...context,
        task: handoff.task,
        implementation: engineerResult
      });
      handoff.data.test = testerResult;

      return {
        summary: "Full development pipeline complete",
        recommendations: [
          reviewerResult.status === "APPROVED" ? "Code approved" : "Review feedback",
          testerResult.approval === "APPROVED" ? "Tests passed" : "Fix test failures",
          "Consider /documenter for docs"
        ]
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
