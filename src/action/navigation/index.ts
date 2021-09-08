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

import { ActionHandler } from 'action/types'
import { NavigationType } from 'beagle-navigator/types'
import UrlUtils from 'utils/url'
import StringUtils from 'utils/string'
import ObjectUtils from 'utils/object'
import logger from 'logger'
import {
  OpenExternalURLAction,
  OpenNativeRouteAction,
  GenericNavigationAction,
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

const navigateBeagleView: ActionHandler<GenericNavigationAction> = async ({
  action,
  beagleView,
}) => {
  const actionNameLowercase = action._beagleAction_.toLowerCase()
  const actionName = ObjectUtils.getOriginalKeyByCaseInsensitiveKey(
    NavigationActions,
    actionNameLowercase,
  )
  const navigationType = actionName.replace(/^beagle:/, '') as NavigationType
  try {
    const navigator = beagleView.getNavigator()
    if (!navigator) {
      return logger.error("Can't navigate because this Beagle View is not attached to any Beagle Navigator.")
    }
    await navigator.navigate(navigationType, action.route, action.controllerId)
  } catch (error) {
    logger.error((error as any).message || error)
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
