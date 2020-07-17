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

import { BeagleUIElement, IdentifiableBeagleUIElement } from './types'

/**
 * todo: write documentation
 * @param tree 
 * @param id 
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
 * todo: write documentation
 * @param tree 
 * @param attributeName 
 * @param attributeValue 
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
 * todo: write documentation
 * @param tree 
 * @param type 
 */
export function findByType<T extends BeagleUIElement<any>>(
  tree: T,
  type: string,
): Array<T> {
  return findByAttribute(tree, '_beagleComponent_', type)
}

/**
 * todo: write documentation
 * @param tree 
 * @param childId 
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
 * todo: write documentation
 * @param tree 
 * @param childId 
 */
export function indexOf(
  tree: BeagleUIElement<any>,
  childId: string,
): number {
  if (!tree.children) return -1
  for (let i = 0; i < tree.children.length; i++) {
    if (tree.children[i].id === childId) return i
  }
  return - 1
}
