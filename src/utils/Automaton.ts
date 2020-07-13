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

import last from 'lodash/last'

const empty = '∅'

export interface Transition {
  read?: string | RegExp,
  push?: string,
  pop?: string,
  next: string,
}

export interface DPAParams {
  initial: string,
  end: string,
  transitions: Record<string, Transition[]>,
}

export interface DPA {
  match: (input: string) => string | null,
}

function createDPA({ initial, end, transitions }: DPAParams): DPA {
  function match(input: string) {
    const stack: string[] = []
    let currentState = initial
    let remainingInput = input

    while (currentState !== end) {
      const availableTransitions = transitions[currentState]
      let matchedValue = ''

      const transition = availableTransitions.find(({ read, pop }) => {
        if (pop !== undefined && last(stack) !== pop && (pop === empty && stack.length > 0)) {
          return false
        }
        if (read === undefined) return true
        if (typeof read === 'string') {
          matchedValue = read
          return remainingInput.startsWith(read)
        }
        const match = remainingInput.match(new RegExp(`^(${read.source})`))
        if (match) {
          matchedValue = match[0]
          return true
        }
        return false
      })

      if (!transition) return null
      remainingInput = remainingInput.substring(matchedValue.length)
      currentState = transition.next
      if (transition.pop !== undefined) stack.pop()
      if (transition.push !== undefined) stack.push(transition.push)
    }

    return input.substr(0, input.length - remainingInput.length)
  }

  return { match }
}

export default {
  empty,
  createDPA,
}
