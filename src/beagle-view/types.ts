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
  doPartialRender: (
    viewTree: IdentifiableBeagleUIElement<any>,
    anchor?: string,
    mode?: TreeUpdateMode,
  ) => void,
  doFullRender: (viewTree: BeagleUIElement<any>, anchor?: string, mode?: TreeUpdateMode) => void,
}

export interface BeagleNavigator {
  pushStack: (route: Route) => Route,
  popStack: () => Route,
  pushView: (route: Route) => Route,
  popView: () => Route,
  popToView: (route: string) => Route,
  resetStack: (route: Route) => Route,
  resetApplication: (route: Route) => Route,
  get: () => Route[][],
}

// todo: legacy code. Remove <T = any> with v2.0.
export interface LoadParams<T = any> {
  path: string,
  fallback?: BeagleUIElement,
  method?: HttpMethod,
  headers?: Record<string, string>,
  shouldShowLoading?: boolean,
  shouldShowError?: boolean,
  strategy?: Strategy,
  loadingComponent?: string,
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
  subscribe: (listener: Listener) => (() => void),
  addErrorListener: (listener: ErrorListener) => (() => void),
  fetch: (params: LoadParams, elementId?: string, mode?: TreeUpdateMode) => Promise<void>,
  getRenderer: () => Renderer,
  getTree: () => IdentifiableBeagleUIElement,
  getBeagleNavigator: () => BeagleNavigator,
  getBeagleService: () => BeagleService,
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
