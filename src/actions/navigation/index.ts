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
  PopStackAction,
  PopViewAction,
  PushStackAction,
  PushViewAction,
  PopToViewAction,
  ResetNavigationAction,
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

const pushStack: ActionHandler<PushStackAction> = ({ action, beagleView }) => {
  const path = beagleView.getBeagleNavigator().pushStack(action.route)
  beagleView.updateWithFetch({ path })
}

const popStack: ActionHandler<PopStackAction> = ({ beagleView }) => {
  const path = beagleView.getBeagleNavigator().popStack()
  beagleView.updateWithFetch({ path })
}

const pushView: ActionHandler<PushViewAction> = ({ action, beagleView }) => {
  const path = beagleView.getBeagleNavigator().pushView(action.route)
  beagleView.updateWithFetch({ path })
}

const popView: ActionHandler<PopViewAction> = ({ beagleView }) => {
  try {
    const path = beagleView.getBeagleNavigator().popView()
    beagleView.updateWithFetch({ path })
  } catch (error) {
    console.error(error)
  }
}

const popToView: ActionHandler<PopToViewAction> = ({ action, beagleView }) => {
  try {
    const path = beagleView.getBeagleNavigator().popToView(action.route)
    beagleView.updateWithFetch({ path })
  } catch (error) {
    console.error(error)
  }
}

const resetNavigation: ActionHandler<ResetNavigationAction> = ({ action, beagleView }) => {
  const path = beagleView.getBeagleNavigator().resetStackNavigator(action.route)
  beagleView.updateWithFetch({ path })
}

export default {
  openExternalURL,
  openNativeRoute,
  pushStack,
  popStack,
  pushView,
  popView,
  popToView,
  resetNavigation,
}
