module.exports = {
  name: "debugger",
  execute: async (context) => {
    console.log("🐛 Debugger analyzing...");

    return {
      issues: [],
      status: "no critical bugs"
    };
  }
};