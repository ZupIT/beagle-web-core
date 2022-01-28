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

import cloneDeep from 'lodash/cloneDeep'
import { BeagleUIElement, IdentifiableBeagleUIElement, TreeInsertionMode } from './types'
import { findById, findParentByChildId, indexOf } from './reading'

export function addChild<Schema>(
  target: BeagleUIElement<Schema>,
  child: BeagleUIElement<Schema>,
  mode: TreeInsertionMode,
) {
  target.children = target.children || []

  const modeHandlers = {
    append: () => target.children!.push(child),
    prepend: () => target.children!.unshift(child),
    replace: () => target.children = [child],
  }

  modeHandlers[mode]()
}

export function insertIntoTree<Schema>(
  target: IdentifiableBeagleUIElement<Schema>,
  source: IdentifiableBeagleUIElement<Schema>,
  anchor: string,
  mode: TreeInsertionMode = 'append'
) {
  const element = findById(target, anchor)
  if (!element) return
  addChild(element, source, mode)
}

export function replaceInTree<Schema>(
  target: IdentifiableBeagleUIElement<Schema>,
  source: IdentifiableBeagleUIElement<Schema>,
  anchor: string,
) {
  const parent = findParentByChildId(target, anchor)
  if (!parent) return
  const index = indexOf(parent, anchor)
  parent.children!.splice(index, 1, source)
}

export function clone<T extends BeagleUIElement>(tree: T): T {
  return cloneDeep(tree)
}
