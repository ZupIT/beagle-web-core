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

import { BeagleAction } from 'action/types'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import get from 'lodash/get'
import { BeagleView } from 'beagle-view/types'
import { AnalyticsConfig, AnalyticsRecord } from './types'
import { getElement, getElementPosition, getPath } from './html'


/**
  * This function generates and return a new `Record<string, any>` with the attributes that were passed along
  * with the analytics provider configuration or the ones from the actions
  * @param action the `BeagleAction` to which try to extract the analytics config
  * @param whiteListedAttributesInConfig the list of attributes passed through the `AnalyticsProvider` config
  */
function createActionsAttribute(action: BeagleAction, whiteListedAttributesInConfig: string[]) {

  const whiteListedAttributesInAction = action && action.analytics && action.analytics.attributes
  const attributes = whiteListedAttributesInAction || whiteListedAttributesInConfig

  if(attributes)
  return attributes.reduce((result, attribute) => ({ ...result, [attribute]: get(action, attribute) }), {})

}

/**
  * This function formats and returns an Action Record
  * @param action the `BeagleAction` to use in the record
  * @param eventName the event that triggered the action
  * @param config the `AnalyticsConfig` from the `AnalyticsProvider`
  * @param component the `IdentifiableBeagleUIElement` to which the action belongs to
  * @param beagleView the `BeagleView` to use in the record
  */
function formatActionRecord(
  action: BeagleAction,
  eventName: string,
  config: AnalyticsConfig,
  component: IdentifiableBeagleUIElement,
  beagleView: BeagleView
): AnalyticsRecord {
  const beagleService = beagleView.getBeagleService()
  const navigator = beagleView.getNavigator()
  const currentRoute = navigator.getCurrentRoute()
  const platform = beagleService.getConfig().platform
  const position = getElementPosition(component.id)
  const element = getElement(component.id)
  const xPath = element && getPath(element)

  const record: AnalyticsRecord = {
    type: 'action',
    platform: `WEB ${platform}`,
    event: eventName,
    component: {
      type: component && component._beagleComponent_,
      id: component && component.id,
      position: position,
      xPath: xPath,
    },
    beagleAction: action._beagleAction_,
    ...createActionsAttribute(action, config.actions[action._beagleAction_]),
  }

  if (action.analytics && action.analytics.additionalEntries)
    record.additionalEntries = action.analytics.additionalEntries

  if (currentRoute) {
    if ('screen' in currentRoute) record.screenId = currentRoute.screen.identifier || currentRoute.screen.id
    else record.url = currentRoute.url
  }

  return record
}

export default formatActionRecord
