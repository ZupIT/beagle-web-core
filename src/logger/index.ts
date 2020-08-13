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

/* eslint-disable no-console */

import { LogType, Logger, LogFunction } from './types'

const DEFAULT_DEBUG_TYPES: LogType[] = ['error', 'info', 'warn', 'success']

const logFn: Record<LogType, typeof console.log> = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  success: console.log,
  lifecycle: console.log,
  expression: console.log,
}

const logColors = {
  info: '#338dcc',
  success: '#71882A',
  lifecycle: '#BF80FD',
  expression: '#1532C1',
  error: '#AF0F0F',
  warn: '#DBCA1C',
}

function createLogger(): Logger {
  let isEnabled = true
  let debug = DEFAULT_DEBUG_TYPES
  let customLogger: LogFunction | null = null

  function log(type: LogType, ...logItems: any[]) {
    if (isEnabled && debug.includes(type)) {
      if (customLogger) return customLogger(type, ...logItems)
      console.groupCollapsed(`%cBeagle (${type.toLowerCase()})`, `color: ${logColors[type]}`)
      const logFunction = logFn[type] || console.log
      logItems.forEach(logFunction)
      console.groupEnd()
    }
  }

  return {
    enable: () => isEnabled = true,
    disable: () => isEnabled = false,
    setDebugTypes: newDebugTypes => debug = newDebugTypes,
    setCustomLogFunction: customLogFunction => customLogger = customLogFunction,
    info: (...logItems) => log('info', ...logItems),
    warn: (...logItems) => log('warn', ...logItems),
    error: (...logItems) => log('error', ...logItems),
    log,
  }
}

const logger = createLogger()

export default logger
