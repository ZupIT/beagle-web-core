/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsConfig: 'tsconfig.spec.json',
    },
    window: true
  },
  preset: 'ts-jest',
  setupFiles: ['./jest.setup.ts'],
  setupFilesAfterEnv: ['jest-extended'],
  testEnvironment: "node",
  testMatch: [
    "**/?(*.)+(spec).ts"
  ],
  moduleNameMapper: {
    '^action(.*)$': '<rootDir>/src/action$1',
    '^beagle-tree(.*)$': '<rootDir>/src/beagle-tree$1',
    '^beagle-navigator(.*)$': '<rootDir>/src/beagle-navigator$1',
    '^beagle-view(.*)$': '<rootDir>/src/beagle-view$1',
    '^error(.*)$': '<rootDir>/src/error$1',
    '^legacy(.*)$': '<rootDir>/src/legacy$1',
    '^logger(.*)$': '<rootDir>/src/logger$1',
    '^metadata(.*)$': '<rootDir>/src/metadata$1',
    '^operation(.*)$': '<rootDir>/src/operation$1',
    '^service(.*)$': '<rootDir>/src/service$1',
    '^utils(.*)$': '<rootDir>/src/utils$1',
    '^types$': '<rootDir>/src/types',
  },
}
