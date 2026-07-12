module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["./jest.setup.js"],
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "contexts/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "config/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "!app/+html.tsx",
    "!**/*.d.ts",
    "!**/*.types.ts",
    "!**/node_modules/**",
    "!lib/api.ts",
  ],
  coverageThreshold: {
    "./lib/": {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "./hooks/": {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "./contexts/": {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
