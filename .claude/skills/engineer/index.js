module.exports = {
  name: "engineer",
  description: "เขียนโค้ดและ implement features",

  execute: async (context) => {
    console.log("🔧  Engineer: กำลัง implement...");

    const task = context.task || context.input || "";
    const design = context.design || context.data?.architecture || {};
    const memory = context.memory || {};

    // 1. อ่าน design จาก Architect (ถ้ามี)
    const hasDesign = Object.keys(design).length > 0;

    // 2. วางแผน implementation
    const plan = hasDesign
      ? planFromDesign(design)
      : planFromTask(task);

    // 3. Implement (ในที่นี้คือ generate code plan)
    const implementation = {
      timestamp: new Date().toISOString(),
      task: task,
      based_on: hasDesign ? "architect design" : "task only",
      plan: plan,
      files: generateFileList(plan),
      code_blocks: generateCodeExamples(plan),
      dependencies: identifyDependencies(plan),
      tests: generateTestPlan(plan)
    };

    // 4. บันทึกลง memory
    if (memory.write) {
      memory.write("implementation.md", implementation);
    }

    console.log("✅ Engineer: implementation plan ready");
    console.log("📁 Files:", implementation.files.length);

    return implementation;
  }
};

function planFromDesign(design) {
  return {
    pattern: design.architecture?.pattern || "modular",
    components: design.architecture?.components || [],
    structure: design.file_structure || {}
  };
}

function planFromTask(task) {
  return {
    pattern: "modular",
    components: ["Core", "Utils"],
    structure: { src: {} }
  };
}

function generateFileList(plan) {
  const files = [];

  // Generate based on components
  plan.components?.forEach(comp => {
    files.push({
      path: `src/${comp.toLowerCase()}/index.ts`,
      type: "module",
      description: `${comp} module`
    });
  });

  return files.length > 0 ? files : [{ path: "src/index.ts", type: "entry", description: "Main entry" }];
}

function generateCodeExamples(plan) {
  return {
    example: "// Generated code example\nfunction main() {\n  // Implementation\n}"
  };
}

function identifyDependencies(plan) {
  return {
    runtime: [],
    dev: ["typescript", "jest"]
  };
}

function generateTestPlan(plan) {
  return {
    unit: ["should work correctly"],
    integration: ["should integrate well"]
  };
}
