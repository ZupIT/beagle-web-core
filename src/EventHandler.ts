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

import { clone } from './utils/tree-manipulation'
import { replaceBindings } from './bindings'
import { IdentifiableBeagleUIElement, BeagleView, DataContext } from './types'
import { getContextHierarchy } from './context'
import defaultActionHandlers from './actions'
import { ActionHandler, BeagleAction } from './actions/types'

function createEventHandler(
  customActionHandlers: Record<string, ActionHandler> = {},
  beagleView: BeagleView,
) {
  Object.keys(customActionHandlers).forEach((actionType) => {
    if (defaultActionHandlers[actionType])
      console.warn(
        `A default handler with type ${actionType} exists. Are you sure you want to replace it?`,
      )
  })

  const actionHandlers = { ...defaultActionHandlers, ...customActionHandlers }

  const handleAction: ActionHandler = (params) => {
    const actionType = params.action._actionType_
    if (!actionHandlers[actionType]) {
      console.warn(`There is no action handler for action with type "${actionType}"`)
      return
    }
    
    const actionWithEventValues = replaceBindings(params.action, params.eventContextHierarchy)
    actionHandlers[actionType]({ ...params, action: actionWithEventValues })
  }

  function isBeagleAction(element: IdentifiableBeagleUIElement) {
    return element && !!element._actionType_
  }

  function transformBeagleActionsToFunction(
    element: IdentifiableBeagleUIElement,
    eventName: string,
    actions: BeagleAction[],
    contextHierarchy: DataContext[],
  ) {
    return (event: any) => {
      actions.forEach(action => handleAction({
        action,
        eventContextHierarchy: [{ id: eventName, value: event }, ...contextHierarchy],
        element,
        handleAction,
        beagleView,
      }))
    }
  }

  function replaceBeagleActionsWithFunctions(
    element: IdentifiableBeagleUIElement,
    contextHierarchy?: DataContext[],
  ) {
    const keys = Object.keys(element)
    const ignore = ['id', '_beagleType_', '_context_', 'children']
    const hierarchy = getContextHierarchy(element, contextHierarchy)

    keys.forEach((key) => {
      if (ignore.includes(key)) return
      const value = element[key]
      const isAction = isBeagleAction(value)
      const isActionArray = value instanceof Array && isBeagleAction(value[0])
      if (!isAction && !isActionArray) return
      const actions = isAction ? [value] : value
      element[key] = transformBeagleActionsToFunction(element, key, actions, hierarchy)
    })

    if (element.children)
      element.children.forEach(child => replaceBeagleActionsWithFunctions(child, hierarchy))
  }

  function interpretEventsInTree(tree: IdentifiableBeagleUIElement) {
    const treeWithFunctions = clone(tree)
    replaceBeagleActionsWithFunctions(treeWithFunctions)
    return treeWithFunctions
  }

  return {
    interpretEventsInTree,
  }
}

export type EventHandler = ReturnType<typeof createEventHandler>

export default createEventHandler
