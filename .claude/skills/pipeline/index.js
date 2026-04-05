module.exports = {
  name: "pipeline",
  description: "รัน multi-agent pipeline พร้อม Deep Research + Plan & Confirm (v3.0)",

  execute: async (context) => {
    console.log("🔄 Pipeline v3.0: กำลังเริ่ม workflow...");

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

    // Special handling for new_project flow
    if (pipelineType === "new_project") {
      return await runNewProjectFlow(handoff, context);
    }

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

// New Project Flow: Research → Plan → Confirm → Build
async function runNewProjectFlow(handoff, context) {
  console.log("\n" + "=".repeat(50));
  console.log("🆕 NEW PROJECT WORKFLOW");
  console.log("=".repeat(50) + "\n");

  // Phase 1: Deep Research
  console.log("🔍 Phase 1: Deep Research");
  const researcherResult = await runAgent("researcher", {
    ...context,
    query: handoff.task,
    deep: true,
    deepMode: true
  });
  handoff.data.research = researcherResult;

  // Phase 2: Plan
  console.log("\n📋 Phase 2: Planning");
  const plannerResult = await runAgent("planner", {
    ...context,
    task: handoff.task,
    research: researcherResult
  });

  // Phase 3: CONFIRM - Show plan and wait for user
  console.log("\n" + "=".repeat(50));
  console.log("⏸️  PHASE 3: CONFIRMATION REQUIRED");
  console.log("=".repeat(50) + "\n");

  // Display plan summary
  displayPlanSummary(plannerResult.plan, researcherResult);

  // Return with confirm_required flag
  return {
    status: "AWAITING_CONFIRMATION",
    confirm_required: true,
    research: researcherResult,
    plan: plannerResult.plan,
    questions: plannerResult.questions,
    next_step: "Reply 'YES' or 'ทำต่อ' to start implementation"
  };
}

function displayPlanSummary(plan, research) {
  console.log("┌─────────────────────────────────────────────────────────┐");
  console.log("│                    📋 PLAN SUMMARY                       │");
  console.log("└─────────────────────────────────────────────────────────┘\n");

  console.log(`📁 Project: ${plan.project_name}`);
  console.log(`🎯 Objective: ${plan.overview.objective}`);
  console.log(`⏱️  Duration: ${plan.overview.estimated_duration}`);
  console.log(`💪 Effort: ${plan.overview.estimated_effort}`);
  console.log(`📊 Complexity: ${plan.overview.complexity}\n`);

  if (plan.tech_stack.chosen) {
    console.log("┌─────────────────────────────────────────────────────────┐");
    console.log("│                    🔧 TECH STACK                        │");
    console.log("└─────────────────────────────────────────────────────────┘\n");
    console.log(`✅ Recommended: ${plan.tech_stack.chosen}`);
    console.log(`📝 Reasons:`);
    plan.tech_stack.reasons.forEach((r, i) => console.log(`   ${i + 1}. ${r}`));

    if (plan.tech_stack.alternatives && plan.tech_stack.alternatives.length > 0) {
      console.log(`\n🔄 Alternatives:`);
      plan.tech_stack.alternatives.forEach(a => {
        console.log(`   - ${a.name} (score: ${a.score.toFixed(1)})`);
      });
    }
    console.log("");
  }

  console.log("┌─────────────────────────────────────────────────────────┐");
  console.log("│                   📅 IMPLEMENTATION PHASES               │");
  console.log("└─────────────────────────────────────────────────────────┘\n");
  plan.implementation_phases.forEach(phase => {
    console.log(`Phase ${phase.phase}: ${phase.name} (${phase.duration})`);
    phase.tasks.slice(0, 2).forEach(t => console.log(`  • ${t}`));
    if (phase.tasks.length > 2) console.log(`  • ...`);
    console.log("");
  });

  if (plan.risks && plan.risks.length > 0) {
    console.log("┌─────────────────────────────────────────────────────────┐");
    console.log("│                    ⚠️  RISK ASSESSMENT                    │");
    console.log("└─────────────────────────────────────────────────────────┘\n");
    plan.risks.forEach(risk => {
      console.log(`⚠️  ${risk.risk} (${risk.probability} probability, ${risk.impact} impact)`);
      console.log(`   → ${risk.mitigation}`);
    });
    console.log("");
  }

  console.log("┌─────────────────────────────────────────────────────────┐");
  console.log("│                   ❓ CONFIRMATION                        │");
  console.log("└─────────────────────────────────────────────────────────┘\n");
  console.log("Please review the plan above.");
  console.log("If you agree, type: YES or ทำต่อ");
  console.log("If you want changes, tell me what to adjust.\n");
}

function detectPipelineType(task) {
  if (!task) return "quick";

  const lower = task.toLowerCase();

  // New project indicators
  if (lower.includes("โปรเจกต์ใหม่") || lower.includes("ใหม่") ||
      lower.includes("new project") || lower.includes("สร้างใหม่")) {
    return "new_project";
  }

  // Production indicators
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
    // Production: Architect → Engineer → Reviewer → Tester → Documenter
    production: async () => {
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

      if (reviewerResult.status === "REJECTED") {
        return {
          summary: "Production pipeline stopped - Code rejected",
          recommendations: ["Fix critical issues", "Re-run review"]
        };
      }

      console.log("✅ Phase 4: Tester");
      const testerResult = await runAgent("tester", {
        ...context,
        task: handoff.task,
        implementation: engineerResult
      });
      handoff.data.test = testerResult;

      console.log("📚 Phase 5: Documenter");
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

    // Research: Researcher (Deep) → Architect
    research: async () => {
      console.log("🔍 Phase 1: Researcher (Deep Mode)");
      const researcherResult = await runAgent("researcher", {
        ...context,
        query: handoff.task,
        deep: true,
        deepMode: true
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

// Agent runner
async function runAgent(agentName, context) {
  try {
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
