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

import { Stack, Route, BeagleNavigator } from './types'

const createBeagleNavigator = (initialPath: Route): BeagleNavigator => {
  let initialStack = [initialPath]
  let navigation: Stack[] = [initialStack]

  function isSingleStack() {
    return navigation.length === 1
  }

  function isEmpty() {
    return navigation.length === 0
  }

  function getLastPosition() {
    return navigation.length - 1
  }

  function getLastRoute() {
    if (isEmpty()) return ''

    const lastStackPosition = getLastPosition()
    const lastRoutePosition = navigation[lastStackPosition].length

    const route = lastRoutePosition > 0
      ? navigation[lastStackPosition][lastRoutePosition - 1]
      : ''

    return route
  }

  function getCurrentRoute() {
    if (isEmpty()) return ''

    const lastStack = navigation[getLastPosition()]
    const lastPositionInLastStack = lastStack.length - 1
    return lastPositionInLastStack >= 0 ? lastStack[lastPositionInLastStack] : ''
  }

  function pushStack(route: Route) {
    navigation.push([route])
    return route
  }

  function popStack() {
    if (isSingleStack()) {
      navigation = [initialStack]
      return initialPath
    }

    navigation.pop()
    return getLastRoute()
  }

  function pushView(route: Route) {
    navigation[getLastPosition()].push(route)
    return route
  }

  function popView() {
    if (isSingleStack() && navigation.length === 1) return initialPath

    const lastPosition = getLastPosition()
    navigation[lastPosition].pop()

    if (navigation[lastPosition].length <= 0) navigation.pop()
    
    return getLastRoute()
  }

  function popToView(route: Route) {
    while (getCurrentRoute() !== route && !isEmpty()) {
      navigation[getLastPosition()].pop()
      if (navigation[getLastPosition()].length === 0) navigation.pop()
    }

    if (isEmpty()) navigation = [initialStack]
    return route
  }

  function resetStackNavigator(route: Route) {
    initialStack = [route]
    navigation = [initialStack]
    return route
  }

  function get() {
    return navigation
  }

  function set(nav: Stack[]) {
    navigation = nav
  }

  return {
    pushStack,
    popStack,
    pushView,
    popView,
    popToView,
    resetStackNavigator,
    get,
    set,
  }

}

export default createBeagleNavigator
