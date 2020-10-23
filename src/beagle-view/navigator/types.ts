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

import { BeagleUIElement } from 'beagle-tree/types'

export type NavigationType = (
  | 'pushStack'
  | 'pushView'
  | 'popStack'
  | 'popView'
  | 'popToView'
  | 'resetStack'
  | 'resetApplication'
)

export type NavigationListener = (
  route: Route,
  navigationController: NavigationController,
) => void | Promise<void>

export interface RemoteView {
  url: string,
  fallback?: BeagleUIElement,
  shouldPrefetch?: boolean,
}

export interface LocalView {
  screen: Screen,
}

interface Screen extends BeagleUIElement {
  /**
 *  @deprecated since v1.4.0, please use id instead
 *  todo: remove screenComponent.identifier with the release of v2.0.0"
 */
  identifier?: string,
  id?: string
}

export type Route = LocalView | RemoteView

export interface Stack {
  routes: Route[],
  controllerId?: string,
}

export interface NavigationController {
  /**
   * If true, uses this as the default navigation controller.
   */
  default?: boolean,
  /**
   * Wether to show a loading component or not. True by default.
   */
  shouldShowLoading?: boolean,
  /**
   * Wether to show an error component or not. True by default.
   */
  shouldShowError?: boolean,
  /**
   * A custom loading component to use. The default value is "beagle:loading"
   */
  loadingComponent?: string,
  /**
   * A custom error component to use. The default value is "beagle:error"
   */
  errorComponent?: string,
}

export interface BeagleNavigator {
  /**
   * Subscribes to view navigations. The listener is executed before any change is done to the
   * navigation history. If a listener throws an error, the navigation is aborted, i.e. the
   * navigation history is not changed. The navigation history only changes after all listeners
   * are successfully executed.
   * 
   * The listener is called with two parameters: the first is the resulting route of the
   * navigation. The second is the navigation controller to use for this navigation. A navigation
   * controller is nothing more than a set of options to perform the navigation.
   * 
   * @param listener the navigation listener
   * @returns a function that, when called, unsubscribes the listener from the Navigator
   */
  subscribe: (listener: NavigationListener) => (() => void),
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
  popStack: () => Promise<void>,
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
  popView: () => Promise<void>,
  /**
   * Removes every navigation entry in the current stack until `route` is found. Navigates to
   * `route`. If `route` doesn't exist in the current stack, an error is thrown.
   * 
   * @returns a promise that resolves as soon as the navigation completes
   */
  popToView: (route: string) => Promise<void>,
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
   * Gets a copy of the navigation history.
   * 
   * @returns a copy of all navigation stacks
   */
  get: () => Stack[],
  /**
   * Verifies if the navigation history is empty, i.e. if there are no registered routes.
   * 
   * @returns true for an empty navigation history, false otherwise.
   */
  isEmpty: () => boolean,
  /**
   * Destroys the navigator.
   */
  destroy: () => void,
}
