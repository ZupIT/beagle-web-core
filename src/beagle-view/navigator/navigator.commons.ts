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

import find from 'lodash/find'
import logger from 'logger'
import { NavigationController, NavigationListener, Route } from './types'


export function getNavigationController(navigationControllers?: Record<string, NavigationController>, controllerId?: string,) {
  const defaultNavigationController = find(navigationControllers, { default: true }) || {}
  if (!controllerId) return defaultNavigationController
  if (!navigationControllers || !navigationControllers[controllerId]) {
    logger.warn(`No navigation controller with id ${controllerId} has been found. Using the default navigation controller.`)
    return defaultNavigationController
  }
  return navigationControllers[controllerId]
}

export function runListeners(
  route: Route, 
  listeners: NavigationListener[], 
  controllerId?: string, 
  navigationControllers?: Record<string, NavigationController>) {

  const navigationController = getNavigationController(navigationControllers, controllerId)
  return Promise.all(listeners.map(l => l(route, navigationController)))
}


export function isRouteIdentifiedBy(route: Route, id: string) {
  return ('url' in route && route.url === id) ||
    // todo: remove screenComponent.identifier with the release of v2.0.0"
    ('screen' in route && (route.screen.identifier === id || route.screen.id === id))
}
