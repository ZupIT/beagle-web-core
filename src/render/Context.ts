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

import findLast from 'lodash/findLast'
import last from 'lodash/last'
import { IdentifiableBeagleUIElement, DataContext } from '../types'

/**
 * Parses a tree looking for the context hierarchy of each component. The context hierarchy of a
 * component is a stack of contexts. The top position of the stack will be the closest context
 * to the component, while the bottom will be the farthest.
 * 
 * @param viewTree the tree to parse the contexts from
 * @returns a map where the key corresponds to the component id and the value to the context
 * hierarchy of the component.
 */
function evaluate(viewTree: IdentifiableBeagleUIElement): Record<string, DataContext[]> {
  const contextMap: Record<string, DataContext[]> = {}

  function evaluateContextHierarchy(
    component: IdentifiableBeagleUIElement,
    contextHierarchy: DataContext[],
  ) {
    const hierarchy = component.context
      ? [...contextHierarchy, component.context]
      : contextHierarchy

    contextMap[component.id] = hierarchy
    if (!component.children) return
    component.children.forEach(child => evaluateContextHierarchy(child, hierarchy))
  }

  evaluateContextHierarchy(viewTree, [])

  return contextMap
}

/**
 * Finds a context in a context hierarchy. A context hierarchy is the stack of contexts available
 * to a component or action.
 * 
 * If there's no context with `id === contextId`, undefined is returned.
 * 
 * @param contextHierarchy stack of contexts available, top value has the greatest priority
 * @param contextId the id of the context to find. If not specified, the context in the top of the
 * stack is returned
 */
function find(contextHierarchy: DataContext[], contextId?: string) {
  return contextId
    ? findLast(contextHierarchy, { id: contextId })
    : last(contextHierarchy)
}

export default {
  evaluate,
  find,
}
