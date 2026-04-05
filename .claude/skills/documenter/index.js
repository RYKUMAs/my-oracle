module.exports = {
  name: "documenter",
  description: "สร้าง documentation พร้อม diagram อัตโนมัติ (Upgraded v2.0)",

  execute: async (context) => {
    console.log("📚  Documenter v2.0: กำลังสร้างเอกสาร...");

    const code = context.code || context.implementation || context.files || [];
    const architecture = context.architecture || context.design || {};
    const project = context.project || context.task || "";
    const memory = context.memory || {};
    const includeDiagrams = context.diagrams !== false; // default true

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

    // ARCHITECTURE.md (พร้อม diagram)
    if (architecture && Object.keys(architecture).length > 0) {
      docs.files["ARCHITECTURE.md"] = generateArchitecture(architecture, includeDiagrams);
    }

    // FLOWCHART.md (ใหม่!)
    if (includeDiagrams) {
      docs.files["FLOWCHART.md"] = generateFlowchartDoc(project, analysis);
    }

    // CONTRIBUTING.md
    docs.files["CONTRIBUTING.md"] = generateContributing();

    // CHANGELOG.md
    docs.files["CHANGELOG.md"] = generateChangelog();

    // 3. สรุป
    docs.summary = {
      total_files: Object.keys(docs.files).length,
      file_list: Object.keys(docs.files),
      includes_diagrams: includeDiagrams,
      next_steps: [
        "Review generated documents",
        "Customize as needed",
        "Commit to repository",
        includeDiagrams ? "Check FLOWCHART.md for visual docs" : ""
      ].filter(Boolean)
    };

    // 4. บันทึกลง memory
    if (memory.write) {
      memory.write("docs.md", {
        generated: docs.summary.total_files,
        includes_diagrams: includeDiagrams,
        timestamp: new Date().toISOString()
      });
    }

    console.log(`✅ Documenter: สร้าง ${docs.summary.total_files} ไฟล์เสร็จแล้ว`);
    if (includeDiagrams) {
      console.log(`📊 รวม diagrams ใน ARCHITECTURE.md และ FLOWCHART.md`);
    }

    return docs;
  }
};

function analyzeCode(code) {
  return {
    hasAPI: true,
    hasComponents: true,
    language: "TypeScript/JavaScript",
    file_count: Array.isArray(code) ? code.length : 5,
    modules: extractModules(),
    functions: extractFunctions()
  };
}

function extractModules() {
  return ["Auth", "Database", "API", "Utils"];
}

function extractFunctions() {
  return ["main", "process", "validate", "save"];
}

function generateREADME(project, analysis, architecture) {
  return `# ${project || "Project Name"}

## Overview
Brief description of the project.

## Features
- Feature 1
- Feature 2
- Feature 3

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
\`\`\`bash
npm start
\`\`\`

## Project Structure
\`\`\`
src/
├── auth/          # Authentication module
├── database/      # Database layer
├── api/           # API handlers
├── utils/         # Utilities
└── index.ts       # Entry point
\`\`\`

## Technology Stack
- **Language**: ${analysis.language}
- **Runtime**: Node.js
- **Database**: PostgreSQL

## Documentation
- [API Documentation](API.md)
- [Architecture](ARCHITECTURE.md)
- [Flowchart](FLOWCHART.md)

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)

## License
MIT
`;
}

function generateAPI(analysis) {
  return `# API Documentation

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## Endpoints

### Authentication

#### POST /auth/register
Register new user

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword"
}
\`\`\`

**Response:** 201 Created
\`\`\`json
{
  "id": "user_123",
  "email": "user@example.com",
  "token": "jwt_token_here"
}
\`\`\`

#### POST /auth/login
Login with email and password

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword"
}
\`\`\`

**Response:** 200 OK
\`\`\`json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_123",
    "email": "user@example.com"
  }
}
\`\`\`

### Resources

#### GET /resources
Get all resources

**Response:** 200 OK
\`\`\`json
{
  "data": [],
  "total": 0
}
\`\`\`

#### POST /resources
Create new resource

**Request Body:**
\`\`\`json
{
  "name": "Resource Name",
  "value": "value"
}
\`\`\`

**Response:** 201 Created

## Error Responses

All errors follow this format:
\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
\`\`\`

## Status Codes
- \`200\` - OK
- \`201\` - Created
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`404\` - Not Found
- \`500\` - Internal Server Error
`;
}

