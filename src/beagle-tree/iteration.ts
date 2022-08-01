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

import { Iterator } from 'types'
import { BeagleUIElement } from './types'

type Iteratee<ItemType, ReturnType> = (item: ItemType, index: number) => ReturnType

export function forEach<T extends BeagleUIElement>(tree: T, iteratee: Iteratee<T, void>): void {
  if (Object.keys(tree).length === 0) return
  let index = 0

  function run(node: T) {
    iteratee(node, index++)
    const children = (node.children || (node.child ? [node.child] : null))
    if (children) children.forEach(child => run(child as T))
  }

  run(tree)
}

export function replaceEach<T extends BeagleUIElement>(
  tree: T,
  iteratee: Iteratee<T, T>,
): T {
  if (Object.keys(tree).length === 0) return tree
  let index = 0

  function run(node: BeagleUIElement) {
    const newNode = iteratee(node as T, index++)
    if (!newNode.children) return newNode
    for (let i = 0; i < newNode.children.length; i++) {
      newNode.children[i] = run(newNode.children[i])
    }

    return newNode
  }

  return run(tree)
}

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
