module.exports = {
  name: "documenter",
  description: "สร้าง documentation อัตโนมัติจากโค้ด",

  execute: async (context) => {
    console.log("📚  Documenter: กำลังสร้างเอกสาร...");

    const code = context.code || context.implementation || context.files || [];
    const architecture = context.architecture || context.design || {};
    const project = context.project || context.task || "";
    const memory = context.memory || {};

    // 1. วิเคราะห์โค้ด
    const analysis = analyzeCode(code);

    // 2. สร้าง documents
    const docs = {
      timestamp: new Date().toISOString(),
      project: project,
      files: {}
    };

    // README.md
    docs.files["README.md"] = generateREADME(project, analysis, architecture);

    // API.md (ถ้ามี API)
    if (analysis.hasAPI) {
      docs.files["API.md"] = generateAPI(analysis);
    }

    // ARCHITECTURE.md
    if (architecture && Object.keys(architecture).length > 0) {
      docs.files["ARCHITECTURE.md"] = generateArchitecture(architecture);
    }

    // CONTRIBUTING.md
    docs.files["CONTRIBUTING.md"] = generateContributing();

    // CHANGELOG.md
    docs.files["CHANGELOG.md"] = generateChangelog();

    // 3. สรุป
    docs.summary = {
      total_files: Object.keys(docs.files).length,
      file_list: Object.keys(docs.files),
      next_steps: [
        "Review generated documents",
        "Customize as needed",
        "Commit to repository"
      ]
    };

    // 4. บันทึกลง memory
    if (memory.write) {
      memory.write("docs.md", {
        generated: docs.summary.total_files,
        timestamp: new Date().toISOString()
      });
    }

    console.log(`✅ Documenter: สร้าง ${docs.summary.total_files} ไฟล์เสร็จแล้ว`);

    return docs;
  }
};

function analyzeCode(code) {
  return {
    hasAPI: true,
    hasComponents: true,
    language: "TypeScript/JavaScript",
    file_count: Array.isArray(code) ? code.length : 5
  };
}

function generateREADME(project, analysis, architecture) {
  return `# ${project || "Project Name"}

## Overview
Brief description of the project.

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
\`\`\`bash
npm start
\`\`\`

## Features
- Feature 1
- Feature 2
- Feature 3

## Technology Stack
${analysis.language}

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)

## License
MIT
`;
}

function generateAPI(analysis) {
  return `# API Documentation

## Endpoints

### GET /
Description

### POST /api/resource
Create new resource

**Request Body:**
\`\`\`json
{
  "name": "string",
  "value": "string"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "string",
  "success": true
}
\`\`\`
`;
}

function generateArchitecture(architecture) {
  return `# Architecture

## System Design

\`\`\`
[Client] → [API] → [Service] → [Database]
\`\`\`

## Components
${Object.entries(architecture.architecture?.components || {})
  .map(([key, value]) => `- ${key}: ${value}`)
  .join("\n")}

## Data Flow
1. Request received
2. Validated
3. Processed
4. Response returned
`;
}

function generateContributing() {
  return `# Contributing

## Setup
1. Fork the repo
2. Clone your fork
3. Install dependencies

## Development
\`\`\`bash
npm run dev
npm test
\`\`\`

## Pull Request
1. Create branch
2. Make changes
3. Add tests
4. Submit PR
`;
}

function generateChangelog() {
  const date = new Date().toISOString().split("T")[0];
  return `# Changelog

## [Unreleased]

### Added
- Initial release

### Fixed
- Initial bugs
`;
}
