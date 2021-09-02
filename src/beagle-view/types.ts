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
import BeagleError from 'error/BeagleError'
import { BeagleService } from 'service/beagle-service/types'
import { HttpMethod } from 'service/network/types'
import { Strategy } from 'service/network/view-client/types'
import { BeagleNavigator } from './navigator/types'
import { Renderer } from './render/types'

export type Listener = (tree: IdentifiableBeagleUIElement) => void

export type ErrorListener = (errors: Array<BeagleError>) => void

export interface LoadParams {
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
  body?: any,

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

export interface BeagleView {
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
}

export interface CreateBeagleView {
  (
    beagleService: BeagleService,
    initialControllerId?: string,
  ): BeagleView,
}