function generateArchitecture(architecture, includeDiagrams) {
  const diagramSection = includeDiagrams ? `

## Architecture Diagram

\`\`\`mermaid
graph TB
    Client[Client] --> API[API Gateway]
    API --> Auth[Auth Service]
    API --> Business[Business Logic]
    Business --> DB[(Database)]
    Auth --> DB

    style API fill:#4a90e2,color:#fff
    style DB fill:#ff6b6b,color:#fff
\`\`\`
` : "";

  return `# Architecture

## System Design

### Overview
${architecture.architecture?.pattern || "Layered Architecture"}

### Components
${Object.entries(architecture.architecture?.components || {})
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join("\n")}

### Data Flow
1. Client sends request
2. API Gateway validates
3. Business Logic processes
4. Database operations
5. Response returned
${diagramSection}

## Technology Choices
${Object.entries(architecture.tech_stack || {})
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join("\n")}

## File Structure
\`\`\`
src/
├── core/           # Core business logic
├── infrastructure/ # External services
├── interfaces/     # API/Controllers
└── shared/         # Shared utilities
\`\`\`
`;
}

function generateFlowchartDoc(project, analysis) {
  return `# Flowchart

This document contains visual flowcharts for ${project || "the project"}.

## Main Process Flow

\`\`\`mermaid
flowchart TD
    A[Start] --> B[Initialize]
    B --> C{Validate Input}
    C -->|Valid| D[Process Request]
    C -->|Invalid| E[Return Error]

    D --> F{Authentication Required?}
    F -->|Yes| G[Check Auth Token]
    F -->|No| H[Continue]

    G -->|Valid| H
    G -->|Invalid| E

    H --> I[Execute Business Logic]
    I --> J{Database Operation?}
    J -->|Yes| K[Query Database]
    J -->|No| L[Prepare Response]

    K --> M[Process Results]
    M --> L

    L --> N[Return Response]
    E --> N
    N --> O[End]

    style A fill:#e1f5e1
    style O fill:#ffe1e1
    style E fill:#ffe1e1
    style C fill:#fff4e1
    style G fill:#fff4e1
    style D fill:#e1f0ff
\`\`\`

## Authentication Flow

\`\`\`mermaid
flowchart LR
    User[👤 User] --> Login[Login Page]
    Login --> Submit[Submit Form]
    Submit --> Validate{Validate}

    Validate -->|Valid| Auth[Authenticate]
    Validate -->|Invalid| Error[Show Error]

    Auth --> Check{Check DB}
    Check -->|Found| Token[Generate Token]
    Check -->|Not Found| Error

    Token --> Dashboard[Dashboard]
    Error --> Login

    style User fill:#e1f5e1
    style Dashboard fill:#e1f5e1
    style Error fill:#ffe1e1
\`\`\`

## Data Processing Flow

\`\`\`mermaid
flowchart TD
    Input[Input Data] --> Validate1[Validate Schema]
    Validate1 --> Transform[Transform Data]
    Transform --> Enrich[Enrich Data]
    Enrich --> Validate2{Business Rules}

    Validate2 -->|Pass| Save[Save to DB]
    Validate2 -->|Fail| Log[Log Error]

    Save --> Notify[Send Notification]
    Log --> Notify

    Notify --> Output[Output Result]

    style Input fill:#e1f5e1
    style Output fill:#e1f5e1
    style Log fill:#ffe1e1
\`\`\`

## How to View

1. Copy the Mermaid code
2. Paste at https://mermaid.live
3. Export as PNG/SVG if needed

Or use:
- VS Code with Mermaid preview extension
- GitHub/GitLab (native Mermaid support)
- Notion (native Mermaid support)
`;
}

function generateContributing() {
  return `# Contributing

Thank you for your interest in contributing!

## Setup

1. Fork the repository
2. Clone your fork:
   \`\`\`bash
   git clone https://github.com/your-username/project-name.git
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

## Development

\`\`\`bash
npm run dev    # Start dev server
npm test       # Run tests
npm run lint   # Lint code
\`\`\`

## Making Changes

1. Create a branch:
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. Make your changes

3. Write tests for your changes

4. Ensure all tests pass:
   \`\`\`bash
   npm test
   \`\`\`

5. Commit your changes:
   \`\`\`bash
   git commit -m "feat: add your feature"
   \`\`\`

## Pull Request

1. Push to your fork:
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

2. Open a Pull Request

3. Wait for review

## Code Style

- Use ESLint for linting
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features

## Questions?

Feel free to open an issue!
`;
}

function generateChangelog() {
  const date = new Date().toISOString().split("T")[0];
  return `# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - ${date}

### Added
- Initial project setup
- Core functionality
- API endpoints
- Database integration

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A
`;
}
