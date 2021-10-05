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

import last from 'lodash/last'
import { DoubleStack } from './types'

function createDoubleStack<T>(initial: T[][] = []): DoubleStack<T> {
  let stacks: T[][] = initial

  function isEmpty() {
    return !stacks.length
  }

  function getTopItem(): T | undefined {
    return last(last(stacks))
  }

  return {
    pushItem: (item) => {
      if (!isEmpty()) last(stacks)!.push(item)
      else stacks.push([item])
    },
    popItem: () => {
      if (isEmpty()) return
      const removed = last(stacks)!.pop()
      if (last(stacks)!.length === 0) stacks.pop()
      return removed
    },
    popUntil: (predicate) => {
      if (isEmpty()) return []
      const topStack = last(stacks)!
      const index = topStack.findIndex(predicate)
      if (index === -1) return []
      return topStack.splice(index + 1, topStack.length - index - 1)
    },
    pushStack: (item) => stacks.push([item]),
    popStack: () => isEmpty() ? undefined : stacks.pop(),
    resetStack: (item) => {
      stacks.pop()
      stacks.push([item])
    },
    reset: (item) => stacks = [[item]],
    getTopItem,
    isEmpty,
    hasSingleStack: () => stacks.length === 1,
    hasSingleItem: () => stacks.length === 1 && stacks[0]!.length === 1,
    asMatrix: () => stacks.map(stack => [...stack]),
  }
}

export default {
  create: createDoubleStack,
}
