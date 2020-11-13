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

import BeagleNavigationError from 'error/BeagleNavigationError'
import { debounce, find, isEqual } from 'lodash'
import {
  BeagleNavigator,
  Route,
  Stack,
  NavigationType,
  NavigationListener,
  NavigationController,
  HistoryState,
} from './types'
import { isRouteIdentifiedBy } from './navigator.commons'
import logger from 'logger'

const createBeagleBrowserNavigator = (
  navigationControllers?: Record<string, NavigationController>,
  initialValue?: Stack[],
): BeagleNavigator => {
  let isNavigationInProgress = false
  let isDestroyed = false
  let popStateListener: any
  const defaultNavigationController = find(navigationControllers, { default: true }) || {}
  const history = window.history
  const listeners: NavigationListener[] = []

  function subscribe(listener: NavigationListener) {
    listeners.push(listener)

    return () => {
      const index = listeners.indexOf(listener)
      if (index !== -1) listeners.splice(index, 1)
    }
  }

  async function back() {
    await new Promise(resolve => {
      setTimeout(() => {
        try {
          resolve(history.back())
        } catch { }
      }, 10)
    })
  }

  function getNavigationController(controllerId?: string,) {

    if (!controllerId) return defaultNavigationController
    if (!navigationControllers || !navigationControllers[controllerId]) {
      logger.warn(`No navigation controller with id ${controllerId} has been found. Using the default navigation controller.`)
      return defaultNavigationController
    }
    return navigationControllers[controllerId]
  }

  function runListeners(route: Route) {
    const controllerId = history.state && history.state.controllerId || undefined
    const navigationController = getNavigationController(controllerId)
    return Promise.all(listeners.map(l => l(route, navigationController)))
  }

  function initInitialValues() {
    if (!initialValue) return
    initialValue.forEach((stack: Stack, index: number) => {
      stack.routes.forEach(async (route: Route) => {
        await runListeners(route)
        const historyState: HistoryState = {
          isBeagleState: true,
          route,
          controllerId: stack.controllerId,
          stack: index || 0,
        }
        history.pushState(historyState, '')
      })
    })
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

        const historyState: HistoryState = {
          isBeagleState: true,
          route,
          controllerId,
          stack: history.state && history.state.stack++ || 0,
        }

        await runListeners(route)

        history.pushState(historyState, '')
      },

      popStack: async () => {
        const stackToRemove = history.state.stack

        if (stackToRemove === 0) {
          throw new BeagleNavigationError('It was not possible to pop a stack because Beagle Navigator has not more than one recorded stack.')
        }

        const findStackToPop = async () => {
          if (history.state.isBeagleState && history.state.stack === stackToRemove)
            await back()
        }

        await findStackToPop()

        if (!history.state.isBeagleState) {
          throw new BeagleNavigationError(`Invalid history state ${history.state}. When you choose Beagle to manage the browser history, you shouldn\'t let any other tool manipulate it.`)
        }
      },

      pushView: async () => {
        if (!route || typeof route === 'string') {
          throw new BeagleNavigationError(`Invalid route for pushView. Expected: Route object. Received: ${route}.`)
        }

        await runListeners(route)

        const historyState: HistoryState = {
          isBeagleState: true,
          route,
          controllerId,
          stack: history.state && history.state.stack || 0,
        }

        history.pushState(historyState, '')
      },

      popView: async () => {
        const error = new BeagleNavigationError('It was not possible to pop a view because Beagle Navigator has not more than one recorded route.')

        if (!history.length || !history.state.isBeagleState) throw error

        const currentState = history.state

        history.back()

        if (!history.state.isBeagleState) {
          history.pushState(currentState, '')
          throw error
        }

      },

      popToView: async () => {
        const error = new BeagleNavigationError('The route does not exist in the current stack')

        if (!route || typeof route !== 'string') {
          throw new BeagleNavigationError(`Invalid route for popToView. Expected: string. Received: ${route}.`)
        }

        if (!history.state.isBeagleState) {
          throw new BeagleNavigationError(`Invalid history state ${history.state}. When you choose Beagle to manage the browser history, you shouldn\'t let any other tool manipulate it.`)
        }

        if (!history.length || !route) throw error

        const currentStack = history.state.stack

        const findViewToPop = async () => {
          while (history.state.isBeagleState && currentStack === history.state.stack && !isRouteIdentifiedBy(history.state.route, route))
            await back()
        }

        findViewToPop()

      },

      resetStack: async () => {
        if (!route || typeof route === 'string') {
          throw new BeagleNavigationError(`Invalid route for pushView. Expected: Route object. Received: ${route}.`)
        }

        const currentStack = history.state.stack
        const historyState: HistoryState = {
          isBeagleState: true,
          route,
          controllerId,
          stack: currentStack,
        }

        const findStackToReset = async () => {
          if (history.state.stack < currentStack)
            await back()
        }
        await findStackToReset()
        await runListeners(route)
        history.pushState(historyState, '')
      },

      resetApplication: async () => {
        if (!route || typeof route === 'string') {
          throw new BeagleNavigationError(`Invalid route for resetApplication. Expected: Route object. Received: ${route}.`)
        }

        const historyState: HistoryState = {
          isBeagleState: true,
          route,
          controllerId,
          stack: 0,
        }

        const findViewToReset = async () => {
          if (!history.state.isBeagleState)
            await back()
        }

        await findViewToReset()
        await runListeners(route)
        history.replaceState(historyState, '')
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
    return history.state.route
  }

  function setupEventListener() {
    if (!window || !history) return

    function popStateHandler(event: PopStateEvent) {
      if (isEqual(event.state.route, history && history.state)) return
      runListeners(event.state.route)
    }

    popStateListener = debounce(popStateHandler, 500)

    window.addEventListener('popstate', popStateListener)
  }

  function destroy() {
    isDestroyed = true
    window.removeEventListener('popstate', popStateListener)
  }

  function isEmpty() {
    return !history.state || !history.state.route
  }

  setupEventListener()
  initInitialValues()

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
  create: createBeagleBrowserNavigator,
}
