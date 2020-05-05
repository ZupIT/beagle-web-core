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

import { find } from 'lodash'
import { Stack, Route, BeagleNavigator } from './types'

const createBeagleNavigator = (initialPath: Route): BeagleNavigator => {
  let initialStack = [initialPath]
  let navigation: Stack[] = [initialStack]

  function isSingleStack() {
    return navigation.length === 1
  }

  function isSingleRoute() {
    return isSingleStack() && navigation[0].length === 1
  }

  function isEmpty() {
    return navigation.length === 0
  }

  function getCurrentStackPosition() {
    return navigation.length - 1
  }

  function getCurrentRoute() {
    const lastStack = navigation[getCurrentStackPosition()]
    const lastPositionInLastStack = lastStack.length - 1
    return lastStack[lastPositionInLastStack]
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
    return getCurrentRoute()
  }

  function pushView(route: Route) {
    navigation[getCurrentStackPosition()].push(route)
    return route
  }

  function popView() {
    if (isSingleRoute()) return initialPath

    const lastPosition = getCurrentStackPosition()
    navigation[lastPosition].pop()

    if (navigation[lastPosition].length <= 0) navigation.pop()
    
    return getCurrentRoute()
  }

  function popToView(route: Route) {
    const lastStack = navigation[getCurrentStackPosition()]
    if (!find(lastStack, route)) throw Error('The route does not exist on the current stack')

    while (getCurrentRoute() !== route) {
      navigation[getCurrentStackPosition()].pop()
    }

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
