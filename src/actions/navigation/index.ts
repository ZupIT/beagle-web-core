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
import {
  OpenExternalURLAction,
  OpenNativeRouteAction,
  BeagleNavigationAction,
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
  window.location.href = `${origin}${route}${qs}`
}

interface Action {
  _actionType_: string,
  route: string,
}

const navigateBeagleView: ActionHandler<BeagleNavigationAction> = ({ action, beagleView }) => {
  try {
    const path = beagleView.getBeagleNavigator()[action._actionType_]((action as Action).route)
    beagleView.updateWithFetch({ path })
  } catch (error) {
    console.error(error)
  }
}

export default {
  openExternalURL,
  openNativeRoute,
  pushStack: navigateBeagleView,
  popStack: navigateBeagleView,
  pushView: navigateBeagleView,
  popView: navigateBeagleView,
  popToView: navigateBeagleView,
  resetNavigation: navigateBeagleView,
}
