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
} from './types'
import defaultWebController from './default-web-controller'
import DoubleStack from './double-stack'

function createDefaultWebNavigator<T>(
  beagleService: BeagleService,
  widgetBuilder: (view: BeagleViewType) => T,
  navigationStack: DoubleStackType<DefaultWebNavigatorItem<T>> = DoubleStack.create()
): BeagleNavigator<T> {
  const analyticsListener: NavigatorChangeListener<T> = (_, routeId) => (
    beagleService.analyticsService.createScreenRecord({
      route: routeId,
      platform: beagleService.getConfig().platform,
    })
  )
  const changeListeners: NavigatorChangeListener<T>[] = [analyticsListener]
  const {
    navigationControllers,
    defaultNavigationController = defaultWebController,
  } = beagleService.getConfig()

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

  function runChangeListeners() {
    const topItem = navigationStack.getTopItem()
    if (!topItem) return
    changeListeners.forEach(l => l(topItem.screen.content, topItem.screen.id))
  }

  async function fetchContentAndUpdateView(
    route: RemoteView,
    view: BeagleViewType,
    controller: NavigationController,
    completeNavigation: () => void,
  ) {
    try {
      controller.onLoading(view, completeNavigation)
      const screen = await beagleService.viewClient.fetch(route)
      controller.onSuccess(view, screen)
      completeNavigation()
    } catch (error) {
      const retry = () => fetchContentAndUpdateView(route, view, controller, completeNavigation)
      controller.onError(view, error, retry, completeNavigation)
    }
  }

  async function newNavigationItem(
    route: Route,
    type: Extract<keyof DoubleStackType<T>, 'pushItem' | 'pushStack' | 'resetStack' | 'reset'>,
    controllerId?: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const view = BeagleView.create(beagleService, navigator)
    const stackController = type === 'pushItem'
      ? getCurrentNavigationController()
      : getNavigationControllerById(controllerId)
    const routeId = getRouteId(route)
    const widget = widgetBuilder(view)
    let completed = false

    const complete = () => {
      if (completed) return
      navigationStack[type]({
        controller: stackController,
        screen: { id: routeId, content: widget },
      })
      runChangeListeners()
      completed = true
    }

    if (isLocalView(route)) {
      stackController.onSuccess(view, (route as LocalView).screen)
      complete()
      return Promise.resolve()
    }

    await fetchContentAndUpdateView(route as RemoteView, view, stackController, complete)
  }

  const navigator: BeagleNavigator<T> = {
    pushStack: (route, controllerId) => newNavigationItem(route, 'pushStack', controllerId),
    popStack: () => {
      if (navigationStack.hasSingleStack()) {
        logger.error("Can't pop stack, there's only a single stack in the navigation.")
        return
      }
      navigationStack.popStack()
      runChangeListeners()
    },
    pushView: (route) => newNavigationItem(route, 'pushItem'),
    popView: () => {
      if (navigationStack.hasSingleItem()) {
        logger.error("Can't pop view, there's only a single view in the navigation.")
        return
      }
      navigationStack.popItem()
      runChangeListeners()
    },
    popToView: (route) => {
      const removed = navigationStack.popUntil(item => item.screen.id === route)
      logger.error(`Can't pop to view "${route}"", it doesn't exist in teh current stack.`)
      if (removed && removed.length) runChangeListeners()
    },
    resetStack: (route, controllerId) => newNavigationItem(route, 'resetStack', controllerId),
    resetApplication: (route, controllerId) => newNavigationItem(route, 'reset', controllerId),
    navigate: (type, route, controllerId) => {
      const result = navigator[type](route as any, controllerId)
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
