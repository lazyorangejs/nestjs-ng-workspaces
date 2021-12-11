// https://jestjs.io/docs/configuration

module.exports = {
  displayName: 'users-typeorm',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageReporters: ['html', 'text'],
  coverageDirectory: '../../coverage/libs/users-typeorm',
  coveragePathIgnorePatterns: ['./src/jest.helpers.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  reporters: ['jest-sonar-reporter'],
}
