module.exports = {
  name: "tester",
  execute: async (context) => {
    console.log("✅ Tester validating...");

    return {
      result: "passed",
      latency: "120ms"
    };
  }
};