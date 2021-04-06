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
import { BeagleService, BeagleMiddleware } from 'service/beagle-service/types'
import { HttpMethod } from 'service/network/types'
import { Strategy } from 'service/network/view-client/types'
import { BeagleNavigator } from './navigator/types'
import { Renderer } from './render/types'

export type Listener = (tree: IdentifiableBeagleUIElement) => void

export type ErrorListener = (errors: Array<BeagleError>) => void

/**
 * @deprecated since 1.7.0 prefer using the HttpAdditionalData in your Route properties instead
 */
export interface NetworkOptions {
  /**
   * Additional headers to send in the request.
   */
  method?: HttpMethod,
  /**
   * Additional headers to send in the request.
   */
  headers?: Record<string, string>,
  /**
   * The cache strategy for fetching views from the backend. By default uses
   * `beagle-with-fallback-to-cache`.
   */
  strategy?: Strategy,
}

// todo: legacy code. Remove <T = any> with v2.0.
export interface LoadParams<T = any> {
  /**
   * The path to make the request. Will be combined with your `baseUrl`.
   */
  path: string,
  /**
   * A UI tree to fallback to when a network error occurs. When specified, the properties
   * `errorComponent` and `showError` are ignored.
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
   * Wether to show a loading component or not. True by default.
   */
  shouldShowLoading?: boolean,
  /**
   * Wether to show an error component or not. True by default.
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
   * @deprecated will be removed in v2.0. Use the navigator instead.
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
  getNavigator: () => BeagleNavigator,
  /**
   * Gets a copy of the NetworkOptions passed as parameter when creating this BeagleView. Undefined
   * is returned if no NetworkOptions was provided.
   * 
   * @returns the NetworkOptions
   */
  getNetworkOptions: () => NetworkOptions | undefined,
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

export interface CreateBeagleView {
  /**
   * @deprecated since v1.7. Will be deleted in v2.0. Instead, please use `route.httpAdditionalData`
   * when making a navigation.
   */
  (
    beagleService: BeagleService,
    networkOptions?: NetworkOptions,
    initialControllerId?: string,
  ): BeagleView,
  (
    beagleService: BeagleService,
    initialControllerId?: string,
  ): BeagleView,
}
