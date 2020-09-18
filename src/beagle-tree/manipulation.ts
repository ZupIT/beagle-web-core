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
 * Adds a child element to the target tree. If the mode is "append", the child will be added as the
 * last element of the target's children. If "prepend", it will be added as the first child.
 * 
 * This function modifies `target`, it's not a pure function.
 * 
 * @param target the tree to be modified by receiving the new node `child`
 * @param child the node to insert into the tree `target`
 * @param mode the insertion strategy. Prepend (insert as first child), append (insert as last
 * child) or replace (removes all children and inserts `child`).
 */
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

/**
 * Combine two trees. This function inserts the tree `source` into the tree `target` at the node
 * referred by `anchor`. To tell which position `source` should occupy in the array of children of
 * `anchor`, you should use the last parameter `mode`.
 * 
 * If there's no node with id `anchor`, the tree will be left untouched.
 * 
 * This function modifies `target`, it's not a pure function.
 * 
 * @param target the tree to be modified by receiving the new branch `source`
 * @param source the tree to be inserted into `target`
 * @param anchor the id of the node to attach the new branch to
 * @param mode the insertion strategy. Prepend (insert as first child of `anchor`), append (insert
 * as last child of `anchor`) or replace (removes all children of `anchor` and inserts `child`).
 */
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

/**
 * Just like `insertIntoTree`, `replaceInTree` combines two trees. But, instead of inserting the
 * new branch as a child of the node referred by `anchor`, it completely replaces `anchor`, i.e.
 * after this function runs, `anchor` doesn't exist in `target` anymore, it gets replaced by the
 * tree `source`.
 * 
 * If there's no node with id `anchor` or if `anchor` is the root node, the tree will be left
 * untouched.
 * 
 * This function modifies `target`, it's not a pure function.
 * 
 * @param target the tree to be modified by receiving the new branch `source`
 * @param source the tree to be inserted into `target`
 * @param anchor the id of the node to be replaced by the new branch `source`
 */
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

/**
 * Deep-clones the tree passed as parameter.
 * 
 * @param tree the tree to be cloned
 * @returns the clone of the tree
 */
export function clone<T extends BeagleUIElement>(tree: T): T {
  return cloneDeep(tree)
}
