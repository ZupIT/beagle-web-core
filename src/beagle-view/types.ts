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

import { BeagleUIElement, IdentifiableBeagleUIElement, TreeUpdateMode } from 'beagle-tree/types'
import BeagleError from 'error/BeagleError'
import { Route } from 'action/navigation/types'
import { BeagleService, BeagleMiddleware } from 'service/beagle-service/types'
import { HttpMethod } from 'service/network/types'
import { Strategy } from 'service/network/view-client/types'

export type Listener = (tree: IdentifiableBeagleUIElement) => void

export type ErrorListener = (errors: Array<BeagleError>) => void

export interface Renderer {
  /**
   * Does a partial render to the BeagleView. Compared to the full render, it will skip every step
   * until the view snapshot, i.e, it will start by taking the view snapshot and end doing a render
   * to the screen. Useful when updating a view that has already been rendered. If the `viewTree`
   * hasn't been rendered before, you should use `doFullRender` instead.
   * 
   * To see the full documentation of the renderization process, please follow this link:
   * https://github.com/ZupIT/beagle-web-core/blob/master/docs/renderization.md
   * 
   * @param viewTree the new tree to render, can be just a new branch to add to the current tree
   * @param anchor when `viewTree` is just a new branch to be added to the tree, `anchor` must be
   * specified, it is the id of the component to attach `viewTree` to.
   * @param mode when `viewTree` is just a new branch to be added to the tree, the mode must be
   * specified. It can be `append`, `prepend` or `replace`.
   */
  doPartialRender: (
    viewTree: IdentifiableBeagleUIElement<any>,
    anchor?: string,
    mode?: TreeUpdateMode,
  ) => void,
  /**
   * Does a full render to the BeagleView. A full render means that every renderization step will
   * be executed for the tree passed as parameter. If `viewTree` has been rendered at least once,
   * you should call `doPartialRender` instead.
   * 
   * To see the full documentation of the renderization process, please follow this link:
   * https://github.com/ZupIT/beagle-web-core/blob/master/docs/renderization.md
   * 
   * @param viewTree the new tree to render, can be just a new branch to add to the current tree
   * @param anchor when `viewTree` is just a new branch to be added to the tree, `anchor` must be
   * specified, it is the id of the component to attach `viewTree` to.
   * @param mode when `viewTree` is just a new branch to be added to the tree, the mode must be
   * specified. It can be `append`, `prepend` or `replace`.
   */
  doFullRender: (viewTree: BeagleUIElement<any>, anchor?: string, mode?: TreeUpdateMode) => void,
}

export interface BeagleNavigator {
  /**
   * Creates and navigates to a new navigation stack where the first route is the parameter `route`.
   * 
   * @route the route to navigate to
   * @returns the current route after navigating
   */
  pushStack: (route: Route) => Route,
  /**
   * Removes the entire current navigation stack and navigates back to the last route of the
   * previous stack. Throws an error if there's only one navigation stack.
   * 
   * @returns the current route after navigating
   */
  popStack: () => Route,
  /**
   * Navigates to `route` by pushing it to the navigation history of the current navigation stack.
   * 
   * @route the route to navigate to
   * @returns the current route after navigating
   */
  pushView: (route: Route) => Route,
  /**
   * Goes back one entry in the navigation history. If the current stack has only one view, this
   * also pops the current stack. If only one stack and one view exist, it will throw an error.
   * 
   * @returns the current route after navigating
   */
  popView: () => Route,
  /**
   * Removes every navigation entry in the current stack until `route` is found. Navigates to
   * `route`. If `route` doesn't exist in the current stack, an error is thrown.
   * 
   * @returns the current route after navigating
   */
  popToView: (route: string) => Route,
  /**
   * Removes the current navigation stack and navigates to the a new stack where the first route is
   * the one passed as parameter.
   * 
   * @route the route to navigate to
   * @returns the current route after navigating 
   */
  resetStack: (route: Route) => Route,
  /**
   * Removes teh entire navigation history and starts it over by navigating to a new initial route
   * (passed as parameter).
   * 
   * @route the route to navigate to (new initial route)
   * @returns the current route after navigating 
   */
  resetApplication: (route: Route) => Route,
  /**
   * Gets a copy of the navigation history.
   * 
   * @returns a copy of all navigation stacks
   */
  get: () => Route[][],
}

