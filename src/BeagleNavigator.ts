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

import { Stack, BeagleNavigator } from './types'

const createBeagleNavigator = (initialPath: string): BeagleNavigator => {
  let initialStack = [initialPath]
  let navigation: Stack[] = [initialStack]

  function isSingleStack() {
    return navigation.length === 1
  }

  function isSingleRoute() {
    return isSingleStack() && navigation[0].length === 1
  }

  function getCurrentStack() {
    return navigation[navigation.length - 1]
  }

  function getCurrentRoute() {
    const currentStack = getCurrentStack()
    const lastPositionInCurrentStack = currentStack.length - 1
    return currentStack[lastPositionInCurrentStack]
  }

  function pushStack(route: string) {
    navigation.push([route])
    return getCurrentRoute()
  }

  function popStack() {
    if (isSingleStack()) throw Error('It was not possible to pop a stack because Beagle Navigator has only one recorded stack')

    navigation.pop()
    return getCurrentRoute()
  }

  function pushView(route: string) {
    getCurrentStack().push(route)
    return getCurrentRoute()
  }

  function popView() {
    if (isSingleRoute()) throw Error('It was not possible to pop a view because Beagle Navigator has only one recorded route')

    getCurrentStack().pop()
    if (getCurrentStack().length <= 0) navigation.pop()
    
    return getCurrentRoute()
  }

  function popToView(route: string) {
    const currentStack = getCurrentStack()
    const routeIndex = currentStack.findIndex(item => item === route)

    if (routeIndex === -1) throw new Error('The route does not exist on the current stack')
    currentStack.splice(routeIndex + 1)

    return getCurrentRoute()
  }

  function resetStack(route: string) {
    navigation.pop()
    pushStack(route)

    return getCurrentRoute()
  }

  function resetApplication(route: string) {
    initialStack = [route]
    navigation = [initialStack]

    return getCurrentRoute()
  }

  function get() {
    return navigation.map(stack => [...stack])
  }

  return {
    pushStack,
    popStack,
    pushView,
    popView,
    popToView,
    resetStack,
    resetApplication,
    get,
  }

}

export default createBeagleNavigator
