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

import { ActionHandler } from '../types'
import { createQueryString } from '../../utils/querystring'
import { BeagleNavigator } from '../../types'
import { loadFromCache } from '../../utils/tree-fetching'
import { addPrefix } from '../../utils/string'
import {
  OpenExternalURLAction,
  OpenNativeRouteAction,
  BeagleNavigationAction,
  Route,
  LocalView,
  RemoteView,
} from './types'

const openExternalURL: ActionHandler<OpenExternalURLAction> = ({ action }) => {
  const { url } = action
  window.open(url)
}

const openNativeRoute: ActionHandler<OpenNativeRouteAction> = ({
  action,
}) => {
  const { route, data } = action
  const origin = window.location.origin
  const qs = data && createQueryString(data)
  window.location.href = `${origin}${route}${qs || ''}`
}

interface Action {
  _beagleAction_: string,
  route: Route & string,
}

const navigateBeagleView: ActionHandler<BeagleNavigationAction> = async ({ action, beagleView }) => {
  try {
    const functionName = action._beagleAction_.replace(/^beagle:/, '') as keyof BeagleNavigator
    const element = beagleView.getBeagleNavigator()[functionName]((action as Action).route)
    const screen = (element as LocalView).screen
    const { url, fallback, shouldPrefetch } = element as RemoteView

    if (screen) return beagleView.updateWithTree({ sourceTree: screen })
    if (shouldPrefetch) {
      try {
        const path = addPrefix(url, '/')
        const baseUrl = beagleView.getUrlBuilder().build(path)
        const cachedTree = await loadFromCache(baseUrl)
        return beagleView.updateWithTree({ sourceTree: cachedTree })
      } catch (error) {
        console.error(error)
      }
    }
    
    return beagleView.updateWithFetch({ path: url, fallback })
  } catch (error) {
    console.error(error)
  }
}

const NavigationActions: Record<string, ActionHandler> = {
  'beagle:openExternalURL': openExternalURL,
  'beagle:openNativeRoute': openNativeRoute,
  'beagle:pushStack': navigateBeagleView,
  'beagle:popStack': navigateBeagleView,
  'beagle:pushView': navigateBeagleView,
  'beagle:popView': navigateBeagleView,
  'beagle:popToView': navigateBeagleView,
  'beagle:resetStack': navigateBeagleView,
  'beagle:resetApplication': navigateBeagleView,
}

export default NavigationActions
