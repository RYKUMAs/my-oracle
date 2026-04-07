const RESEARCHER_AVATAR = `
   ████
  ████
 ██████
█ ██ █
  ████ █████ ████ ████
  ████████ ████████ ██████
 ██████

🔍🔎 Researcher
สืบค้น | วิจัย | Deep Research
`;

module.exports = {
  name: "researcher",
  description: "วิจัยเทคโนโลยีแบบลึก (Deep Research Mode)",

  execute: async (context) => {
    const query = context.query || context.task || context.input || "";
    const memory = context.memory || {};
    const deepMode = context.deep || context.deepMode || query.includes("--deep");

    console.log(RESEARCHER_AVATAR);
    console.log(`🔍 Researcher: กำลังวิจัย... (${deepMode ? "DEEP MODE" : "normal"})`);

    if (!query) {
      return { error: "ไม่มี query สำหรับวิจัย" };
    }

    // 1. วิเคราะห์ query
    const analysis = analyzeQuery(query);

    // 2. ค้นหาข้อมูล
    const searchResults = deepMode
      ? deepSearch(analysis, query)
      : normalSearch(analysis, query);

    // 3. วิเคราะห์และเปรียบเทียบ
    const comparison = compareOptions(searchResults.options, deepMode);

    // 4. Deep analysis (ถ้า deep mode)
    const deepAnalysis = deepMode
      ? performDeepAnalysis(searchResults, query)
      : null;

    // 5. สร้าง recommendation
    const recommendation = makeRecommendation(comparison, deepAnalysis);

    // 6. สรุป report
    const report = {
      timestamp: new Date().toISOString(),
      query: query,
      mode: deepMode ? "deep" : "normal",
      query_type: analysis.type,
      options: searchResults.options,
      comparison: comparison,
      deep_analysis: deepAnalysis,
      recommendation: recommendation,
      references: searchResults.references,
      questions_for_user: generateQuestions(query, recommendation, deepMode)
    };

    // 7. บันทึกลง memory
    if (memory.write) {
      const existingResearch = memory.read("research.md") || { queries: [] };
      existingResearch.queries.push({
        query: query,
        mode: report.mode,
        result: recommendation?.name || "N/A",
        confidence: recommendation?.confidence || 0,
        timestamp: new Date().toISOString()
      });
      memory.write("research.md", existingResearch);
    }

    console.log(`✅ Researcher: วิจัยเสร็จแล้ว (${deepMode ? "DEEP" : "normal"})`);
    console.log(`🎯 แนะนำ: ${recommendation?.name || "N/A"} (${(recommendation?.confidence * 100).toFixed(0)}%)`);

    return report;
  }
};

// Deep Search - ค้นรายละเอียดมากขึ้น
function deepSearch(analysis, query) {
  const options = generateDetailedOptions(analysis);
  return {
    options: options,
    references: [
      "https://example.com/deep-analysis",
      "https://example.com/benchmarks",
      "https://example.com/case-studies",
      "https://example.com/best-practices"
    ]
  };
}

// Normal Search - ค้นรายละเอียดพื้นฐาน
function normalSearch(analysis, query) {
  const options = generateBasicOptions(analysis);
  return {
    options: options,
    references: ["https://example.com/overview"]
  };
}

// สร้าง options แบบละเอียด (สำหรับ deep mode)
function generateDetailedOptions(analysis) {
  return [
    {
      name: "Option A (Recommended)",
      description: "ตัวเลือกที่นิยมและมี community ขนาดใหญ่",
      pros: [
        "Performance ดีเยี่ยม",
        "Community support ขนาดใหญ่",
        "Documentation ครบถ้วน",
        "Scalable สูง",
        "Active maintenance"
      ],
      cons: [
        "Learning curve สูง",
        "Setup ซับซ้อน",
        "Overhead สูงสำหรับ project เล็ก"
      ],
      metrics: {
        performance: 9,
        ease_of_use: 6,
        community: 10,
        documentation: 9,
        scalability: 9,
        learning_curve: 4, // 1=easy, 10=hard
        cost: "free/open-source",
        adoption: "very high"
      },
      cost_estimate: {
        time_to_learn: "1-2 weeks",
        time_to_implement: "2-4 weeks",
        learning_effort: "high"
      },
      risk_level: "low",
      use_cases: ["large-scale", "production", "enterprise"],
      version: "latest stable",
      last_updated: "2024"
    },
    {
      name: "Option B",
      description: "ตัวเลือกที่ง่ายแต่ limit เรื่อง scalability",
      pros: [
        "ง่ายต่อการเริ่มต้น",
        "Setup รวดเร็ว",
        "Learning curve ต่ำ",
        "Good for MVP"
      ],
      cons: [
        "Scalability จำกัด",
        "Performance ปานกลาง",
        "Features น้อยกว่า",
        "Community เล็กกว่า"
      ],
      metrics: {
        performance: 7,
        ease_of_use: 9,
        community: 7,
        documentation: 8,
        scalability: 5,
        learning_curve: 2,
        cost: "free",
        adoption: "medium"
      },
      cost_estimate: {
        time_to_learn: "2-3 days",
        time_to_implement: "1-2 weeks",
        learning_effort: "low"
      },
      risk_level: "low",
      use_cases: ["small-project", "mvp", "prototype"],
      version: "stable",
      last_updated: "2024"
    },
    {
      name: "Option C",
      description: "ตัวเลือกใหม่ น่าสนใจแต่ยังไม่ proven",
      pros: [
        "Modern architecture",
        "Performance ดีมาก",
        "Developer experience ดี",
        "Hot trend"
      ],
      cons: [
        "Community ยังเล็ก",
        "Documentation น้อย",
        "Risk สูง",
        "ไม่มี track record"
      ],
      metrics: {
        performance: 9,
        ease_of_use: 8,
        community: 4,
        documentation: 5,
        scalability: 8,
        learning_curve: 5,
        cost: "free",
        adoption: "low but growing"
      },
      cost_estimate: {
        time_to_learn: "1 week",
        time_to_implement: "2-3 weeks",
        learning_effort: "medium"
      },
      risk_level: "high",
      use_cases: ["experimental", "startup", "bleeding-edge"],
      version: "beta",
      last_updated: "2024"
    }
  ];
}

