import { BeagleAction } from 'action/types'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { LocalView, RemoteView } from 'beagle-view/navigator/types'
import { findIndex } from 'lodash'
import get from 'lodash/get'
import { AnalyticsConfig, AnalyticsRecord } from './types'

function analyticsUtils() {
  let currentRoute: LocalView | RemoteView

  function getPath(previousPath: string, element: any): string {
    if (element.id === 'root') {
      return 'ROOT/' + previousPath
    }
    const siblings: Element[] = Array.from(element.parentNode.childNodes)
    const elementIndex = findIndex(siblings, element)
    const currentNode = siblings[elementIndex]
    previousPath = `${currentNode.tagName}${elementIndex > 0 ? `[${elementIndex}]` : ''}/${previousPath}`
    return getPath(previousPath, currentNode.parentNode)
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
    const record: AnalyticsRecord = {
      type: 'action',
      platform: `WEB ${platform}`,
      screen: currentRoute,
      event: eventName,
      component: {
        type: component && component._beagleComponent_,
        id: component && component.id,
        position: getElementPosition(component.id),
        xPath: getPath('', getElement(component.id)),
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
