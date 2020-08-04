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

import cloneDeep from 'lodash/cloneDeep'
import { BeagleUIElement, IdentifiableBeagleUIElement, TreeInsertionMode } from './types'
import { findById, findParentByChildId, indexOf } from './reading'

/**
 * todo: revise and complete
 * Adds a child element to the target tree. If the mode is "append", the child will be added as the
 * last element of the target's children. If "prepend", it will be added as the first child. This
 * function modifies "target", it's not a pure function.
 * 
 * @param target 
 * @param child 
 * @param mode 
 */
export function addChild<Schema>(
  target: BeagleUIElement<Schema>,
  child: BeagleUIElement<Schema>,
  mode: TreeInsertionMode,
) {
  target.children = target.children || []
  if (mode === 'append') target.children.push(child)
  else target.children.unshift(child)
}

/**
 * todo: revise and complete
 * Adds a source tree into the target tree. The source tree will be added to the element with id
 * equals to the parentId. You can also specify the mode. If the mode is "append", the source tree
 * will be added as the last element of the parent's children. If "prepend", it will be added as the
 * first child. This function modifies "target", it's not a pure function.
 * @param target 
 * @param source 
 * @param parentId 
 * @param mode 
 */
export function insertIntoTree<Schema>(
  target: IdentifiableBeagleUIElement<Schema>,
  source: IdentifiableBeagleUIElement<Schema>,
  parentId: string,
  mode: TreeInsertionMode = 'append'
) {
  const element = findById(target, parentId)
  if (!element) return
  addChild(element, source, mode)
}

/**
 * todo: revise and complete
 * Replaces with "source" the element in "target" identified by "id". This function modifies
 * "target", it's not a pure function.
 * @param target 
 * @param source 
 * @param id 
 */
export function replaceInTree<Schema>(
  target: IdentifiableBeagleUIElement<Schema>,
  source: IdentifiableBeagleUIElement<Schema>,
  id: string,
) {
  const parent = findParentByChildId(target, id)
  if (!parent) return
  const index = indexOf(parent, id)
  parent.children!.splice(index, 1, source)
}

/**
 * todo: complete
 * @param tree 
 */
export function clone<T extends BeagleUIElement>(tree: T): T {
  return cloneDeep(tree)
}
