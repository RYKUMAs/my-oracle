// multi-agent.js — Full Multi-Agent Oracle with Color-coded Logging, Workflow & Optional Skills
// ================================================================

const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");
const chalk = require("chalk"); // สำหรับสีใน console

// ======================
// Config & Paths
// ======================
const CLAUDE_PATH = path.join(__dirname, "CLAUDE.md");
const MEMORY_DIR = path.join(__dirname, ".claude", "MEMORY");
const SKILLS_DIR = path.join(__dirname, ".claude", "skills");
const LOG_FILE = path.join(__dirname, 'oracle.log');

// ======================
// Logger
// ======================
class Logger {
  constructor(filePath) {
    this.filePath = filePath;
    this.agentColors = {
      'architect': chalk.blue,
      'engineer': chalk.green,
      'debugger': chalk.yellow,
      'tester': chalk.magenta
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
      try { this.memory[file] = JSON.parse(content); } catch { this.memory[file] = content; }
    });
    logger.log(`💾 Memory Loaded: ${Object.keys(this.memory)}`);
  }

  read(file) { return this.memory[file] || null; }

  write(file, data) {
    this.memory[file] = data;
    fs.writeFileSync(path.join(this.basePath, file), JSON.stringify(data, null, 2));
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

  log(message) { this.logger.log(`[${this.name}] ${message}`, this.name); }

  send(target, message) {
    this.log(`Sending message to ${target}: ${message}`);
    this.emit('send', { target, message });
  }

  receive(msg) { this.log(`Received from ${msg.from}: ${msg.message}`); }

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
// Load Skills
// ======================
function loadSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return {};
  const skills = {};
  const skillFolders = fs.readdirSync(SKILLS_DIR);

  // โหลด skills ปกติ
  skillFolders.forEach(folder => {
    const skillFile = path.join(SKILLS_DIR, folder, "SKILL.md");
    if (fs.existsSync(skillFile)) skills[folder] = fs.readFileSync(skillFile, "utf-8");
  });

  // ✅ เพิ่มโค้ดโหลด agents
  const agentNames = ['architect', 'engineer', 'debugger', 'tester'];
  agentNames.forEach(agentName => {
    const agentFile = path.join(__dirname, '.claude', 'agents', `${agentName}.md`);
    if (fs.existsSync(agentFile)) {
      skills[agentName] = fs.readFileSync(agentFile, 'utf-8');
    }
  });

  logger.log(`⚡ Skills Loaded: ${Object.keys(skills)}`);
  return skills;
}

// ======================
// Initialize Agents
// ======================
const architect = new Agent('architect', 'system design', memoryManager, logger);
const engineer  = new Agent('engineer', 'implementation', memoryManager, logger);
const debuggerA = new Agent('debugger', 'bug fixing', memoryManager, logger);
const tester    = new Agent('tester', 'validation', memoryManager, logger);

const agents = { architect, engineer, debugger: debuggerA, tester };

// ======================
// Message Routing
// ======================
for (const [name, agent] of Object.entries(agents)) {
  agent.on('send', ({ target, message }) => {
    if (agents[target]) agents[target].receive({ from: name, message });
    else agent.log(`tried to send to unknown agent: ${target}`);
  });
}

// ======================
// Skill Execution
// ======================
function runSkill(agent, skillName, skillContent) {
  try {
    agent.log(`--- Skill ${skillName} START ---`);
    console.log(skillContent); // placeholder for actual skill execution
    agent.log(`--- Skill ${skillName} END ---`);
  } catch (err) {
    agent.log(`!!! Skill ${skillName} ERROR: ${err.message}`);
  }
}

// ======================
// Multi-Agent Workflow (Async / Sequential)
// ======================
async function runWorkflow(skills) {
  logger.log("🔥 Starting Multi-Agent Workflow...");

  architect.send('engineer', 'Design complete, start implementation');
  architect.updateMemory('project.md', { phase: 'planned' });
  if (skills['awaken']) runSkill(architect, 'awaken', skills['awaken']);
  await new Promise(r => setTimeout(r, 500));

  engineer.send('debugger', 'Implementation complete, ready for debugging');
  engineer.updateMemory('project.md', { phase: 'implemented' });
  if (skills['learn']) runSkill(engineer, 'learn', skills['learn']);
  await new Promise(r => setTimeout(r, 500));

  debuggerA.send('tester', 'Debugging complete, ready for testing');
  debuggerA.updateMemory('project.md', { phase: 'debugged' });
  if (skills['trace']) runSkill(debuggerA, 'trace', skills['trace']);
  await new Promise(r => setTimeout(r, 500));

  tester.send('architect', 'Testing complete, project validated');
  tester.updateMemory('project.md', { phase: 'tested' });
  if (skills['recap']) runSkill(tester, 'recap', skills['recap']);
  await new Promise(r => setTimeout(r, 500));

  logger.log("✅ Multi-Agent Workflow Complete!");
}

// ======================
// Optional Skills Test
// ======================
async function runOptionalSkillsTest(skills) {
  logger.log("🚀 Starting Optional Skills Test...");

  // -------- Session Handoff /forward --------
  logger.log("🔹 Testing Session Handoff (/forward)");
  const projectState = architect.readMemory('project.md');
  engineer.updateMemory('project.md', projectState);
  engineer.log('Session forwarded from architect');

  // -------- Retrospective Insight /rrr --------
  logger.log("🔹 Testing Retrospective Insight (/rrr)");
  if (skills['rrr']) {
    runSkill(architect, 'rrr', skills['rrr']);
  } else {
    logger.log('[rrr] Skill not found, running default summary');
    logger.log(JSON.stringify(memoryManager.memory, null, 2));
  }

  // -------- Communication /talk-to --------
  logger.log("🔹 Testing Communication (/talk-to)");
  architect.send('engineer', 'Hello Engineer! /talk-to test');
  engineer.send('architect', 'Hello Architect! /talk-to reply');

  // -------- Communication /oraclenet --------
  logger.log("🔹 Testing Network Communication (/oraclenet)");
  if (skills['oraclenet']) {
    runSkill(engineer, 'oraclenet', skills['oraclenet']);
  } else {
    logger.log('[oraclenet] Skill not found, simulate API call...');
    logger.log('Engineer connects to OracleNet API successfully');
  }

  // -------- Automation Test /standup, /feel --------
  logger.log("🔹 Testing Automation Skills (/standup, /feel)");
  if (skills['standup']) runSkill(architect, 'standup', skills['standup']);
  if (skills['feel']) runSkill(engineer, 'feel', skills['feel']);

  logger.log("✅ Optional Skills Test Complete!\n");
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
// Run
// ======================
(async () => {
  const oracle = bootOracle();

  // รัน workflow หลัก
  await runWorkflow(oracle.skills);

  // รันทดสอบ Optional Skills
  await runOptionalSkillsTest(oracle.skills);
})();