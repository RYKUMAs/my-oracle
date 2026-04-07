// session-end.js — Auto-update history on session end
// =======================================================

const fs = require("fs");
const path = require("path");

const HISTORY_FILE = path.join(__dirname, "../../MEMORY/history.md");
const DASHBOARD_FILE = path.join(__dirname, "../../MEMORY/dashboard.md");

class SessionTracker {
  constructor() {
    this.session = {
      startTime: new Date().toISOString(),
      endTime: null,
      agentsUsed: [],
      skillsUsed: [],
      tasks: [],
      commits: [],
      mood: "neutral"
    };
  }

  trackAgent(agentName) {
    if (!this.session.agentsUsed.includes(agentName)) {
      this.session.agentsUsed.push(agentName);
    }
  }

  trackSkill(skillName) {
    if (!this.session.skillsUsed.includes(skillName)) {
      this.session.skillsUsed.push(skillName);
    }
  }

  trackTask(task) {
    this.session.tasks.push({
      task: task,
      time: new Date().toISOString()
    });
  }

  trackCommit(hash, message) {
    this.session.commits.push({
      hash: hash,
      message: message,
      time: new Date().toISOString()
    });
  }

  setMood(mood) {
    this.session.mood = mood;
  }

  endSession() {
    this.session.endTime = new Date().toISOString();
    this.updateHistory();
    this.updateDashboard();
  }

  updateHistory() {
    let content = "";

    if (fs.existsSync(HISTORY_FILE)) {
      content = fs.readFileSync(HISTORY_FILE, "utf-8");
    } else {
      content = "# Session History — Senku Lab\n\n> บันทึกทุกการทดลองที่ผ่าน\n\n## 📋 Log\n\n";
    }

    const date = new Date().toISOString().split("T")[0];
    const entry = this.formatHistoryEntry();

    // Append to history
    if (content.includes(`### ${date}`)) {
      // Add to existing date
      content = content.replace(
        `(### ${date})`,
        `$1\n${entry}`
      );
    } else {
      // New date entry
      content += `\n### ${date}\n\n${entry}\n`;
    }

    fs.writeFileSync(HISTORY_FILE, content);
  }

  formatHistoryEntry() {
    const duration = this.session.endTime
      ? Math.round((new Date(this.session.endTime) - new Date(this.session.startTime)) / 1000 / 60)
      : 0;

    return `| ${this.session.startTime.split("T")[1].slice(0, 5)} | ${this.session.skillsUsed.join(", ") || "—"} | ${this.session.agentsUsed.join(", ") || "—"} | ${duration} min |`;
  }

  updateDashboard() {
    // Update stats in dashboard.md
    if (!fs.existsSync(DASHBOARD_FILE)) return;

    let dashboard = fs.readFileSync(DASHBOARD_FILE, "utf-8");

    // Update recent activity
    const activityEntry = `
${this.session.endTime.split("T")[0]}
├─ Agents: ${this.session.agentsUsed.join(", ") || "none"}
├─ Skills: ${this.session.skillsUsed.join(", ") || "none"}
├─ Commits: ${this.session.commits.length}
└─ Mood: ${this.session.mood}
`;

    dashboard = dashboard.replace(
      /(## 📜 Recent Activity\n\n```[\s\S]*?```)/,
      `## 📜 Recent Activity\n\n\`\`\`${activityEntry}\`\`\``
    );

    fs.writeFileSync(DASHBOARD_FILE, dashboard);
  }
}

module.exports = SessionTracker;
