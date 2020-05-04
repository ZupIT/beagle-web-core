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
  window.location.href = `${origin}${route}`
  window.history.pushState(data, 'data')
}

const pushStack: ActionHandler<PushStackAction> = ({ action, beagleView }) => {
  beagleView.getBeagleNavigator().pushStack(action.route)
  beagleView.updateWithFetch({ path: `${action.route}` })
}

const popStack: ActionHandler<PopStackAction> = ({ beagleView }) => {
  const route = beagleView.getBeagleNavigator().popStack()
  beagleView.updateWithFetch({ path: `${route}` })
}

const pushView: ActionHandler<PushViewAction> = ({ action, beagleView }) => {
  beagleView.getBeagleNavigator().pushView(action.route)
  beagleView.updateWithFetch({ path: `${action.route}` })
}

const popView: ActionHandler<PopViewAction> = ({ beagleView }) => {
  const route = beagleView.getBeagleNavigator().popView()
  beagleView.updateWithFetch({ path: `${route}` })
}

const popToView: ActionHandler<PopToViewAction> = ({ action, beagleView }) => {
  beagleView.getBeagleNavigator().popToView(action.route)
  beagleView.updateWithFetch({ path: `${action.route}` })
}

const resetNavigation: ActionHandler<ResetNavigationAction> = ({ action, beagleView }) => {
  beagleView.getBeagleNavigator().resetStackNavigator(action.route)
  beagleView.updateWithFetch({ path: `${action.route}` })
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
