/*
  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *  http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

import { ActionHandler } from './actions/types'
import { BeagleError } from './errors'
import { Route } from './actions/navigation/types'



export type ComponentName<Schema> = keyof Schema | 'custom:error' | 'custom:loading'

export type TreeInsertionMode = 'prepend' | 'append' | 'replace'

export type TreeUpdateMode = TreeInsertionMode | 'replaceComponent'

export type BeagleMiddleware<Schema = DefaultSchema> = (uiTree: BeagleUIElement<Schema>) =>
  BeagleUIElement<Schema>

export type DefaultSchema = Record<string, Record<string, any>>

export type Style = Record<string, any>

export type Listener<Schema = DefaultSchema> = (tree: IdentifiableBeagleUIElement<Schema>) => void

export type ErrorListener = (errors: Array<BeagleError>) => void

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type NavigatorType = 'BROWSER_HISTORY' | 'BEAGLE_NAVIGATOR'

export type ExecutionMode = 'development' | 'production'

export type ComponentTypeMetadata = any





export interface BeagleStorage {
  getStorage: () => Storage,
  setStorage: (newStorageFn: Storage) => void,
}

export type Stack = Route[]

export interface BeagleNavigator {
  pushStack: (route: Route) => Route,
  popStack: () => Route,
  pushView: (route: Route) => Route,
  popView: () => Route,
  popToView: (route: string) => Route,
  resetStack: (route: Route) => Route,
  resetApplication: (route: Route) => Route,
  get: () => Stack[],
}

export interface URLBuilder {
  build: (path: string, baseUrl?: string) => string,
}

export interface BeagleView<Schema = DefaultSchema> {
  subscribe: (listener: Listener<Schema>) => (() => void),
  addErrorListener: (errorListener: ErrorListener) => (() => void),
  fetch: (
    params: LoadParams<Schema>,
    /* id of element to replace if mode is 'replaceComponent' or id of parent if mode is 'append' or
    'prepend'. If not specified, the operation will be done in the tree's root node. */
    elementId?: string,
    /* default mode is "replace" */
    mode?: TreeUpdateMode,
  ) => Promise<void>,
  getTree: () => IdentifiableBeagleUIElement<Schema>,
  getBeagleNavigator: () => BeagleNavigator,
  getRenderer: () => Renderer,
}

export interface BeagleContext<T = any> {
  replaceComponent: (params: LoadParams<T>) => Promise<void>,
  replace: (params: LoadParams<T>) => Promise<void>,
  append: (params: LoadParams<T>) => Promise<void>,
  prepend: (params: LoadParams<T>) => Promise<void>,
  getElementId: () => string,
  getElement: () => IdentifiableBeagleUIElement<T> | null,
  getView: () => BeagleView<T>,
}

export interface Renderer {
  doPartialRender: (
    viewTree: IdentifiableBeagleUIElement<any>,
    anchor?: string,
    mode?: TreeUpdateMode,
  ) => void,
  doFullRender: (
    viewTree: BeagleUIElement<any>,
    anchor?: string,
    mode?: TreeUpdateMode,
  ) => void,
}

export type GlobalContextListener = () => void

export interface GlobalContextAPI {
  get: (path?: string) => any,
  set: (value: any, path?: string) => void,
  clear: (path?: string) => void,
  getAsDataContext: () => DataContext,
  subscribe: (listener: GlobalContextListener) => (() => void),
}

export interface ErrorComponentParams {
  retry: () => void,
  errors: string[],
}