// todo: legacy code. Remove <T = any> with v2.0.
export interface LoadParams<T = any> {
  /**
   * The path to make the request. Will be combined with your `baseUrl`.
   */
  path: string,
  /**
   * A tree to fallback to when an error occurs.
   */
  fallback?: BeagleUIElement,
  /**
   * The HTTPMethod to make the request. Default is `get`.
   */
  method?: HttpMethod,
  /**
   * Additional headers to send in the request.
   */
  headers?: Record<string, string>,
  /**
   * Wether to show a loading component or not. By default, uses the global configuration.
   */
  shouldShowLoading?: boolean,
  /**
   * Wether to show an error component or not. By default, uses the global configuration.
   */
  shouldShowError?: boolean,
  /**
   * The cache strategy to use. By default, uses the global configuration.
   */
  strategy?: Strategy,
  /**
   * A custom loading component to use. By default will use the loading component of the global
   * configuration.
   */
  loadingComponent?: string,
  /**
   * A custom error component to use. By default will use the error component of the global
   * configuration.
   */
  errorComponent?: string,
}

// todo: legacy code. Remove this entire type with v2.0.
export interface UpdateWithTreeParams<Schema> {
  sourceTree: BeagleUIElement<Schema>,
  middlewares?: Array<BeagleMiddleware<Schema>>,
  mode?: 'replace' | 'append' | 'prepend',
  elementId?: string,
  shouldRunMiddlewares?: boolean,
  shouldRunListeners?: boolean,
}

// todo: legacy code. Remove <T = any> with v2.0.
export interface BeagleView<T = any> {
  /**
   * Subscribes to every change to the beagle tree.
   * 
   * @param listener the function to run every time the tree changes. Must receive a tree as
   * parameter.
   * @returns a function to remove the listener (unsubscribe)
   */
  subscribe: (listener: Listener) => (() => void),
  /**
   * Subscribes to every error in the fetch and rendering process of a view.
   * 
   * @param listener the function to run every time an error occurs. Must receive an array of
   * errors.
   * @returns a function to remove the listener (unsubscribe)
   */
  addErrorListener: (listener: ErrorListener) => (() => void),
  /**
   * Fetches a new view and replaces the current tree with the result. The options for the request
   * and for the feedback to render to the user can all be passed in the first parameter `options`.
   * 
   * The view fetched can replace the entire tree (default behavior) or be attached to the current
   * tree. For the second behavior, the second and third parameter must be used. The second
   * parameter (`anchor`) is the id of the node to attach the view fetched to, while the third
   * parameter is the insertion strategy. The insertion strategy may be one of four:
   * 
   * - `replaceComponent`: replaces the node referred by `anchor` by the view fetched.
   * - `replace`: replaces the children of the node referred by `anchor` by the view fetched.
   * - `append`: adds the view fetched to the end of the array of children of the node referred by
   * `anchor`.
   * - `prepend`: adds the view fetched to the start of the array of children of the node referred
   * by `anchor`.
   * 
   * @param options an object containing the options for making the request.
   * @param anchor optional. The id of the node to attach the fetched view to. By default, it's
   * going to be the root node.
   * @param mode optional. The insertion mode. By default, it's `replaceComponent`.
   */
  fetch: (options: LoadParams, anchor?: string, mode?: TreeUpdateMode) => Promise<void>,
  /**
   * Gets the renderer of the current BeagleView. Can be used to control the rendering directly.
   * 
   * @returns the renderer
   */
  getRenderer: () => Renderer,
  /**
   * Gets a copy of the currently rendered tree.
   * 
   * @returns a copy of the current tree
   */
  getTree: () => IdentifiableBeagleUIElement,
  /**
   * Gets the navigator of the Beagle View.
   * 
   * @returns the navigator
   */
  getBeagleNavigator: () => BeagleNavigator,
  /**
   * Gets the BeagleService that created this BeagleView.
   * 
   * @returns the BeagleService
   */
  getBeagleService: () => BeagleService,
  /**
   * Destroys the current view. Should be used when the BeagleView won't be used anymore. Avoids
   * memory leaks and calls to objects that don't exist any longer.
   */
  destroy: () => void,
  /**
   * @deprecated since v1.2. Will de deleted in v2.0. Use `BeagleView.fetch` instead.
   */
  updateWithFetch: (
    params: LoadParams,
    elementId?: string,
    mode?: 'append' | 'prepend' | 'replace',
  ) => Promise<void>,
  /**
   * @deprecated since v1.2. Will be deleted in v2.0. Use `BeagleView.getRenderer().doFullRender`
   * or `BeagleView.getRenderer().doPartialRender` instead.
   */
  updateWithTree: (params: UpdateWithTreeParams<T>) => void,
}
