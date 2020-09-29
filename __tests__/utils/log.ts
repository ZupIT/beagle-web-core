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

import { LogType } from 'logger/types'
import logger from 'logger'

const mockedLogFunction = globalMocks.log

export function enableLogging() {
  const log = jest.fn((type: LogType, ...messages: any[]) => {
    const logFunctions: Record<string, any> = {
      warn: console.warn,
      error: console.error,
    }
    const log = logFunctions[type] || console.log
    log(`--- start of ${type} ---\n${messages.join('\n')}\n---  end of ${type}  ---`)
  })
  // @ts-ignore
  globalMocks.log = log
  logger.setCustomLogFunction(log)
}

export function disableLogging() {
  // @ts-ignore
  globalMocks.log = mockedLogFunction
  logger.setCustomLogFunction(mockedLogFunction)
}
