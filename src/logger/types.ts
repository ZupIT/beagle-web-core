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
  | 'lifecycle'
  | 'expression'
)

export type LogFunction = (type: LogType, ...messages: any[]) => void

export type LogShortcut = (...messages: any[]) => void

export interface Logger {
  /**
   * Enables the logger so log messages are created.
   */
  enable: () => void,
  /**
   * Disables the logger so log messages are no longer created.
   */
  disable: () => void,
  /**
   * By default, the logger will log only messages of type 'warn' and 'error'. If you need to
   * log other types of messages, you should call this function with an array with all types of
   * log you wish to generate. The log types are:
   * 
   * - `error`: errors
   * - `warn`: warnings
   * - `info`: general information about beagle
   * - `lifecycle`: information about the lifecycles
   * - `expression`: information about the parsing of expressions
   * 
   * @param newDebugTypes array of LogType to consider when logging messages.
   */
  setDebugTypes: (newDebugTypes: LogType[]) => void,
  /**
   * By default, the logger will print messages to the console, if you need another behavior in your
   * application, by using this function, you can replace the default log function for one of your
   * own. If you need to get back to using the default log function, you can call this method
   * passing null as parameter.
   * 
   * @param customLogFunction the function to log the messages or null to reset the log function
   * to its default.
   */
  setCustomLogFunction: (customLogFunction: LogFunction | null) => void,
  /**
   * Logs a message. The first parameter is the type of the message and the other parameters are
   * the message themselves.
   * 
   * @param type the type of the log.
   * @param ...messages the messages to log.
   */
  log: LogFunction,
  /**
   * Logs a message of type 'info'. Shortcut to log('info', ...messages).
   * 
   * @param ...messages the messages to log 
   */
  info: LogShortcut,
  /**
   * Logs a message of type 'warn'. Shortcut to log('warn', ...messages).
   * 
   * @param ...messages the messages to log 
   */
  warn: LogShortcut,
  /**
   * Logs a message of type 'error'. Shortcut to log('error', ...messages).
   * 
   * @param ...messages the messages to log 
   */
  error: LogShortcut,
}
