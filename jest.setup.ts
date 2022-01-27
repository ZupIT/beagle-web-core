/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import fetch from 'node-fetch'
import { LogType } from './src/logger/types'
import logger from './src/logger'

function customLogger(type: LogType, ...messages: any[]) {
  if (!process.env.IS_LOGGING_ENABLED) return

  const logFunctions: Record<string, any> = {
    warn: console.warn,
    error: console.error,
  }
  const log = logFunctions[type] || console.log
  log(`--- start of ${type} ---\n${messages.join('\n')}\n---  end of ${type}  ---`)
}

const globalScope = global as any

globalScope.fetch = jest.fn(fetch)
globalScope.globalMocks = { fetch: globalScope.fetch }
globalScope.globalMocks.log = jest.fn(customLogger)
logger.setCustomLogFunction(globalScope.globalMocks.log)
