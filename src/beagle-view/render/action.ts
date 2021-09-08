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

import logger from 'logger'
import { IdentifiableBeagleUIElement, DataContext } from 'beagle-tree/types'
import { ActionHandler, ActionOrActionList } from 'action/types'
import ObjectUtils from 'utils/object'
import { BeagleView } from 'beagle-view/types'
import { Operation } from 'service/beagle-service/types'
import Expression from './expression'

const IGNORE_COMPONENT_KEYS = ['id', 'context', 'children', '_beagleComponent_']

interface Parameters {
  component: IdentifiableBeagleUIElement,
  contextHierarchy: DataContext[],
  beagleView: BeagleView,
  actionHandlers: Record<string, ActionHandler>,
  operationHandlers: Record<string, Operation>,
}

function isBeagleAction(data: any) {
  return (
    data
    && typeof data === 'object'
    && (data._beagleAction_ || (Array.isArray(data) && data[0] && data[0]._beagleAction_))
  )
}

function deserializeAction(
  actionOrActionList: ActionOrActionList,
  eventName: string,
  params: Parameters,
) {
  const actionList = Array.isArray(actionOrActionList) ? actionOrActionList : [actionOrActionList]
  const beagleService = params.beagleView.getBeagleService()

  return function (event: any) {
    const hierarchy = event !== undefined
      ? [...params.contextHierarchy, { id: eventName, value: event }]
      : params.contextHierarchy

    // function used to deserialize and execute actions inside another action
    const executeSubAction = (
      actionOrActionList: ActionOrActionList,
      eventName = '',
      event?: any,
    ) => {
      deserializeAction(
        actionOrActionList,
        eventName,
        { ...params, contextHierarchy: hierarchy },
      )(event)
    }

    actionList.forEach((action) => {
      const handler = ObjectUtils.getValueByCaseInsensitiveKey(
        params.actionHandlers,
        action._beagleAction_,
      )

      if (!handler) {
        logger.warn(`Beagle: couldn't find an action handler for "${action._beagleAction_}"`)
        return
      }

      const resolvedAction = Expression.resolveForAction(action, hierarchy, params.operationHandlers)

      handler({
        action: resolvedAction,
        beagleView: params.beagleView,
        element: params.component,
        executeAction: executeSubAction,
      })

      const navigator = params.beagleView.getNavigator()
      const route = navigator?.getCurrentRoute() || 'unknown'
      const platform = beagleService.getConfig().platform || ''
      if (route) {
        beagleService.analyticsService.createActionRecord({
          action: resolvedAction,
          eventName: eventName,
          component: params.component,
          platform: platform,
          route: route,
        })
      }
    })
  }
}

function findAndDeserializeActions(data: any, propertyName: string, params: Parameters): any {
  if (data && typeof data === 'object' && data._beagleComponent_) return data

  if (isBeagleAction(data)) return deserializeAction(data, propertyName, params)

  if (Array.isArray(data)) {
    return data.map(item => findAndDeserializeActions(item, propertyName, params))
  }

  if (data && typeof data === 'object') {
    const keys = Object.keys(data)
    keys.forEach(key => data[key] = findAndDeserializeActions(data[key], key, params))
  }

  return data
}

/**
 * De-serializes every Beagle Action in the component into a function. If any expression is used
 * inside the Beagle Action, `params.contextHierarchy` will be used as the data source to retrieve
 * the expressions values.
 *
 * Actions that are properties of another action are not deserialized by this function. This
 * function only de-serializes actions that are part of the component interface. The responsibility
 * to de-serialize an action inside another action is of the action handler. See the example below:
 *
 * ```json
 * {
 *   "_beagleComponent_": "beagle:button",
 *   "text": "click to send request",
 *   "onPress": {
 *     "_beagleAction_": "beagle:sendRequest",
 *     "url": "https://docs.usebeagle.com",
 *     "onSuccess": {
 *       "_beagleAction_": "beagle:alert",
 *       "message": "Successfully recovered the docs!"
 *     }
 *   }
 * }
 * ```
 *
 * In the example above, "onPress" is deserialized when running this function, but "onSuccess" is
 * not. The action handler for the action "beagle:sendRequest" is the one responsible for
 * deserializing "onSuccess".
 *
 * This function alters `params.component`, i.e. this is not a pure function.
 *
 * @param params set of parameters to perform the de-serialization. The key-value map must contain
 * the following:
 * - `component`: the component whose actions must be deserialized.
 * - `contextHierarchy`: context hierarchy to use for expressions inside a Beagle Action.
 * - `beagleView`: the current BeagleView, needed to perform view updates on certain actions.
 * - `actionHandlers`: map relating each beagle action identifier to an action handler.
 */
function deserialize(params: Parameters) {
  const keys = Object.keys(params.component)
  keys.forEach((key) => {
    if (IGNORE_COMPONENT_KEYS.includes(key)) return
    params.component[key] = findAndDeserializeActions(params.component[key], key, params)
  })
}

export default {
  deserialize,
}
