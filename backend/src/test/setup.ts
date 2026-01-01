// Test setup file
// Add any global test configuration here

// Mock console methods to reduce noise in tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// Set test timeout
jest.setTimeout(10000);