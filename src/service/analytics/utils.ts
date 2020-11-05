import { BeagleAction } from 'action/types'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { LocalView, RemoteView } from 'beagle-view/navigator/types'
import get from 'lodash/get'
import { AnalyticsConfig, AnalyticsRecord } from './types'

function analyticsUtils() {
  let currentRoute: LocalView | RemoteView

  function getElementPosition(elementId: string) {
    const element = document.querySelector(`[data-beagle-id="${elementId}"]`)
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

    console.log(attributes)
    console.log(customRecords)
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
        xPath: '//html/body/app-root/beagle-remote-view/app-container/app-form/form/app-container/app-button[2]/button', // xPath in html (only for web)
      },
      beagleAction: action._beagleAction_,
      additionalEntries: action.analytics && action.analytics.additionalEntries,
      ...addCustomActionAttributes(action, config.actions[action._beagleAction_]),
    }
    console.log('RETURN RECORDS', record)
    console.log('COMPONENT', component)
    return record
  }

  return {
    formatActionRecord,
    setCurrentRoute,
  }
}

export default analyticsUtils()
