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

const empty = '∅'

export interface Transition {
  read?: string | RegExp,
  push?: string,
  pop?: string,
  next: string,
}

export interface DPAParams {
  initial: string,
  final: string,
  transitions: Record<string, Transition[]>,
}

export interface DPA {
  /**
   * Uses the automaton to identify its patterns inside the string passed as parameter. If a pattern
   * is identified, the identified substring is returned. Otherwise, null is returned.
   * 
   * @param input the string to match against the automaton
   * @returns the substring matching the pattern
   */
  match: (input: string) => string | null,
}

/**
 * Creates a Deterministic Pushdown Automaton (DPA) according to states and transitions passed as
 * parameters.
 * 
 * A DPA is oftenly used to recognize patterns in a string. Although regular expressions also
 * recognizes patterns in strings, a DPA is more powerful and can recognize more complex structures.
 * A regular expression can only recognize regular languages, while a DPA can also recognize
 * free context languages.
 * 
 * This function creates an automaton with a single function: `match`. `match` is always run for
 * a string and, if a match is found, the string matching the pattern is returned. If no match is
 * found, `null` is returned.
 * 
 * Every time `match` is called, the automaton starts at the state `param.initial` and if it ever
 * reaches `param.final`, it stops with a match. If the input ends and the current automaton state
 * is not the final, there's no match. Also, if there's no transition for the current input, the
 * automaton stops without a match.
 * 
 * To represent end of stack, use the constant `Automaton.empty`.
 * 
 * Note about reading an input: to make the representation easier, we can read multiple characters
 * at once from the input. This means that, in a state transition, `read` can be something like
 * `An entire paragraph.`, instead of sequence of transitions for each letter. Moreover, to simplify
 * the state machine, we can also use a regular expression in the property `read` of the transition.
 * 
 * @param param an object with the initial state (string), final state (string) and the state
 * transitions. The state transitions are a map where the key is the state and the value is an array
 * of transitions for the state. A transition is composed by `read` (the string or regex to read
 * from the input string); `push` (the value to push to the stack); `pop` (the value to pop from
 * the stack); and `next` (the next state). The only required property for a transition is `next`.
 */
function createDPA({ initial, final, transitions }: DPAParams): DPA {
  function match(input: string) {
    const stack: string[] = []
    let currentState = initial
    let remainingInput = input

    while (currentState !== final) {
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
  /**
   * The empty symbol for transitions
   */
  empty,
  createDPA,
}
