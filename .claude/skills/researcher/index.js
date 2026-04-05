module.exports = {
  name: "researcher",
  description: "วิจัยเทคโนโลยีและค้นหาข้อมูล",

  execute: async (context) => {
    console.log("🔍  Researcher: กำลังวิจัย...");

    const query = context.query || context.task || context.input || "";
    const memory = context.memory || {};

    if (!query) {
      return {
        error: "ไม่มี query สำหรับวิจัย"
      };
    }

    // 1. วิเคราะห์ query
    const analysis = analyzeQuery(query);

    // 2. ค้นหาข้อมูล (simulate)
    const results = searchInformation(analysis);

    // 3. เปรียบเทียบตัวเลือก
    const comparison = compareOptions(results);

    // 4. สรุป
    const report = {
      timestamp: new Date().toISOString(),
      query: query,
      query_type: analysis.type,
      options: results.options,
      comparison: comparison,
      recommendation: makeRecommendation(comparison),
      references: results.references
    };

    // 5. บันทึกลง memory
    if (memory.write) {
      const existingResearch = memory.read("research.md") || { queries: [] };
      existingResearch.queries.push({
        query: query,
        result: report.recommendation?.name || "N/A",
        timestamp: new Date().toISOString()
      });
      memory.write("research.md", existingResearch);
    }

    console.log(`✅ Researcher: วิจัยเสร็จแล้ว`);
    console.log(`🎯 แนะนำ: ${report.recommendation?.name || "N/A"}`);

    return report;
  }
};

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
  // ง่ายๆ แยกด้วย "vs"
  const parts = query.split(/vs|เปรียบเทียบ/i);
  return parts.map(p => p.trim()).filter(p => p);
}

function searchInformation(analysis) {
  // Simulated search results based on query type
  const mockData = {
    comparison: {
      options: [
        { name: "Option A", pros: ["Fast", "Popular"], cons: ["Complex"], score: 8 },
        { name: "Option B", pros: ["Simple", "Light"], cons: ["Slow"], score: 7 }
      ],
      references: ["https://example.com/a", "https://example.com/b"]
    },
    technology_selection: {
      options: [
        { name: "Framework X", pros: ["Modern", "Fast"], cons: ["New"], score: 9 },
        { name: "Framework Y", pros: ["Stable", "Docs"], cons: ["Old"], score: 8 },
        { name: "Framework Z", pros: ["Simple"], cons: ["Limited"], score: 6 }
      ],
      references: ["https://example.com/tech"]
    },
    problem_solving: {
      options: [
        { name: "Solution 1", description: "Fix root cause", effort: "high", impact: "high" },
        { name: "Solution 2", description: "Workaround", effort: "low", impact: "low" }
      ],
      references: []
    },
    best_practice: {
      options: [
        { name: "Practice A", description: "Standard approach", adopted: "widely" },
        { name: "Practice B", description: "Alternative", adopted: "niche" }
      ],
      references: ["https://example.com/best-practice"]
    },
    general: {
      options: [
        { name: "Result 1", description: "Most relevant" },
        { name: "Result 2", description: "Alternative" }
      ],
      references: []
    }
  };

  return mockData[analysis.type] || mockData.general;
}

function compareOptions(results) {
  if (!results.options || results.options.length < 2) {
    return null;
  }

  return {
    criteria: ["Performance", "Ease of Use", "Community", "Documentation"],
    matrix: results.options.map(opt => ({
      name: opt.name,
      performance: opt.score || 8,
      ease_of_use: 7,
      community: 8,
      documentation: 7,
      overall: (opt.score || 7 + 7 + 8 + 7) / 4
    }))
  };
}

function makeRecommendation(comparison) {
  if (!comparison || !comparison.matrix) {
    return null;
  }

  // หาคนที่ overall สูงสุด
  const best = comparison.matrix.reduce((prev, current) =>
    (current.overall > prev.overall) ? current : prev
  );

  return {
    name: best.name,
    reason: `คะแนนรวมสูงสุด (${best.overall.toFixed(1)}/10)`,
    confidence: 0.8,
    alternatives: comparison.matrix
      .filter(m => m.name !== best.name)
      .map(m => ({ name: m.name, score: m.overall }))
  };
}
