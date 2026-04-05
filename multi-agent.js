// multi-agent.js — Full Multi-Agent Oracle (Production Ready)
// ==========================================================

const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");
const chalk = require("chalk");

// ======================
// Config & Paths
// ======================
const CLAUDE_PATH = path.join(__dirname, "CLAUDE.md");
const MEMORY_DIR = path.join(__dirname, ".claude", "MEMORY");
const SKILLS_DIR = path.join(__dirname, ".claude", "skills");
const LOG_FILE = path.join(__dirname, "oracle.log");

// ======================
// Logger
// ======================
class Logger {
  constructor(filePath) {
    this.filePath = filePath;
    this.agentColors = {
      architect: chalk.blue,
      engineer: chalk.green,
      debugger: chalk.yellow,
      tester: chalk.magenta,
    };
  }

  writeLog(message) {
    fs.appendFileSync(this.filePath, message + "\n");
  }

  log(message, agentName = null) {
    const time = new Date().toISOString();
    const fullMessage = `[${time}] ${message}`;

    if (agentName && this.agentColors[agentName]) {
      console.log(this.agentColors[agentName](fullMessage));
    } else {
      console.log(fullMessage);
    }

    this.writeLog(fullMessage);
  }
}

const logger = new Logger(LOG_FILE);

// ======================
// Memory Manager
// ======================
class MemoryManager {
  constructor(basePath) {
    this.basePath = basePath;
    if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });
    this.memory = {};
    this.loadMemory();
  }

  loadMemory() {
    const files = fs.readdirSync(this.basePath);
    files.forEach(file => {
      const content = fs.readFileSync(path.join(this.basePath, file), "utf-8");
      try {
        this.memory[file] = JSON.parse(content);
      } catch {
        this.memory[file] = content;
      }
    });
    logger.log(`💾 Memory Loaded: ${Object.keys(this.memory)}`);
  }

  read(file) {
    return this.memory[file] || null;
  }

  write(file, data) {
    this.memory[file] = data;
    fs.writeFileSync(
      path.join(this.basePath, file),
      JSON.stringify(data, null, 2)
    );
    logger.log(`[Memory] Updated ${file}`);
  }
}

const memoryManager = new MemoryManager(MEMORY_DIR);

// ======================
// Agent
// ======================
class Agent extends EventEmitter {
  constructor(name, role, memoryManager, logger) {
    super();
    this.name = name;
    this.role = role;
    this.memoryManager = memoryManager;
    this.logger = logger;
    this.log("ready");
  }

  log(message) {
    this.logger.log(`[${this.name}] ${message}`, this.name);
  }

  send(target, message) {
    this.log(`Sending message to ${target}: ${message}`);
    this.emit("send", { target, message });
  }

  receive(msg) {
    this.log(`Received from ${msg.from}: ${msg.message}`);
  }

  updateMemory(file, data) {
    this.memoryManager.write(file, data);
    this.log(`Updated memory ${file}`);
  }

  readMemory(file) {
    const value = this.memoryManager.read(file);
    this.log(`Read memory ${file}: ${JSON.stringify(value)}`);
    return value;
  }
}

// ======================
// Load CLAUDE.md
// ======================
function loadClaude() {
  if (!fs.existsSync(CLAUDE_PATH)) return null;
  const content = fs.readFileSync(CLAUDE_PATH, "utf-8");
  logger.log("🧠 Loaded CLAUDE.md");
  return content;
}

// ======================
// Load Skills (รองรับ index.js)
// ======================
function loadSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return {};
  const skills = {};
  const skillFolders = fs.readdirSync(SKILLS_DIR);

  skillFolders.forEach(folder => {
    const skillIndex = path.join(SKILLS_DIR, folder, "index.js");
    const skillFile = path.join(SKILLS_DIR, folder, "SKILL.md");

    if (fs.existsSync(skillIndex)) {
      skills[folder] = require(skillIndex); // ✅ ใช้งานจริง
    } else if (fs.existsSync(skillFile)) {
      skills[folder] = fs.readFileSync(skillFile, "utf-8"); // fallback
    }
  });

  logger.log(`⚡ Skills Loaded: ${Object.keys(skills)}`);
  return skills;
}

// ======================
// Initialize Agents
// ======================
const architect = new Agent("architect", "system design", memoryManager, logger);
const engineer = new Agent("engineer", "implementation", memoryManager, logger);
const debuggerA = new Agent("debugger", "bug fixing", memoryManager, logger);
const tester = new Agent("tester", "validation", memoryManager, logger);

const agents = { architect, engineer, debugger: debuggerA, tester };

// ======================
// Message Routing
// ======================
for (const [name, agent] of Object.entries(agents)) {
  agent.on("send", ({ target, message }) => {
    if (agents[target]) {
      agents[target].receive({ from: name, message });
    } else {
      agent.log(`tried to send to unknown agent: ${target}`);
    }
  });
}

// ======================
// Workflow
// ======================
async function runWorkflow(skills) {
  logger.log("🔥 Starting Multi-Agent Workflow...");

  architect.send("engineer", "Design complete");
  architect.updateMemory("project.md", { phase: "planned" });
  await new Promise(r => setTimeout(r, 300));

  engineer.send("debugger", "Implementation complete");
  engineer.updateMemory("project.md", { phase: "implemented" });
  await new Promise(r => setTimeout(r, 300));

  debuggerA.send("tester", "Debugging complete");
  debuggerA.updateMemory("project.md", { phase: "debugged" });
  await new Promise(r => setTimeout(r, 300));

  tester.send("architect", "Testing complete");
  tester.updateMemory("project.md", { phase: "tested" });

  logger.log("✅ Workflow Complete!");
}

// ======================
// 🔥 AI Pipeline (สำคัญสุด)
// ======================
async function runAIPipeline(skills, memoryManager) {
  logger.log("🧠 Running AI Learning Pipeline...");

  if (skills["learn"]?.execute) {
    await skills["learn"].execute({
      memory: memoryManager,
      agents
    });
  } else {
    logger.log("⚠️ learn skill not found or invalid");
  }

  if (skills["architect"]?.execute) {
    await skills["architect"].execute({
      memory: memoryManager,
      agents
    });
  } else {
    logger.log("⚠️ architect skill not found or invalid");
  }

  logger.log("✅ AI Pipeline Complete!");
}

// ======================
// Oracle Boot
// ======================
function bootOracle() {
  logger.log("🔥 Oracle Booting...");
  loadClaude();
  const skills = loadSkills();
  logger.log("✅ Oracle Ready!\n");
  return { agents, skills, memoryManager };
}

// ======================
// MAIN
// ======================
(async () => {
  const oracle = bootOracle();

  await runWorkflow(oracle.skills);

  // 🔥 ตัวจริง
  await runAIPipeline(oracle.skills, oracle.memoryManager);

})();