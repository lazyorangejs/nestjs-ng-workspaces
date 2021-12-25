const { resolve } = require('path')

// https://github.com/firebase/firebase-functions/blob/v3.16.0/src/config.ts#L99
process.env.CLOUD_RUNTIME_CONFIG = resolve(__dirname, '.runtimeconfig.json')

module.exports = {
  displayName: 'spotify-auth-firebase-functions',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/spotify-auth-firebase-functions',
  testEnvironment: 'node'
}
