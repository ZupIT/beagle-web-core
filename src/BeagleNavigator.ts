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

const createBeagleNavigator = (): BeagleNavigator => {
  let navigation: Stack[] = []

  function isEmpty() {
    return navigation.length === 0
  }

  function getLastPosition() {
    return navigation.length - 1
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
    if (isEmpty()) return ''

    navigation.pop()
    if (isEmpty()) return '/'
    const route = navigation[getLastPosition()][0]
    return route
  }

  function pushView(route: Route) {
    if (isEmpty()) return pushStack(route)
    navigation[getLastPosition()].push(route)
    return route
  }

  function popView() {
    if (isEmpty()) return ''

    const lastPosition = getLastPosition()
    navigation[lastPosition].pop()

    if (navigation[lastPosition].length > 0) {
      const route = navigation[lastPosition][0]
      return route
    }

    navigation.pop()
    const route = navigation[getLastPosition()][0]
    return route
  }

  function popToView(route: Route) {
    if (isEmpty()) return '/'

    while (getCurrentRoute() !== route) {
      navigation[getLastPosition()].pop()
      if (navigation[getLastPosition()].length === 0) navigation.pop()
    }

    return route
  }

  function resetStackNavigator(route: Route) {
    navigation = []
    return route
  }

  function get() {
    return navigation
  }

  return {
    pushStack,
    popStack,
    pushView,
    popView,
    popToView,
    resetStackNavigator,
    get,
  }

}

export default createBeagleNavigator
