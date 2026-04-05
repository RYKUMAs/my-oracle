module.exports = {
  name: "architect",
  description: "ออกแบบ architecture และ system design",

  execute: async (context) => {
    console.log("🏗️  Architect: กำลังออกแบบระบบ...");

    const task = context.task || context.input || "";
    const memory = context.memory || {};

    // 1. วิเคราะห์ requirements
    const analysis = {
      task_type: detectTaskType(task),
      complexity: estimateComplexity(task),
      constraints: extractConstraints(context)
    };

    // 2. สร้าง design
    const design = {
      timestamp: new Date().toISOString(),
      requirements: task,
      analysis: analysis,
      architecture: {
        pattern: recommendPattern(analysis),
        components: identifyComponents(analysis),
        data_flow: designDataFlow(analysis)
      },
      tech_stack: recommendTechStack(analysis),
      file_structure: proposeFileStructure(analysis),
      api_design: designAPIs(analysis),
      next_steps: generateNextSteps(analysis)
    };

    // 3. บันทึกลง memory
    if (memory.write) {
      memory.write("architecture.md", design);
    }

    console.log("✅ Architect: ออกแบบเสร็จแล้ว");
    console.log("📋 Design:", JSON.stringify(design, null, 2));

    return design;
  }
};

// Helper functions
function detectTaskType(task) {
  if (!task) return "unknown";
  if (task.includes("API") || task.includes("endpoint")) return "api";
  if (task.includes("UI") || task.includes("frontend")) return "frontend";
  if (task.includes("database") || task.includes("schema")) return "database";
  if (task.includes("pipeline") || task.includes("workflow")) return "pipeline";
  return "general";
}

function estimateComplexity(task) {
  const length = task?.length || 0;
  if (length < 50) return "low";
  if (length < 150) return "medium";
  return "high";
}

function extractConstraints(context) {
  return {
    language: context.language || "javascript",
    framework: context.framework || null,
    target: context.target || null
  };
}

function recommendPattern(analysis) {
  const patterns = {
    "api": "REST API + Service Layer",
    "frontend": "Component-based + State Management",
    "database": "Repository Pattern + Migration",
    "pipeline": "Pipeline + Processor Pattern",
    "general": "Modular + Layered Architecture"
  };
  return patterns[analysis.task_type] || patterns.general;
}

function identifyComponents(analysis) {
  const components = {
    "api": ["Controllers", "Services", "Repositories", "Models", "Middleware"],
    "frontend": ["Components", "Hooks/Composables", "State", "API Client", "Router"],
    "database": ["Migrations", "Models/Entities", "Repositories", "Seeders"],
    "pipeline": ["Processors", "Transformers", "Validators", "Handlers"],
    "general": ["Core", "Utils", "Config", "Types/Interfaces"]
  };
  return components[analysis.task_type] || components.general;
}

function designDataFlow(analysis) {
  return {
    input: "User Request / Trigger",
    processing: "Validation → Business Logic → Data Access",
    output: "Response / Event",
    storage: "Database / Cache"
  };
}

function recommendTechStack(analysis) {
  return {
    language: "TypeScript/JavaScript",
    runtime: "Node.js / Deno",
    framework: "Express / Fastify / Next.js",
    database: "PostgreSQL / MongoDB",
    testing: "Jest / Vitest"
  };
}

function proposeFileStructure(analysis) {
  return {
    root: ".",
    src: {
      core: ["services", "utils"],
      features: ["modules"],
      config: ["settings"],
      types: ["interfaces"]
    },
    tests: ["unit", "integration"]
  };
}

function designAPIs(analysis) {
  if (analysis.task_type !== "api") return null;
  return {
    rest: {
      endpoints: ["GET /", "POST /", "PUT /:id", "DELETE /:id"],
      response_format: "JSON"
    }
  };
}

function generateNextSteps(analysis) {
  return [
    "Engineer: implement ตาม design",
    "Tester: เขียน test cases",
    "Review: validate กับ requirements"
  ];
}
