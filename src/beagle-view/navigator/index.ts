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

import cloneDeep from 'lodash/cloneDeep'
import last from 'lodash/last'
import nth from 'lodash/nth'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import BeagleNavigationError from 'error/BeagleNavigationError'
import logger from 'logger'
import {
  BeagleNavigator,
  Route,
  Stack,
  NavigationType,
  NavigationListener,
  NavigationController,
} from './types'

const createBeagleNavigator = (
  navigationControllers?: Record<string, NavigationController>,
  initialValue?: Stack[],
): BeagleNavigator => {
  let navigation: Stack[] = initialValue ? cloneDeep(initialValue) : []
  let isNavigationInProgress = false
  let isDestroyed = false
  const defaultNavigationController = find(navigationControllers, { default: true }) || {}
  const listeners: NavigationListener[] = []

  function getNavigationController(controllerId?: string) {
    if (!controllerId) return defaultNavigationController
    if (!navigationControllers || !navigationControllers[controllerId]) {
      logger.warn(`No navigation controller with id ${controllerId} has been found. Using the default navigation controller.`)
      return defaultNavigationController
    }
    return navigationControllers[controllerId]
  }

  function subscribe(listener: NavigationListener) {
    listeners.push(listener)

    return () => {
      const index = listeners.indexOf(listener)
      if (index !== -1) listeners.splice(index, 1)
    }
  }

  function isSingleStack() {
    return navigation.length < 2
  }

  function isSingleRoute() {
    return isSingleStack() && (!navigation[0] || navigation[0].routes.length < 2)
  }

  function getCurrentStack() {
    const stack = last(navigation)
    if (!stack) throw new BeagleNavigationError('Navigation has no stacks!')
    return stack
  }

  function getPreviousStack() {
    const stack = nth(navigation, -2)
    if (!stack) throw new BeagleNavigationError('Only one navigation stack! Can\'t get previous!')
    return stack
  }

  function getPreviousRoute() {
    const currentStack = getCurrentStack()
    const route = currentStack.routes.length > 1
      ? nth(currentStack.routes, -2)
      : last(getPreviousStack().routes)

    if (!route) throw new BeagleNavigationError('Only one route! Can\'t get previous!')
    return route
  }

  function runListeners(route: Route) {
    const controllerId = navigation.length ? getCurrentStack().controllerId : undefined
    const navigationController = getNavigationController(controllerId)
    return Promise.all(listeners.map(l => l(route, navigationController)))
  }

  function getRouteIndex(route: string, currentStack: Stack) {
    let index = findIndex(currentStack.routes, { url: route })
    if (index === -1) {
      for (let i = 0; i < currentStack.routes.length; i++) {
        const r = currentStack.routes[i]
        if ('screen' in r && r.screen.screenId === route) {
          index = i
          break
        }
      }
    }
    return index
  }

  async function navigate(
    type: NavigationType,
    route?: Route | string,
    controllerId?: string,
  ) {
    const handlers: Record<NavigationType, () => Promise<void>> = {
      pushStack: async () => {
        if (!route || typeof route === 'string') {
          throw new BeagleNavigationError(`Invalid route for pushStack. Expected: Route object. Received: ${route}.`)
        }

        await runListeners(route)
        navigation.push({ routes: [route], controllerId })
      },

      popStack: async () => {
        if (isSingleStack()) {
          throw new BeagleNavigationError('It was not possible to pop a stack because Beagle Navigator has not than one recorded stack.')
        }

        const route = last(getPreviousStack().routes)!
        await runListeners(route)
        navigation.pop()
      },

      pushView: async () => {
        if (!route || typeof route === 'string') {
          throw new BeagleNavigationError(`Invalid route for pushView. Expected: Route object. Received: ${route}.`)
        }

        await runListeners(route)
        if (navigation.length === 0) navigation.push({ routes: [] })
        getCurrentStack().routes.push(route)
      },

      popView: async () => {
        if (isSingleRoute()) {
          throw new BeagleNavigationError('It was not possible to pop a view because Beagle Navigator has not more than one recorded route')
        }

        await runListeners(getPreviousRoute())
        const currentStack = getCurrentStack()
        currentStack.routes.pop()
        if (currentStack.routes.length <= 0) navigation.pop()
      },

      popToView: async () => {
        if (!route || typeof route !== 'string') {
          throw new BeagleNavigationError(`Invalid route for popToView. Expected: string. Received: ${route}.`)
        }

        const currentStack = getCurrentStack()
        const index = getRouteIndex(route, currentStack)
        if (index === -1) throw new BeagleNavigationError('The route does not exist in the current stack')
        await runListeners(currentStack.routes[index])
        currentStack.routes.splice(index + 1)
      },

      resetStack: async () => {
        if (!route || typeof route === 'string') {
          throw new BeagleNavigationError(`Invalid route for pushView. Expected: Route object. Received: ${route}.`)
        }

        await runListeners(route)
        navigation.pop()
        navigation.push({ routes: [route], controllerId })
      },

      resetApplication: async () => {
        if (!route || typeof route === 'string') {
          throw new BeagleNavigationError(`Invalid route for resetApplication. Expected: Route object. Received: ${route}.`)
        }

        await runListeners(route)
        navigation = [{ routes: [route], controllerId }]
      },
    }

    if (isDestroyed) {
      throw new BeagleNavigationError('Can\'t perform navigation on a navigator that has already been destroyed.')
    }

    if (isNavigationInProgress) {
      throw new BeagleNavigationError(`Another navigation is already in progress. Can't navigate to ${route}.`)
    }

    isNavigationInProgress = true
    try {
      await handlers[type]()
    } finally {
      isNavigationInProgress = false
    }
  }

  function get() {
    return cloneDeep(navigation)
  }

  function destroy() {
    isDestroyed = true
  }

  function isEmpty() {
    const numberOfRoutes = navigation.reduce((result, stack) => result + stack.routes.length, 0)
    return numberOfRoutes === 0
  }

  return {
    pushStack: (route, controllerId) => navigate('pushStack', route, controllerId),
    popStack: () => navigate('popStack'),
    pushView: route => navigate('pushView', route),
    popView: () => navigate('popView'),
    popToView: route => navigate('popToView', route),
    resetStack: (route, controllerId) => navigate('resetStack', route, controllerId),
    resetApplication: (route, controllerId) => (
      navigate('resetApplication', route, controllerId)
    ),
    subscribe,
    get,
    navigate,
    isEmpty,
    destroy,
  }
}

export default {
  create: createBeagleNavigator,
}
