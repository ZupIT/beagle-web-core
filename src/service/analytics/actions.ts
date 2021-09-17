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
import get from 'lodash/get'
import { getElementByBeagleId, getElementPosition, getPath } from 'utils/html'
import { ActionRecordParams, AnalyticsConfig, ActionAnalyticsRecord } from './types'

/**
 * This function generates a new `Record<string, any>` with the attributes that were passed along
 * with the analytics provider configuration or the ones from the actions
 * @param action the `BeagleAction` to which try to extract the analytics config
 * @param whiteListedAttributesInConfig the list of attributes passed through the `AnalyticsProvider` config
 * @returns the Record of white listed attributes from the `AnalyticsProvider` or the action itself
 */
function createActionAttributes(action: BeagleAction, whiteListedAttributesInConfig: string[]) {
  const whiteListedAttributesInAction = typeof action.analytics === 'object' && action.analytics.attributes
  const attributes = whiteListedAttributesInAction || whiteListedAttributesInConfig

  if (attributes)
    return { attributes: attributes.reduce((result, attribute) => ({ ...result, [attribute]: get(action, attribute) }), {}) }

}

/**
 * This function formats Action Record
 * @param action the `BeagleAction` to use in the record
 * @param eventName the event that triggered the action
 * @param config the `AnalyticsConfig` from the `AnalyticsProvider`
 * @param component the `IdentifiableBeagleUIElement` to which the action belongs to
 * @param beagleView the `BeagleView` to use in the record
 * @returns the formatted `AnalyticsRecord`
 */
function formatActionRecord(params: ActionRecordParams, config: AnalyticsConfig): ActionAnalyticsRecord {
  const { action, eventName, component, platform, route } = params
  const element = getElementByBeagleId(component.id)
  const position = element && getElementPosition(element)
  const xPath = element && getPath(element) || ''

  let record: ActionAnalyticsRecord = {
    type: 'action',
    platform: platform || '',
    event: eventName,
    component: {
      type: component && component._beagleComponent_,
      id: component && component.id,
      xPath: xPath,
    },
    beagleAction: action._beagleAction_,
    ...createActionAttributes(action, config.actions[action._beagleAction_]),
    timestamp: Date.now(),
    screen: route,
  }

  if (position)
    record.component.position = position

  if (typeof action.analytics === 'object' && action.analytics.additionalEntries) {
    record = {
      ...record,
      additionalEntries: { ...action.analytics.additionalEntries },
    }
  }

  return record
}

export default formatActionRecord
