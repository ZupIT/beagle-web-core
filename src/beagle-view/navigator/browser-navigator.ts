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
import find from 'lodash/find'
import BeagleNavigationError from 'error/BeagleNavigationError'
import logger from 'logger'
import { debounce, isEqual } from 'lodash'
import {
  BeagleNavigator,
  Route,
  Stack,
  NavigationType,
  NavigationListener,
  NavigationController,
  HistoryState,
} from './types'

const createBeagleBrowserNavigator = (
  navigationControllers?: Record<string, NavigationController>,
  initialValue?: Stack[],
): BeagleNavigator => {
  const navigation: Stack[] = initialValue ? cloneDeep(initialValue) : []
  let isNavigationInProgress = false
  let isDestroyed = false
  let popStateListener: any
  const history = window.history
  const defaultNavigationController = find(navigationControllers, { default: true }) || {}
  const listeners: NavigationListener[] = []
  const popped: any[] = []

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

  function runListeners(route: Route) {
    const controllerId = history.state ? history.state.controllerId : undefined
    const navigationController = getNavigationController(controllerId)
    return Promise.all(listeners.map(l => l(route, navigationController)))
  }

  function isRouteIdentifiedBy(route: Route, id: string) {
    return ('url' in route && route.url === id) ||
      ('screen' in route && route.screen.identifier === id)
  }

  async function back() {
    setTimeout(async () => {
      popped.unshift(history.state)
      try {
        await history.back()
      } catch { }

    }, 10)
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
        const historyState: HistoryState = {
          isBeagleState: true,
          route: route,
          controllerId: controllerId,
          stack: history.state.stack ? history.state.stack + 1 : 0,
        }

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
          popped.forEach(state => history.pushState(state, ''))
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
          route: route,
          controllerId: controllerId,
          stack: history.state.stack || 0,
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
        if (!route || typeof route !== 'string') {
          throw new BeagleNavigationError(`Invalid route for popToView. Expected: string. Received: ${route}.`)
        }

        const error = new BeagleNavigationError('The route does not exist in the current stack')
        if (!history.length || !route) throw error
        const popped: any[] = []
        const currentStack = history.state.stack


        const findViewToPop = async () => {
          if (history.state.isBeagleState && currentStack === history.state.stack && !isRouteIdentifiedBy(history.state.route, route))
            await back()
        }

        await findViewToPop()


        if (!history.state.isBeagleState) {
          popped.forEach(state => history.pushState(state, ''))
          throw new BeagleNavigationError(`Invalid history state ${history.state}. When you choose Beagle to manage the browser history, you shouldn\'t let any other tool manipulate it.`)
        }

        if (history.state.stack !== currentStack) {
          popped.forEach(state => history.pushState(state, ''))
          throw error
        }
      },

      resetStack: async () => {
        if (!route || typeof route === 'string') {
          throw new BeagleNavigationError(`Invalid route for pushView. Expected: Route object. Received: ${route}.`)
        }

        const currentStack = history.state.stack

        const historyState: HistoryState = {
          isBeagleState: true,
          route: route,
          controllerId: controllerId,
          stack: currentStack,
        }

        const findStackToReset = async () => {
          if (history.state.stack < currentStack)
            await back()
        }
        await findStackToReset()
        history.pushState(historyState, '')
      },

      resetApplication: async () => {
        if (!route || typeof route === 'string') {
          throw new BeagleNavigationError(`Invalid route for resetApplication. Expected: Route object. Received: ${route}.`)
        }

        const historyState: HistoryState = {
          isBeagleState: true,
          route: route,
          controllerId: controllerId,
          stack: 0,
        }

        const findViewToReset = async () => {
          if (!history.state.isBeagleState)
            await back()
        }
        await findViewToReset()
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
    if (!window || !history && history === undefined) return

    if (!history.state) {
      const initialState: HistoryState = {
        isBeagleState: true,
        route: navigation[0].routes[0],
        controllerId: navigation[0].controllerId,
        stack: 0,
      }
      history.pushState(initialState, '')
    }

    function popStateHandler(event: PopStateEvent) {
      if (isEqual(event.state.route, history.state)) return
      runListeners(event.state.route)
    }

    // popStateListener scope should be global to the browser navigator
    popStateListener = debounce(popStateHandler, 500)

    window.addEventListener('popstate', popStateListener)
  }

  function destroy() {
    isDestroyed = true
    window.removeEventListener('popstate', popStateListener)
  }

  function isEmpty() {
    return !history.state || history.state.stack === 0 || !history.state.route
  }

  setupEventListener()

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
