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

/* eslint-disable no-console */

import { LogType, Logger, LogFunction } from './types'

const DEFAULT_TYPES_TO_LOG: LogType[] = ['error', 'warn']

const logFn: Record<LogType, typeof console.log> = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  lifecycle: console.log,
  expression: console.log,
}

const logColors = {
  info: '#338dcc',
  lifecycle: '#BF80FD',
  expression: '#476bfc',
  error: '#fc4747',
  warn: '#DBCA1C',
}

function createLogger(): Logger {
  let isEnabled = true
  let typesToLog = DEFAULT_TYPES_TO_LOG
  let customLogger: LogFunction | null = null

  function log(type: LogType, ...logItems: any[]) {
    if (isEnabled && typesToLog.includes(type)) {
      if (customLogger) return customLogger(type, ...logItems)
      console.group(`%cBeagle (${type.toLowerCase()})`, `color: ${logColors[type]}`)
      const logFunction = logFn[type] || console.log
      logItems.forEach(item => logFunction(item))
      console.groupEnd()
    }
  }

  return {
    enable: () => isEnabled = true,
    disable: () => isEnabled = false,
    setTypesToLog: newTypesToLog => typesToLog = newTypesToLog || DEFAULT_TYPES_TO_LOG,
    setCustomLogFunction: customLogFunction => customLogger = customLogFunction,
    info: (...logItems) => log('info', ...logItems),
    warn: (...logItems) => log('warn', ...logItems),
    error: (...logItems) => log('error', ...logItems),
    log,
  }
}

const logger = createLogger()

export default logger
