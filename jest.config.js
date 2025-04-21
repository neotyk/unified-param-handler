// jest.config.js
module.exports = {
    testEnvironment: 'jest-environment-jsdom', // Use jsdom to simulate browser environment
    verbose: true, // Show detailed test results
    // (Optional) Add setup files for global mocks if needed
    setupFilesAfterEnv: ['./tests/setup.js'],
    
  };