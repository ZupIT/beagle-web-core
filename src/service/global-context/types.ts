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

import { DataContext } from 'beagle-tree/types'

export type GlobalContextListener = () => void

export interface GlobalContext {
  /**
   * Gets a value in the global context.
   *
   * @parameter path optional. Path for the desired value in the global context. Example:
   * `user.documents[0]` if the global context has an object named `user`, with an array named
   * `documents` and you want the first document. When omitted, the entire global context is
   * returned.
   * @returns the value requested by `path` or undefined if it doesn't exist
   */
  get: (path?: string) => any,
  /**
   * Sets a value in the global context. If the provided path doesn't exist, nothing happens.
   *
   * @param value the value to set.
   * @param path optional. Where in the global context to set the value. When omitted, the entire
   * global context is replaced.
   */
  set: (value: any, path?: string) => void,
  /**
   * Removes a value from the global context. If the provided path doesn't exist, nothing happens.
   *
   * To clear a key in an object is to remove the key entirely.
   * To clear an element of an array is to transform it to null.
   * To clear the entire global context is to set it to null.
   *
   * @param path optional. The path of the value you want to remove from the global context. When
   * omitted, the entire global cleared.
   */
  clear: (path?: string | undefined) => void,
  /**
   * Return the global context as a DataContext structure, with an id and value.
   */
  getAsDataContext: () => DataContext,
  /**
   * Subscribes to changes in the global context.
   *
   * @param listener function to be called every time the global context changes.
   * @returns a function to remove the listener (unsubscribe).
   */
  subscribe: (listener: GlobalContextListener) => (() => void),
}
