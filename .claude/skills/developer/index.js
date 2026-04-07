const DEVELOPER_AVATAR = `
  ██████████████
  ████████  ████████
  ████        ████
  ████  ████  ████
   ██████████████

💻⌨️ Developer
เขียนโค้ด | Code | Implementation
`;

module.exports = {
  name: "developer",
  description: "เขียนโค้ดจริงตาม design",

  execute: async (context) => {
    console.log(DEVELOPER_AVATAR);
    console.log("💻  Developer: กำลังเขียนโค้ด...");

    const task = context.task || context.input || "";
    const design = context.design || context.data?.architecture || {};
    const plan = context.plan || context.data?.implementation || {};
    const lang = context.lang || context.language || "typescript";
    const memory = context.memory || {};

    // 1. วิเคราะห์ design หรือ plan
    const hasDesign = Object.keys(design).length > 0;
    const hasPlan = Object.keys(plan).length > 0;

    // 2. เขียนโค้ดจริง
    const code = generateCode(task, design, plan, lang);

    // 3. สร้างไฟล์
    const files = createFiles(code, lang);

    // 4. บันทึก
    if (memory.write) {
      const existingDev = memory.read("development.md") || { files: [] };
      existingDev.files.push(...files.map(f => f.path));
      memory.write("development.md", existingDev);
    }

    console.log(`✅ Developer: เขียนโค้ดเสร็จ ${files.length} ไฟล์`);

    return {
      files: files,
      language: lang,
      status: "code ready"
    };
  }
};

function generateCode(task, design, plan, lang) {
  return {
    entry: generateEntryPoint(lang),
    modules: generateModules(design, plan, lang),
    types: generateTypes(lang),
    utils: generateUtils(lang)
  };
}

function generateEntryPoint(lang) {
  if (lang === "typescript" || lang === "javascript") {
    return `
import { App } from './app';

const app = new App();

app.init().catch(console.error);
`;
  }
  return "// Entry point";
}

function generateModules(design, plan, lang) {
  const modules = [];

  // Generate จาก components ใน design
  if (design.architecture?.components) {
    design.architecture.components.forEach(comp => {
      modules.push({
        name: comp,
        code: `// ${comp} module\nexport class ${comp} {\n  constructor() {}\n  execute() {}\n}`
      });
    });
  }

  return modules;
}

function generateTypes(lang) {
  if (lang === "typescript") {
    return `
interface Config {
  name: string;
  version: string;
}

interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}
`;
  }
  return "";
}

function generateUtils(lang) {
  return `
export function logger(message: string) {
  console.log(\`[\${new Date().toISOString()}] \${message}\`);
}

export function handleError(error: unknown) {
  console.error(error);
}
`;
}

function createFiles(code, lang) {
  const ext = lang === "typescript" ? "ts" : lang === "javascript" ? "js" : lang;

  return [
    {
      path: `src/index.${ext}`,
      content: code.entry,
      type: "entry"
    },
    {
      path: `src/types.${ext}`,
      content: code.types,
      type: "types"
    },
    {
      path: `src/utils.${ext}`,
      content: code.utils,
      type: "utils"
    },
    {
      path: `src/app.${ext}`,
      content: generateAppCode(lang),
      type: "module"
    }
  ];
}

function generateAppCode(lang) {
  return `
export class App {
  private config = {
    name: "MyApp",
    version: "1.0.0"
  };

  async init() {
    console.log(\`Starting \${this.config.name}...\`);
    // TODO: Implement initialization
  }
}
`;
}
