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

import { BeagleUIElement, IdentifiableBeagleUIElement } from './types'

/**
 * Finds a node by its id. If no node is found, null is returned.
 * 
 * @param tree the tree where to search the node
 * @param id the id of the node to find
 * @returns the node with the given id or null if `tree` has no node with id `id`.
 */
export function findById<Schema>(
  tree: IdentifiableBeagleUIElement<Schema>,
  id: string,
): IdentifiableBeagleUIElement<Schema> | null {
  if (tree.id === id) return tree
  let component: IdentifiableBeagleUIElement<any> | null = null
  if (tree.children) {
    let i = 0
    while (i < tree.children.length && !component) {
      component = findById(tree.children[i], id)
      i++
    }
  }
  return component
}

/**
 * Finds every node in a tree where the value of `attributeName` is `attributeValue`. When
 * `attributeValue` is omitted, all nodes with a parameter called `attributeName` will be returned.
 * If no node is found, an empty array is returned.
 * 
 * @param tree the tree where to search the nodes
 * @param attributeName the attribute name to look for
 * @param attributeValue optional. The value of `attributeName` to look for. If not specified, any
 * value is accepted, i.e. a node, to be found, will only need to have a parameter `attributeName`,
 * no matter the value of it.
 * @returns an array with all nodes found
 */
export function findByAttribute<T extends BeagleUIElement<any>>(
  tree: T,
  attributeName: string,
  attributeValue?: string,
): Array<T> {
  let components: Array<T> = []
  if (tree.children) {
    components = tree.children.reduce<Array<T>>(
      (result, child) => (
        [...result, ...findByAttribute(child as T, attributeName, attributeValue)]
      ),
      [],
    )
  }
  const hasAttributeName = tree[attributeName] !== undefined
  const hasCorrectAttributeValue = attributeValue === undefined
    || tree[attributeName] === attributeValue

  if (hasAttributeName && hasCorrectAttributeValue) components.push(tree)
  return components
}

/**
 * Finds all nodes with a given type. The type of a node is defined by the property
 * `_beagleComponent_`. If no node is found, an empty array is returned.
 * 
 * @param tree the tree where to search the nodes
 * @param type the type to look for
 * @returns an array with all nodes found
 */
export function findByType<T extends BeagleUIElement<any>>(
  tree: T,
  type: string,
): Array<T> {
  return findByAttribute(tree, '_beagleComponent_', type)
}

/**
 * Looks for a node with id `childId` and returns its parent. If no node is found, null is returned.
 * 
 * @param tree the tree where to search the node
 * @param childId the id the child node to find
 * @returns the parent node of `childId` or null if no node with id `childId` exists or if `childId`
 * is the root node.
 */
export function findParentByChildId<Schema>(
  tree: IdentifiableBeagleUIElement<Schema>,
  childId: string,
): IdentifiableBeagleUIElement<Schema> | null {
  if (!tree.children) return null
  let i = 0
  let parent = null
  while (i < tree.children.length && !parent) {
    const child = tree.children[i]
    if (child.id === childId) parent = tree
    else parent = findParentByChildId(child, childId)
    i++
  }
  return parent
}

/**
 * Finds the position of the child with the given id in the array of children of a node. If no node
 * is found, -1 is returned.
 * 
 * @param node the node where to look for the child
 * @param childId the id of the child to look for
 * @returns the position of the child in the array of children or -1 if such node doesn't exist.
 */
export function indexOf(
  node: BeagleUIElement<any>,
  childId: string,
): number {
  if (!node.children) return -1
  for (let i = 0; i < node.children.length; i++) {
    if (node.children[i].id === childId) return i
  }
  return - 1
}
