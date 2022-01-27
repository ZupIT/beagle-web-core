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

import { forEach, iterator, replaceEach } from './iteration'
import { addChild, clone, insertIntoTree, replaceInTree } from './manipulation'
import { findByAttribute, findById, findByType, findParentByChildId, indexOf } from './reading'

export default {
  /**
   * Uses a depth first search algorithm to traverse the tree. The iteratee function will be run for
   * each node (component). The iteratee function is triggered once a node is visited, i.e. the
   * first node to run the function is the root node and not the deepest left-most node.
   * 
   * The children of a node must be called "children" and be an array.
   * 
   * @param tree the tree to traverse
   * @param iteratee the function to call for each node of the tree
   */
  forEach,
  /**
   * Uses a depth first search algorithm to traverse the tree and exposes this functionality as an
   * iterator. Each call to next() walks a step in the tree.
   * 
   * The children of a node must be called "children" and be an array.
   * 
   * @param tree the tree to traverse
   * @returns the iterator to iterate over the nodes
   */
  iterator,
  /**
   * Does the same as forEach (depth-first-search), the difference is that the iteratee function
   * expects a return value, which will be used to replace the current node in the tree. A value
   * must be returned by the iteratee function, if you don't want to change the current node, just
   * return the same node you received. If a node is replaced by another one, the tree will be
   * updated and the next node to run the iteratee function will be the first child of the new node
   * (if it has any children).
   * 
   * The children of a node must be called "children" and be an array.
   * 
   * @param tree the tree to traverse
   * @param iteratee the function to call for each node of the tree. This function must return a
   * node, which will be used to replace the current node of the tree.
   * @returns the new tree
   */
  replaceEach,
  /**
   * Adds a child element to the target tree. If the mode is "append", the child will be added as
   * the last element of the target's children. If "prepend", it will be added as the first child.
   * 
   * This function modifies `target`, it's not a pure function.
   * 
   * @param target the tree to be modified by receiving the new node `child`
   * @param child the node to insert into the tree `target`
   * @param mode the insertion strategy. Prepend (insert as first child), append (insert as last
   * child) or replace (removes all children and inserts `child`).
   */
  addChild,
  /**
   * Deep-clones the tree passed as parameter.
   * 
   * @param tree the tree to be cloned
   * @returns the clone of the tree
   */
  clone,
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
  insertIntoTree,
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
  replaceInTree,
  /**
   * Finds every node in a tree where the value of `attributeName` is `attributeValue`. When
   * `attributeValue` is omitted, all nodes with a parameter called `attributeName` will be
   * returned. If no node is found, an empty array is returned.
   * 
   * @param tree the tree where to search the nodes
   * @param attributeName the attribute name to look for
   * @param attributeValue optional. The value of `attributeName` to look for. If not specified,
   * any value is accepted, i.e. a node, to be found, will only need to have a parameter
   * `attributeName`, no matter the value of it.
   * @returns an array with all nodes found
   */
  findByAttribute,
  /**
   * Finds a node by its id. If no node is found, null is returned.
   * 
   * @param tree the tree where to search the node
   * @param id the id of the node to find
   * @returns the node with the given id or null if `tree` has no node with id `id`.
   */
  findById,
  /**
   * Finds all nodes with a given type. The type of a node is defined by the property
   * `_beagleComponent_`. If no node is found, an empty array is returned.
   * 
   * @param tree the tree where to search the nodes
   * @param type the type to look for
   * @returns an array with all nodes found
   */
  findByType,
  /**
   * Looks for a node with id `childId` and returns its parent. If no node is found, null is returned.
   * 
   * @param tree the tree where to search the node
   * @param childId the id the child node to find
   * @returns the parent node of `childId` or null if no node with id `childId` exists or if `childId`
   * is the root node.
   */
  findParentByChildId,
  /**
   * Finds the position of the child with the given id in the array of children of a node. If no node
   * is found, -1 is returned.
   * 
   * @param node the node where to look for the child
   * @param childId the id of the child to look for
   * @returns the position of the child in the array of children or -1 if such node doesn't exist.
   */
  indexOf,
}
