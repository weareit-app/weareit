module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/tests/**/*.test.[jt]s?(x)"],
  clearMocks: true,
  setupFiles: ["<rootDir>/jest.setup.cjs"],
  // Lucide's react-native export is an .mjs file jest-expo doesn't transform;
  // tests use its CommonJS build.
  moduleNameMapper: {
    "^lucide-react-native$":
      "<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js",
  },
};
