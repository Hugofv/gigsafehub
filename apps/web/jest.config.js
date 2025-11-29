const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@gigsafehub/ui$': '<rootDir>/../../packages/ui/src',
    '^@gigsafehub/types$': '<rootDir>/../../packages/shared-types/src',
  },
};

module.exports = createJestConfig(customJestConfig);

