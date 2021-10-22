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

import { BeagleUIElement, IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { BeagleView } from 'beagle-view/types'
import { HttpMethod } from 'service/network/types'

/**
 * This data structure represents a stack of stacks and offers some utilities methods to read
 * and manipulate it.
 */
export interface DoubleStack<T> {
  pushItem: (item: T) => void,
  popItem: () => T | undefined,
  popUntil: (predicate: (item: T) => boolean) => T[],
  pushStack: (item: T) => void,
  popStack: () => T[] | undefined,
  resetStack: (item: T) => void,
  reset: (item: T) => void,
  getTopItem: () => T | undefined,
  isEmpty: () => boolean,
  hasSingleStack: () => boolean,
  hasSingleItem: () => boolean,
  asMatrix: () => T[][],
}

export interface DefaultWebNavigatorItem<T> {
  screen: { id: string, content: T },
  controller: NavigationController,
}

export type NavigationType = Extract<keyof BeagleNavigator<any>, (
  | 'pushStack'
  | 'pushView'
  | 'popStack'
  | 'popView'
  | 'popToView'
  | 'resetStack'
  | 'resetApplication'
)>

export interface HttpAdditionalData {
  method: HttpMethod,
  headers: Record<string, string>,
  body: any,
}

export interface RemoteView {
  url: string,
  fallback?: BeagleUIElement,
  shouldPrefetch?: boolean,
  httpAdditionalData?: HttpAdditionalData,
}

export interface LocalView {
  screen: IdentifiableBeagleUIElement,
}

export type Route = LocalView | RemoteView

export interface NavigationController {
  onLoading: (view: BeagleView, completeNavigation: () => void) => void,
  onError: (
    view: BeagleView,
    error: any,
    retry: () => Promise<void>,
    completeNavigation: () => void,
  ) => void,
  onSuccess: (view: BeagleView, screen: BeagleUIElement) => void,
}

export type NavigatorChangeListener<T> = (widget: T, routeId: string) => void

export interface BeagleNavigator<T> {
  /**
   * Creates and navigates to a new navigation stack where the first route is the parameter `route`.
   *
   * @param route the route to navigate to
   * @param controllerId optional. NavigationController to use for this specific stack.
   * @returns a promise that resolves as soon as the navigation completes
   */
  pushStack: (route: Route, controllerId?: string) => Promise<void>,
  /**
   * Removes the entire current navigation stack and navigates back to the last route of the
   * previous stack. Throws an error if there's only one navigation stack.
   *
   * @returns a promise that resolves as soon as the navigation completes
   */
  popStack: () => void,
  /**
   * Navigates to `route` by pushing it to the navigation history of the current navigation stack.
   *
   * @param route the route to navigate to
   * @returns a promise that resolves as soon as the navigation completes
   */
  pushView: (route: Route) => Promise<void>,
  /**
   * Goes back one entry in the navigation history. If the current stack has only one view, this
   * also pops the current stack. If only one stack and one view exist, it will throw an error.
   *
   * @returns a promise that resolves as soon as the navigation completes
   */
  popView: () => void,
  /**
   * Removes every navigation entry in the current stack until `route` is found. Navigates to
   * `route`. If `route` doesn't exist in the current stack, an error is thrown.
   *
   * @returns a promise that resolves as soon as the navigation completes
   */
  popToView: (route: string) => void,
  /**
   * Removes the current navigation stack and navigates to the a new stack where the first route is
   * the one passed as parameter.
   *
   * @param route the route to navigate to
   * @param controllerId optional. NavigationController to use for this specific stack.
   * @returns a promise that resolves as soon as the navigation completes
   */
  resetStack: (route: Route, controllerId?: string) => Promise<void>,
  /**
   * Removes the entire navigation history and starts it over by navigating to a new initial route
   * (passed as parameter).
   *
   * @param route the route to navigate to (new initial route)
   * @param controllerId optional. NavigationController to use for this specific stack.
   * @returns a promise that resolves as soon as the navigation completes
   */
  resetApplication: (route: Route, controllerId?: string) => Promise<void>,
  /**
   * This is generic function to call any navigation type. For quick reference, read the JSDocs of
   * each method separately. If the route provided is not of the type expected by the navigation
   * type, an error is thrown.
   *
   * @param the navigation type
   * @param route the route expected by the navigation type
   * @param controllerId the controller id for navigation actions of type pushStack, resetStack and
   * resetApplication
   * @returns a promise that resolves as soon as the navigation completes
   */
  navigate: (
    type: NavigationType,
    route?: Route | string,
    controllerId?: string,
  ) => Promise<void>,
  /**
   * Check if the navigator is empty
   */
  isEmpty: () => boolean,
  /**
   * Get the current route name. If the navigator is empty, undefined is returned.
   */
  getCurrentRoute: () => string | undefined,
  /**
   * Registers a listener to run every time the navigation stack changes.
   */
  onChange: (listener: NavigatorChangeListener<T>) => () => void,
}
