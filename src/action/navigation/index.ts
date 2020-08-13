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
import { ActionHandler } from 'action/types'
import { BeagleNavigator } from 'beagle-view/types'
import UrlUtils from 'utils/url'
import StringUtils from 'utils/string'
import ObjectUtils from 'utils/object'
import {
  OpenExternalURLAction,
  OpenNativeRouteAction,
  BeagleNavigationAction,
  Route,
  LocalView,
  RemoteView,
} from './types'

let NavigationActions: Record<string, ActionHandler> = {}

const openExternalURL: ActionHandler<OpenExternalURLAction> = ({ action }) => {
  const { url } = action
  window.open(url)
}

const openNativeRoute: ActionHandler<OpenNativeRouteAction> = ({
  action,
}) => {
  const { route, data } = action
  const origin = window.location.origin
  const qs = data && UrlUtils.createQueryString(data)
  const prefixedRoute = StringUtils.addPrefix(route, '/')
  window.location.href = `${origin}${prefixedRoute}${qs || ''}`
}

interface Action {
  _beagleAction_: string,
  route: Route & string,
}

const navigateBeagleView: ActionHandler<BeagleNavigationAction> = async ({
  action,
  beagleView,
}) => {
  const { urlBuilder, viewClient } = beagleView.getBeagleService()

  try {
    const actionNameLowercase = action._beagleAction_.toLowerCase()
    const actionName = ObjectUtils.getOriginalKeyByCaseInsensitiveKey(
      NavigationActions,
      actionNameLowercase,
    )
    const functionName = actionName.replace(/^beagle:/, '') as keyof BeagleNavigator
    const element = beagleView.getBeagleNavigator()[functionName]((action as Action).route)
    const screen = (element as LocalView).screen
    const { url, fallback, shouldPrefetch } = element as RemoteView

    if (screen) return beagleView.getRenderer().doFullRender(screen)
    if (shouldPrefetch) {
      try {
        const path = StringUtils.addPrefix(url, '/')
        const baseUrl = urlBuilder.build(path)
        const cachedTree = await viewClient.loadFromCache(baseUrl, 'get')
        return beagleView.getRenderer().doFullRender(cachedTree)
      } catch (error) {
        logger.error(error)
      }
    }
    
    return beagleView.fetch({ path: url, fallback })
  } catch (error) {
    logger.error(error)
  }
}

NavigationActions = {
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
