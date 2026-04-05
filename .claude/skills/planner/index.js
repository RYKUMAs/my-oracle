module.exports = {
  name: "planner",
  description: "วางแผนงานและขอการยืนยันก่อนเริ่มทำ",

  execute: async (context) => {
    console.log("📋 Planner: กำลังวางแผน...");

    const task = context.task || context.input || "";
    const research = context.research || context.data?.research || null;
    const memory = context.memory || {};

    if (!task) {
      return {
        error: "กรุณาระบุงานที่ต้องการวางแผน"
      };
    }

    // 1. วิเคราะห์งาน
    const analysis = analyzeTask(task, research);

    // 2. วางแผน phases
    const phases = createPhases(analysis, research);

    // 3. ประเมิน effort และ timeline
    const estimates = createEstimates(phases, analysis);

    // 4. ระบุ risks
    const risks = identifyRisks(analysis, research);

    // 5. สร้าง plan document
    const plan = {
      timestamp: new Date().toISOString(),
      project_name: extractProjectName(task),
      overview: {
        objective: task,
        scope: analysis.scope,
        complexity: analysis.complexity,
        estimated_duration: estimates.total_duration,
        estimated_effort: estimates.total_effort
      },
      tech_stack: research?.recommendation
        ? {
            chosen: research.recommendation.name,
            reasons: research.recommendation.reasons,
            alternatives: research.recommendation.alternatives
          }
        : { note: "Run /researcher first for tech stack recommendation" },
      implementation_phases: phases,
      timeline: estimates.timeline,
      resources: {
        skills_needed: analysis.required_skills,
        tools_needed: analysis.required_tools,
        infrastructure: analysis.infrastructure
      },
      risks: risks,
      next_steps: [
        "Review this plan",
        "Confirm tech stack",
        "Approve to start implementation"
      ]
    };

    // 6. สร้าง questions สำหรับ confirm
    const confirmQuestions = generateConfirmQuestions(plan, research);

    // 7. บันทึก plan
    if (memory.write) {
      memory.write("plan.md", plan);
    }

    console.log("✅ Planner: วางแผนเสร็จแล้ว");
    console.log("⏸️  รอการยืนยันจากคุณ...");

    return {
      status: "AWAITING_CONFIRMATION",
      plan: plan,
      confirm_required: true,
      questions: confirmQuestions,
      instruction: "กรุณาตรวจสอบแผนงานด้านบน หากตกลง ตอบว่า 'YES' หรือ 'ทำต่อ' เพื่อเริ่ม implementation"
    };
  }
};

function extractProjectName(task) {
  // แยกชื่อโปรเจกต์จาก task
  const words = task.split(" ").slice(0, 5).join(" ");
  return words.length > 30 ? words.substring(0, 30) + "..." : words;
}

function analyzeTask(task, research) {
  return {
    scope: estimateScope(task),
    complexity: estimateComplexity(task),
    required_skills: identifyRequiredSkills(task, research),
    required_tools: identifyRequiredTools(task, research),
    infrastructure: identifyInfrastructure(task, research)
  };
}

function estimateScope(task) {
  const length = task.length;
  if (length < 50) return "small";
  if (length < 150) return "medium";
  return "large";
}

function estimateComplexity(task) {
  const keywords = {
    high: ["architecture", "system", "distributed", "microservices", "real-time", "ai", "ml"],
    medium: ["api", "database", "authentication", "integration"],
    low: ["fix", "update", "add", "change"]
  };

  const lower = task.toLowerCase();

  for (const [level, words] of Object.entries(keywords)) {
    if (words.some(w => lower.includes(w))) {
      return level;
    }
  }

  return "medium";
}

function identifyRequiredSkills(task, research) {
  const baseSkills = ["JavaScript/TypeScript", "Git"];

  if (research?.recommendation?.name) {
    baseSkills.push(research.recommendation.name);
  }

  const lower = task.toLowerCase();
  if (lower.includes("api")) baseSkills.push("REST API Design");
  if (lower.includes("database")) baseSkills.push("Database Design");
  if (lower.includes("ui") || lower.includes("frontend")) baseSkills.push("Frontend Framework");
  if (lower.includes("real-time")) baseSkills.push("WebSockets/Real-time");

  return baseSkills;
}

