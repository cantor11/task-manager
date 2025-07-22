export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\.tsx?$': ['ts-jest', {
      useESM: true,
    }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1'
  },
  extensionsToTreatAsEsm: ['.ts'],
};
