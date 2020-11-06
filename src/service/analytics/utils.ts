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
import { LocalView, RemoteView } from 'beagle-view/navigator/types'
import { findIndex } from 'lodash'
import get from 'lodash/get'
import { AnalyticsConfig, AnalyticsRecord } from './types'

function analyticsUtils() {
  let currentRoute: LocalView | RemoteView

  function getPath(previous: string, element: Node): any {
    if (!element || !element.parentNode) return
    if (element.nodeName === 'BODY') {
      return 'BODY/' + previous
    }

    const siblings: ChildNode[] = Array.from(element.parentNode.childNodes)
    const elementIndex = findIndex(siblings, element)
    const currentNode = siblings[elementIndex]
    previous = `${currentNode.nodeName}${elementIndex > 0 ? `[${elementIndex}]` : ''}/${previous}`
    return currentNode.parentNode && getPath(previous, currentNode.parentNode)
  }

  function getElement(elementId: string) {
    return document.querySelector(`[data-beagle-id="${elementId}"]`)
  }

  function getElementPosition(elementId: string) {
    const element = getElement(elementId)
    if (!element) return
    return {
      x: element.getBoundingClientRect().left,
      y: element.getBoundingClientRect().top,
    }
  }

  function setCurrentRoute(route: LocalView | RemoteView) {
    currentRoute = route
  }

  function addCustomActionAttributes(action: BeagleAction, configActions: string[]) {
    let attributes: string[] = []
    const customRecords: Record<string, any> = {}

    if (action && action.analytics && action.analytics.attributes)
      attributes = action.analytics.attributes

    if (configActions && attributes.length === 0)
      attributes = configActions

    attributes.forEach(attribute => customRecords[attribute] = get(action, attribute))
    return customRecords
  }

  function formatActionRecord(
    action: BeagleAction,
    eventName: string,
    config: AnalyticsConfig,
    component: IdentifiableBeagleUIElement,
    platform?: string
  ): AnalyticsRecord {
    const position = getElementPosition(component.id)
    const element = getElement(component.id)
    const xPath = element && getPath('', element)

    const record: AnalyticsRecord = {
      type: 'action',
      platform: `WEB ${platform}`,
      screen: currentRoute,
      event: eventName,
      component: {
        type: component && component._beagleComponent_,
        id: component && component.id,
        position: position,
        xPath: xPath,
      },
      beagleAction: action._beagleAction_,
      additionalEntries: action.analytics && action.analytics.additionalEntries,
      ...addCustomActionAttributes(action, config.actions[action._beagleAction_]),
    }
    return record
  }

  return {
    formatActionRecord,
    setCurrentRoute,
  }
}

export default analyticsUtils()