function identifyRequiredTools(task, research) {
  const tools = ["VS Code", "Git"];

  if (research?.recommendation?.name) {
    tools.push(research.recommendation.name);
  }

  return tools;
}

function identifyInfrastructure(task, research) {
  return {
    development: "Local machine",
    testing: "Local/CI",
    production: "To be determined"
  };
}

function createPhases(analysis, research) {
  const basePhases = [
    {
      phase: 1,
      name: "Setup & Initialization",
      duration: "1-2 days",
      tasks: [
        "Initialize project",
        "Setup development environment",
        "Configure tools",
        "Setup repository"
      ],
      deliverables: ["Project scaffold", "Dev environment ready"]
    },
    {
      phase: 2,
      name: "Core Implementation",
      duration: analysis.scope === "small" ? "2-3 days" : "1-2 weeks",
      tasks: [
        "Implement core features",
        "Build data models",
        "Create APIs/Components",
        "Integration testing"
      ],
      deliverables: ["Working core features", "Unit tests", "API docs"]
    },
    {
      phase: 3,
      name: "Refinement & Testing",
      duration: "2-5 days",
      tasks: [
        "Code review",
        "Integration testing",
        "Performance testing",
        "Bug fixes",
        "Documentation"
      ],
      deliverables: ["Tested code", "Documentation", "Ready for deploy"]
    },
    {
      phase: 4,
      name: "Deployment",
      duration: "1 day",
      tasks: [
        "Prepare production build",
        "Deploy to staging",
        "Final testing",
        "Production deployment"
      ],
      deliverables: ["Live application", "Deployment guide"]
    }
  ];

  return basePhases;
}

function createEstimates(phases, analysis) {
  const totalDays = phases.reduce((sum, p) => {
    const duration = p.duration.match(/(\d+)\s*-\s*(\d+)/);
    if (duration) {
      return sum + (parseInt(duration[1]) + parseInt(duration[2])) / 2;
    }
    const single = p.duration.match(/(\d+)/);
    return sum + (single ? parseInt(single[1]) : 1);
  }, 0);

  return {
    total_duration: `${Math.ceil(totalDays)} days`,
    total_effort: `${Math.ceil(totalDays * 8)} hours`,
    timeline: {
      phase_1: phases[0].duration,
      phase_2: phases[1].duration,
      phase_3: phases[2].duration,
      phase_4: phases[3].duration
    }
  };
}

function identifyRisks(analysis, research) {
  const risks = [
    {
      risk: "Scope creep",
      probability: "medium",
      impact: "high",
      mitigation: "Clear requirements, regular check-ins"
    },
    {
      risk: "Technical challenges",
      probability: "low",
      impact: "medium",
      mitigation: "Research completed, proven tech stack"
    },
    {
      risk: "Timeline overrun",
      probability: "low",
      impact: "medium",
      mitigation: "Buffer time in estimates"
    }
  ];

  if (analysis.complexity === "high") {
    risks.push({
      risk: "Complexity underestimation",
      probability: "medium",
      impact: "high",
      mitigation: "Deep research, incremental approach"
    });
  }

  return risks;
}

function generateConfirmQuestions(plan, research) {
  return [
    "✅ ตรวจสอบ plan ด้านบนแล้วใช่ไหม?",
    `✅ เห็นด้วยกับ tech stack "${plan.tech_stack.chosen || 'TBD'}" ไหม?`,
    `✅ Timeline ${plan.overview.estimated_duration} เป็นที่ยอมรับได้ไหม?`,
    `✅ ต้องการ adjust scope หรือ phases ไหม?`,
    "",
    "**หากตกลงทุกอย่าง** → พิมพ์ `YES` หรือ `ทำต่อ` เพื่อเริ่ม implementation",
    "**หากต้องการแก้ไข** → บอกสิ่งที่ต้องการเปลี่ยน"
  ];
}
