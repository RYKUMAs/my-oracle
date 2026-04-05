module.exports = {
  name: "engineer",
  execute: async (context) => {
    console.log("🔧 Engineer implementing...");

    const design = context.data.architecture;

    console.log("Using design:", design);

    return {
      status: "implementation complete",
      based_on: design
    };
  }
};