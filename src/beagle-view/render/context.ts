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

import findLast from 'lodash/findLast'
import last from 'lodash/last'
import { IdentifiableBeagleUIElement, DataContext } from 'beagle-tree/types'
import BeagleParseError from 'error/BeagleParseError'

const RESERVED_WORDS = ['global', 'true', 'false', 'null']

function checkContextId(component: IdentifiableBeagleUIElement) {
  if (!component.context) return
  const contextId = component.context.id

  if (component.context.id.match(/^\d+(\.\d+)?$/)) {
    throw new BeagleParseError(`Numbers are not valid context ids. Please, rename the context with id "${contextId}".`)
  }

  RESERVED_WORDS.forEach(word => {
    if (contextId === word) {
      throw new BeagleParseError(`The context id "${word}" is a reserved word and can't be used as a context id. Please, rename your context.`)
    }
  })
}

function getContexts(component: IdentifiableBeagleUIElement, includeImplicitContexts: boolean) {
  const contexts: DataContext[] = []
  if (component.context) contexts.push(component.context)
  if (includeImplicitContexts && component._implicitContexts_) {
    component._implicitContexts_.forEach(c => contexts.push(c))
  }
  return contexts
}

/**
 * Parses a tree looking for the context hierarchy of each component. The context hierarchy of a
 * component is a stack of contexts. The top position of the stack will be the closest context
 * to the component, while the bottom will be the farthest.
 *
 * @param viewTree the tree to parse the contexts from
 * @param globalContexts optional. Will consider these global contexts when evaluating the tree
 * @param includeImplicitContexts optional, default is true. When false, contexts declared via the
 * key `_implicitContexts_` will be ignored.
 * @returns a map where the key corresponds to the component id and the value to the context
 * hierarchy of the component.
 */
function evaluate(
  viewTree: IdentifiableBeagleUIElement,
  globalContexts: DataContext[] = [],
  includeImplicitContexts = true,
): Record<string, DataContext[]> {
  const contextMap: Record<string, DataContext[]> = {}

  function evaluateContextHierarchy(
    component: IdentifiableBeagleUIElement,
    contextHierarchy: DataContext[],
  ) {
    checkContextId(component)

    const hierarchy = [...contextHierarchy, ...getContexts(component, includeImplicitContexts)]

    contextMap[component.id] = hierarchy
    if (!component.children) return
    component.children.forEach(child => evaluateContextHierarchy(child, hierarchy))
  }

  evaluateContextHierarchy(viewTree, globalContexts)

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
