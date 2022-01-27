/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import pull from 'lodash/pull'
import BeagleView from 'beagle-view'
import logger from 'logger'
import { BeagleView as BeagleViewType } from 'beagle-view/types'
import { BeagleService } from 'service/beagle-service/types'
import {
  BeagleNavigator,
  DoubleStack as DoubleStackType,
  Route,
  LocalView,
  RemoteView,
  NavigatorChangeListener,
  DefaultWebNavigatorItem,
  NavigationController,
  NavigationContext,
} from './types'
import defaultWebController from './default-web-controller'
import DoubleStack from './double-stack'

function createDefaultWebNavigator<T>(
  beagleService: BeagleService,
  widgetBuilder: (view: BeagleViewType) => T,
  navigationStack: DoubleStackType<DefaultWebNavigatorItem<T>> = DoubleStack.create()
): BeagleNavigator<T> {
  const changeListeners: NavigatorChangeListener<T>[] = []
  const {
    navigationControllers,
    defaultNavigationController = defaultWebController,
  } = beagleService.getConfig()

  function createScreenAnalytics() {
    const topItem = navigationStack.getTopItem()
    if (!topItem) return
    beagleService.analyticsService.createScreenRecord({
      route: topItem.screen.id,
      rootId: topItem.screen.rootId,
      platform: beagleService.getConfig().platform,
    })
  }

  function isLocalView(route: Route) {
    return !!(route as LocalView).screen
  }

  function getRouteId(route: Route): string {
    return isLocalView(route) ? (route as LocalView).screen.id : (route as RemoteView).url
  }

  function getNavigationControllerById(controllerId?: string) {
    if (!controllerId) return defaultNavigationController
    if (!navigationControllers || !navigationControllers[controllerId]) {
      logger.warn(`No navigation controller with id ${controllerId} has been found. Using the default navigation controller.`)
      return defaultNavigationController
    }
    return navigationControllers[controllerId]
  }

  function getCurrentNavigationController() {
    return navigationStack.getTopItem()?.controller || defaultNavigationController
  }

  function onChange(listener: NavigatorChangeListener<T>) {
    changeListeners.push(listener)
    return () => pull(changeListeners, listener)
  }

  function setNavigationContext(context?: NavigationContext): void {
    if (context) {
      const localContexts = navigationStack.getTopItem()?.localContextsManager
      if (!localContexts) return

      const { path, value } = context
      localContexts.setContext('navigationContext', value, path)
    }
  }

  function runChangeListeners() {
    const topItem = navigationStack.getTopItem()
    if (!topItem) return
    changeListeners.forEach(l => l(topItem.screen.content, topItem.screen.id))
  }

  /**
   * The rootId is required by the analytics record. It is the id of the component at the root of the UI tree. We can only set this after the
   * "success" and "complete" events.
   */
  function updateRootIdOfCurrentScreen(id: string | undefined) {
    navigationStack.getTopItem()!.screen.rootId = id
  }

  async function fetchContentAndUpdateView(
    route: RemoteView,
    view: BeagleViewType,
    controller: NavigationController,
    completeNavigation: () => void,
  ) {
    try {
      controller.onLoading(view, completeNavigation)
      const loadedScreen = await beagleService.viewClient.fetch(route)
      controller.onSuccess(view, loadedScreen)
      completeNavigation()
      updateRootIdOfCurrentScreen(loadedScreen.id)
      createScreenAnalytics()
    } catch (error) {
      const retry = () => fetchContentAndUpdateView(route, view, controller, completeNavigation)
      controller.onError(view, error, retry, completeNavigation)
    }
  }

  async function newNavigationItem(
    route: string | Route | undefined,
    type: Extract<keyof DoubleStackType<T>, 'pushItem' | 'pushStack' | 'resetStack' | 'reset'>,
    controllerId?: string,
    navigationContext?: NavigationContext,
  ) {
    if (!route) return logger.error('Route should be defined')
    if (typeof route === 'string') return logger.error('To create a new navigation item, use a Route object')

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const view = BeagleView.create(beagleService, navigator)
    const stackController = type === 'pushItem' ? getCurrentNavigationController() : getNavigationControllerById(controllerId)
    const routeId = getRouteId(route)
    const widget = widgetBuilder(view)
    let completed = false

    const complete = () => {
      if (completed) return
      navigationStack[type]({
        controller: stackController,
        screen: {
          id: routeId,
          content: widget,
        },
        localContextsManager: view.getLocalContexts(),
      })

      setNavigationContext(navigationContext)
      runChangeListeners()
      completed = true
    }

    if (isLocalView(route)) {
      stackController.onSuccess(view, (route as LocalView).screen)
      complete()
      updateRootIdOfCurrentScreen(routeId)
      createScreenAnalytics()
      return Promise.resolve()
    }

    await fetchContentAndUpdateView(route as RemoteView, view, stackController, complete)
  }

  const navigator: BeagleNavigator<T> = {
    pushStack: ({ route, controllerId, navigationContext }) => newNavigationItem(route, 'pushStack', controllerId, navigationContext),
    popStack: ({ navigationContext }) => {
      if (navigationStack.hasSingleStack()) return logger.error("Can't pop stack, there's only a single stack in the navigation.")
      navigationStack.popStack()
      setNavigationContext(navigationContext)
      runChangeListeners()
      createScreenAnalytics()
    },
    pushView: ({ route, navigationContext }) => newNavigationItem(route, 'pushItem', undefined, navigationContext),
    popView: ({ navigationContext }) => {
      if (navigationStack.hasSingleItem()) return logger.error("Can't pop view, there's only a single view in the navigation.")
      navigationStack.popItem()
      setNavigationContext(navigationContext)
      runChangeListeners()
      createScreenAnalytics()
    },
    popToView: ({ route, navigationContext }) => {
      if (!route) return logger.error('Can\'t pop, route should not be undefined')
      const removed = navigationStack.popUntil((item) => item.screen.id === route)
      logger.error(`Can't pop to view "${route}"", it doesn't exist in the current stack.`)
      if (removed && removed.length) {
        setNavigationContext(navigationContext)
        runChangeListeners()
        createScreenAnalytics()
      }
    },
    resetStack: ({ route, controllerId, navigationContext }) => newNavigationItem(route, 'resetStack', controllerId, navigationContext),
    resetApplication: ({ route, controllerId, navigationContext }) => newNavigationItem(route, 'reset', controllerId, navigationContext),
    navigate: (type, route, controllerId, navigationContext) => {
      const result = navigator[type]({ route: route as any, controllerId, navigationContext })
      return result instanceof Promise ? result : Promise.resolve()
    },
    getCurrentRoute: () => navigationStack.getTopItem()?.screen.id,
    onChange,
    isEmpty: navigationStack.isEmpty,
  }

  return navigator
}

export default {
  /**
   * Creates a new Navigator.
   *
   * @param widgetBuilder the object representing the screen. In case of React, it's a React UI
   * tree, in case of Angular is an Angular UI tree. This depends on the technology in use. This
   * is a function that receives the Beagle View and returns the widget.
   */
  create: createDefaultWebNavigator,
}
