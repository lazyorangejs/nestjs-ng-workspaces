const nxPreset = require('@nrwl/jest/preset')

module.exports = {
  ...nxPreset,
  testResultsProcessor: 'jest-sonar-reporter',
  reporters: ['default', 'jest-junit'],
  coverageReporters: ['lcov', 'text', 'html'],
  codeCoverage: true,
}
