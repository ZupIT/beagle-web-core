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

import { BeagleUIElement, IdentifiableBeagleUIElement, DataContext } from './types'
import globalContextApi from './GlobalContextAPI'

export function getContextHierarchy(
  element: BeagleUIElement,
  currentHierarchy: DataContext[] = [],
) {
  if (currentHierarchy.length === 0) {
    const globalContext = globalContextApi.getAsDataContext()
    currentHierarchy.push(globalContext)
  }

  return element.context ? [element.context, ...currentHierarchy] : currentHierarchy
}

export function getContextHierarchyByElementId(
  tree: IdentifiableBeagleUIElement,
  elementId: string,
  contextHierarchy?: DataContext[],
): DataContext[] | undefined {
  const hierarchy = getContextHierarchy(tree, contextHierarchy)
  if (tree.id === elementId) return hierarchy
  if (!tree.children) return
  for (let i = 0; i < tree.children.length; i++) {
    const result = getContextHierarchyByElementId(tree.children[i], elementId, hierarchy)
    if (result) return result
  }
}

export function getContextInHierarchy(contextHierarchy: DataContext[], contextId?: string) {
  return contextId
    ? contextHierarchy.find(({ id }) => id === contextId)
    : contextHierarchy[0]
}