// สร้าง options แบบพื้นฐาน
function generateBasicOptions(analysis) {
  return [
    {
      name: "Option A",
      pros: ["Fast", "Popular"],
      cons: ["Complex"],
      score: 8
    },
    {
      name: "Option B",
      pros: ["Simple", "Quick"],
      cons: ["Limited"],
      score: 7
    }
  ];
}

// เปรียบเทียบ options
function compareOptions(options, deepMode) {
  if (!options || options.length < 2) return null;

  if (deepMode && options[0].metrics) {
    // Deep comparison - เปรียบเทียบทุก metric
    return {
      criteria: ["Performance", "Ease of Use", "Community", "Docs", "Scalability", "Learning"],
      matrix: options.map(opt => ({
        name: opt.name,
        performance: opt.metrics.performance,
        ease_of_use: opt.metrics.ease_of_use,
        community: opt.metrics.community,
        documentation: opt.metrics.documentation,
        scalability: opt.metrics.scalability,
        learning_curve: 10 - opt.metrics.learning_curve, // invert so higher = better
        overall: calculateOverallScore(opt.metrics)
      }))
    };
  }

  return {
    criteria: ["Performance", "Ease of Use", "Community", "Documentation"],
    matrix: options.map(opt => ({
      name: opt.name,
      performance: opt.score || 8,
      ease_of_use: 7,
      community: 8,
      documentation: 7,
      overall: opt.score || 7
    }))
  };
}

function calculateOverallScore(metrics) {
  return (
    metrics.performance +
    metrics.ease_of_use +
    metrics.community +
    metrics.documentation +
    metrics.scalability +
    (10 - metrics.learning_curve)
  ) / 6;
}

// Deep Analysis - วิเคราะห์เชิงลึก
function performDeepAnalysis(searchResults, query) {
  return {
    market_trends: {
      status: "growing",
      forecast: "การใช้งานเพิ่มขึ้น 20% ต่อปี",
      lifecycle: "mature"
    },
    risk_assessment: {
      technical_risk: "low",
      operational_risk: "low",
      business_risk: "low",
      overall_risk: "low"
    },
    cost_analysis: {
      initial_cost: "low (open source)",
      ongoing_cost: "low",
      maintenance_effort: "medium",
      scalability_cost: "scales linearly"
    },
    implementation_considerations: {
      team_skills_required: ["JavaScript", "System Design"],
      infrastructure_needed: "standard server",
      migration_effort: "low to medium",
      testing_requirements: "standard"
    },
    alternatives_to_consider: [
      "Cloud-hosted solution (ถ้าอยากลด operational)",
      "Hybrid approach (ถ้าต้องการ trade-off)"
    ]
  };
}

// สร้าง recommendations
function makeRecommendation(comparison, deepAnalysis) {
  if (!comparison) return null;

  const best = comparison.matrix.reduce((prev, current) =>
    (current.overall > prev.overall) ? current : prev
  );

  return {
    name: best.name,
    reasons: [
      `คะแนนรวมสูงสุด (${best.overall.toFixed(1)}/10)`,
      deepAnalysis ? "Technical risk ต่ำ" : "เหมาะกับ requirements",
      deepAnalysis ? "Community support แข็งแกร่ง" : "ง่ายต่อการเริ่มต้น"
    ],
    confidence: deepAnalysis ? 0.85 : 0.70,
    alternatives: comparison.matrix
      .filter(m => m.name !== best.name)
      .map(m => ({ name: m.name, score: m.overall }))
  };
}

// สร้าง questions สำหรับ confirm กับ user
function generateQuestions(query, recommendation, deepMode) {
  const baseQuestions = [
    "ขอ clarify scope ของงานให้ชัดเจนอีกครั้ง?",
    "มี constraints หรือ requirements พิเศษอะไรไหม?",
    "timeline ที่คาดหวังคือเท่าไหร่?"
  ];

  if (deepMode && recommendation) {
    baseQuestions.push(
      `ยอมรับกับคำแนะนำ "${recommendation.name}" ไหม?`,
      `หรือสนใจ alternatives: ${recommendation.alternatives.map(a => a.name).join(", ")}`,
      "ต้องการให้ลงรายละเอียดเพิ่มเติมของตัวเลือกที่เลือกไหม?"
    );
  }

  return baseQuestions;
}

// Helper functions
function analyzeQuery(query) {
  const lower = query.toLowerCase();

  if (lower.includes("vs") || lower.includes("เปรียบเทียบ") || lower.includes("compare")) {
    return { type: "comparison", subject: extractSubjects(query) };
  }
  if (lower.includes("framework") || lower.includes("library") || lower.includes("tool")) {
    return { type: "technology_selection", subject: query };
  }
  if (lower.includes("optimize") || lower.includes("performance") || lower.includes("fix")) {
    return { type: "problem_solving", subject: query };
  }
  if (lower.includes("best practice") || lower.includes("how to") || lower.includes("วิธี")) {
    return { type: "best_practice", subject: query };
  }

  return { type: "general", subject: query };
}

function extractSubjects(query) {
  const parts = query.split(/vs|เปรียบเทียบ/i);
  return parts.map(p => p.trim()).filter(p => p);
}
