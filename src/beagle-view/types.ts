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
import { BeagleService } from 'service/beagle-service/types'
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

export interface LoadParams {
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

export interface BeagleView {
  subscribe: (listener: Listener) => (() => void),
  addErrorListener: (listener: ErrorListener) => (() => void),
  fetch: (params: LoadParams, elementId?: string, mode?: TreeUpdateMode) => Promise<void>,
  getRenderer: () => Renderer,
  getTree: () => IdentifiableBeagleUIElement,
  getBeagleNavigator: () => BeagleNavigator,
  getBeagleService: () => BeagleService,
  destroy: () => void,
}
