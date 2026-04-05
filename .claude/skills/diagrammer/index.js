module.exports = {
  name: "diagrammer",
  description: "สร้าง diagram ประกอบโค้ด (Flowchart, Box, Sequence)",

  execute: async (context) => {
    console.log("📊 Diagrammer: กำลังสร้าง diagram...");

    const code = context.code || context.files || [];
    const target = context.target || context.task || "";
    const diagramType = context.type || context.diagramType || detectDiagramType(target);
    const memory = context.memory || {};

    // 1. วิเคราะห์โค้ด
    const analysis = analyzeCode(code, target);

    // 2. สร้าง diagrams
    const diagrams = generateDiagrams(analysis, diagramType, target);

    // 3. สรุป
    const result = {
      timestamp: new Date().toISOString(),
      target: target,
      diagram_type: diagramType,
      diagrams: diagrams,
      files_created: Object.keys(diagrams),
      usage: {
        mermaid: "Copy to https://mermaid.live",
        plantuml: "Copy to PlantUML editor",
        markdown: "Paste in .md files"
      }
    };

    // 4. บันทึกลง memory
    if (memory.write) {
      const existingDiagrams = memory.read("diagrams.md") || { diagrams: [] };
      existingDiagrams.diagrams.push({
        target: target,
        type: diagramType,
        count: Object.keys(diagrams).length,
        timestamp: new Date().toISOString()
      });
      memory.write("diagrams.md", existingDiagrams);
    }

    console.log(`✅ Diagrammer: สร้าง ${Object.keys(diagrams).length} diagrams เสร็จแล้ว`);

    return result;
  }
};

function detectDiagramType(target) {
  const lower = target.toLowerCase();

  if (lower.includes("flow") || lower.includes("process") || lower.includes("ขั้นตอน")) {
    return "flowchart";
  }
  if (lower.includes("sequence") || lower.includes("interaction") || lower.includes("ลำดับ")) {
    return "sequence";
  }
  if (lower.includes("box") || lower.includes("structure") || lower.includes("โครงสร้าง")) {
    return "box";
  }
  if (lower.includes("arch") || lower.includes("system") || lower.includes("ระบบ")) {
    return "architecture";
  }

  return "all"; // สร้างทุกอย่าง
}

function analyzeCode(code, target) {
  // วิเคราะห์โค้ดเพื่อหา structure
  return {
    has_code: code && (Array.isArray(code) ? code.length > 0 : true),
    target_name: target || "Unknown",
    functions: extractFunctions(code),
    classes: extractClasses(code),
    modules: extractModules(code),
    database: hasDatabase(code),
    api: hasAPI(code)
  };
}

function extractFunctions(code) {
  // จำลองการดึง functions จากโค้ด
  return ["main", "process", "validate", "save"];
}

function extractClasses(code) {
  return ["User", "Service", "Repository"];
}

function extractModules(code) {
  return ["auth", "database", "utils"];
}

function hasDatabase(code) {
  return true;
}

function hasAPI(code) {
  return true;
}

function generateDiagrams(analysis, type, target) {
  const diagrams = {};

  const name = analysis.target_name || "System";

  // Flowchart
  if (type === "all" || type === "flowchart") {
    diagrams.flowchart = generateFlowchart(name, analysis);
  }

  // Box Diagram
  if (type === "all" || type === "box") {
    diagrams.box = generateBoxDiagram(name, analysis);
  }

  // Sequence Diagram
  if (type === "all" || type === "sequence") {
    diagrams.sequence = generateSequenceDiagram(name, analysis);
  }

  // Architecture Diagram
  if (type === "all" || type === "architecture") {
    diagrams.architecture = generateArchitectureDiagram(name, analysis);
  }

  return diagrams;
}

function generateFlowchart(name, analysis) {
  return {
    title: `${name} Flowchart`,
    format: "mermaid",
    code: `flowchart TD
    A[Start] --> B[Initialize]
    B --> C{Validate Input}
    C -->|Valid| D[Process Data]
    C -->|Invalid| E[Return Error]

    D --> F{Save Required?}
    F -->|Yes| G[Save to Database]
    F -->|No| H[Prepare Response]

    G --> H
    H --> I[Return Response]
    E --> I
    I --> J[End]

    style A fill:#e1f5e1
    style J fill:#ffe1e1
    style E fill:#ffe1e1
    style C fill:#fff4e1
    style D fill:#e1f0ff`
  };
}

function generateBoxDiagram(name, analysis) {
  return {
    title: `${name} Structure`,
    format: "mermaid",
    code: `graph TB
    Main[${name} Main]
    Main --> Auth[Auth Module]
    Main --> Service[Service Layer]
    Main --> Utils[Utilities]

    Service --> DB[(Database)]
    Service --> API[API Handler]

    Auth --> User[User Service]
    Auth --> Session[Session Service]

    API --> Controller[Controller]
    API --> Validator[Validator]

    style Main fill:#4a90e2,color:#fff
    style DB fill:#ff6b6b,color:#fff
    style Auth fill:#50c878,color:#fff
    style Service fill:#50c878,color:#fff`
  };
}

function generateSequenceDiagram(name, analysis) {
  return {
    title: `${name} Sequence`,
    format: "mermaid",
    code: `sequenceDiagram
    actor User as 👤 User
    participant API as 🌐 API
    participant Service as ⚙️ Service
    participant DB as 🗄️ Database

    User->>API: Send Request
    API->>API: Validate Request

    alt Invalid Request
        API-->>User: Return 400 Error
    else Valid Request
        API->>Service: Process Data
        Service->>DB: Query Data

        alt Data Found
            DB-->>Service: Return Data
            Service->>Service: Transform Data
            Service-->>API: Return Result
            API-->>User: Return 200 OK
        else Data Not Found
            DB-->>Service: Return Null
            Service-->>API: Return 404
            API-->>User: Return 404 Not Found
        end
    end`
  };
}

function generateArchitectureDiagram(name, analysis) {
  return {
    title: `${name} Architecture`,
    format: "mermaid",
    code: `graph TB
    subgraph "Frontend Layer"
        UI[UI Components]
        State[State Management]
        API_Client[API Client]
    end

    subgraph "Backend Layer"
        Gateway[API Gateway]
        Auth[Auth Service]
        Business[Business Logic]
        Data[Data Service]
    end

    subgraph "Data Layer"
        Cache[(Redis Cache)]
        DB[(PostgreSQL)]
        Files[File Storage]
    end

    UI --> State
    State --> API_Client
    API_Client --> Gateway

    Gateway --> Auth
    Gateway --> Business

    Auth --> Cache
    Auth --> DB

    Business --> Data
    Data --> Cache
    Data --> DB
    Data --> Files

    style Gateway fill:#ff9500,color:#fff
    style Cache fill:#dc382d,color:#fff
    style DB fill:#336791,color:#fff
    style UI fill:#61dafb,color:#000`
  };
}
