module.exports = {
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  collectCoverage: !process.env.SKIPCOVERAGE,
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageThreshold: {
    global: {
      branches: 59,
      functions: 73,
      lines: 73,
      statements: 73,
    },
  },
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/**/*.{spec,test}.{js,ts}'],
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@snitch-rules/(.*)$': '<rootDir>/src/$1',
  },
};
