import { BeagleUIElement } from '../types'
import { loadFromServer } from '../utils/tree-fetching'
import NavigationActions from '../actions/navigation'
import { addPrefix } from '../utils/string'
import urlBuilder from '../UrlBuilder'

function preFetchViews(component: BeagleUIElement) {
  const keys = Object.keys(component)

  keys.forEach((key) => {
    if (!component[key]) return
    const isNavigationAction = NavigationActions[component[key]._beagleAction_]
    const shouldPrefetch = component[key].route && component[key].route.shouldPrefetch
    if (isNavigationAction && shouldPrefetch) {
      const path = addPrefix(component[key].route.url, '/')
      const url = urlBuilder.build(path)
      loadFromServer(url)
    }
  })
}

export default {
  preFetchViews,
}
