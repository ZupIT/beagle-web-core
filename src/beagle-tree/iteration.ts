/*
  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *  http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

import { BeagleUIElement } from '../types'

type Iteratee<ItemType, ReturnType> = (item: ItemType, index: number) => ReturnType

/**
 * Uses a depth first search algorithm to traverse the tree. The iteratee function will be run for
 * each node (component). The iteratee function is triggered once a node is visited, i.e. the first
 * node to run the function is the root node and not the deepest left-most node.
 * 
 * The children of a node must be called "children" and be an array.
 * 
 * @param tree the tree to traverse
 * @param iteratee the function to call for each node of the tree
 */
export function forEach<T extends BeagleUIElement>(tree: T, iteratee: Iteratee<T, void>): void {
  if (Object.keys(tree).length === 0) return
  let index = 0

  function run(node: T) {
    iteratee(node, ++index)
    if (node.children) node.children.forEach(child => run(child as T))
  }

  run(tree)
}

/**
 * Does the same as forEach (depth-first-search), the difference is that the iteratee function
 * expects a return value, which will be used to replace the current node in the tree. A value must
 * be returned by the iteratee function, if you don't want to change the current node, just return
 * the same node you received. If a node is replaced by another one, the tree will be updated and
 * the next node to run the iteratee function will be the first child of the new node (if it has any
 * children).
 * 
 * The children of a node must be called "children" and be an array.
 * 
 * @param tree the tree to traverse
 * @param iteratee the function to call for each node of the tree. This function must return a node,
 * which will be used to replace the current node of the tree.
 * @returns the new tree
 */
export function replaceEach<T extends BeagleUIElement>(
  tree: T,
  iteratee: Iteratee<T, T>,
): T {
  if (Object.keys(tree).length === 0) return tree
  let index = 0

  function run(node: BeagleUIElement) {
    const newNode = iteratee(node as T, ++index)
    if (!newNode.children) return newNode
    for (let i = 0; i < newNode.children.length; i++) {
      newNode.children[i] = run(newNode.children[i])
    }

    return newNode
  }

  return run(tree)
}

/**
 * Uses a depth first search algorithm to traverse the tree and exposes this functionality as an
 * iterator. Each call to next() walks a step in the tree.
 * 
 * The children of a node must be called "children" and be an array.
 * 
 * @param tree the tree to traverse
 * @returns the iterator to iterate over the nodes
 */
export function iterator(tree: BeagleUIElement): Iterator<BeagleUIElement> {
  if (Object.keys(tree).length === 0) return (function* () {})()
  
  function* generator(node: BeagleUIElement): Iterator<BeagleUIElement> {
    yield node
    if (!node.children) return
    for (let i = 0; i < node.children.length; i++) {
      const childGenerator = generator(node.children[i])
      let next = childGenerator.next()
      while (!next.done) {
        yield next.value
        next = childGenerator.next()
      }
    }
  }

  return generator(tree)
}
