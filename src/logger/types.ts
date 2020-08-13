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

export type LogType = (
  'error'
  | 'info'
  | 'warn'
  | 'success'
  | 'lifecycle'
  | 'expression'
)

export type LogFunction = (type: LogType, ...logItems: any[]) => void

export type LogShortcut = (...logItems: any[]) => void

export interface Logger {
  enable: () => void,
  disable: () => void,
  setDebugTypes: (newDebugTypes: LogType[]) => void,
  setCustomLogFunction: (customLogFunction: LogFunction | null) => void,
  log: LogFunction,
  info: LogShortcut,
  warn: LogShortcut,
  error: LogShortcut,
}
