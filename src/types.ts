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

import { BeagleError } from './errors'

export type HttpMethod = 'post' | 'get' | 'put' | 'delete' | 'patch'

export type ComponentName<Schema> = keyof Schema | 'error' | 'loading'

export type TreeInsertionMode = 'prepend' | 'append'

export type TreeUpdateMode = TreeInsertionMode | 'replace'

export type BeagleMiddleware<Schema = DefaultSchema> = (uiTree: BeagleUIElement<Schema>) =>
  BeagleUIElement<Schema> | Promise<BeagleUIElement<Schema>>

export type DefaultSchema = Record<string, Record<string, any>>

export type Style = Record<string, any>

export type Listener<Schema = DefaultSchema> = (tree: IdentifiableBeagleUIElement<Schema>) => void

export type ErrorListener = (errors: Array<BeagleError>) => void

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Strategy = (
  'network-with-fallback-to-cache'
  | 'cache-with-fallback-to-network'
  | 'cache-only'
  | 'network-only'
  | 'cache-first'
)

export type RequestOptions = {
  body?: BodyInit,
  headers?: HeadersInit,
  method?: string,
}

export type FetchData = (url: string, options?: RequestOptions) => Promise<Response>

export interface BeagleConfig<Schema> {
  baseUrl: string,
  schemaUrl?: string,
  middlewares?: Array<BeagleMiddleware<Schema>>,
  strategy?: Strategy,
  components: {
    [K in ComponentName<Schema>]: any
  },
}

export interface LoadParams<Schema = DefaultSchema> {
  path: string,
  baseUrl?: string,
  method?: HttpMethod,
  headers?: Record<string, string>,
  middlewares?: Array<BeagleMiddleware<Schema>>,
  shouldShowLoading?: boolean,
  shouldShowError?: boolean,
  strategy?: Strategy,
  loadingComponent?: ComponentName<Schema>,
  errorComponent?: ComponentName<Schema>,
  fetchData?: FetchData,
}

export interface BeagleUIElement<Schema = DefaultSchema> {
  _beagleType_: ComponentName<Schema>,
  children?: Array<BeagleUIElement<Schema>>,
  [key: string]: any,
  styleProperties?: Record<string, any>,
}

export interface IdentifiableBeagleUIElement<Schema = DefaultSchema>
  extends BeagleUIElement<Schema> {
  id: string,
  children?: Array<IdentifiableBeagleUIElement<Schema>>,
}

export interface XmlOptions<Schema> {
  formatTagName: (componentName: ComponentName<Schema>) => string,
  shouldAddAttribute: (componentName: ComponentName<Schema>, attName: string) => boolean,
  formatAttributeName: (name: string) => string,
  formatAttributeValue: (value: any) => string,
}

export interface BeagleUIService<Schema = DefaultSchema, ConfigType = BeagleConfig<Schema>> {
  loadBeagleUITreeFromServer: (url: string, method?: HttpMethod) =>
    Promise<BeagleUIElement<Schema>>,
  loadBeagleUITreeFromCache: (
    url: string,
    method?: HttpMethod,
    headers?: Record<string, string>,
    shouldSaveCache?: boolean,
  ) => Promise<BeagleUIElement<Schema> | null>,
  createView: () => BeagleView<Schema>,
  convertBeagleUiTreeToXml: (
    uiTree: BeagleUIElement<Schema>,
    options?: Partial<XmlOptions<Schema>>,
  ) => string,
  getConfig: () => ConfigType,
}

export interface UpdateWithTreeParams<Schema> {
  sourceTree: BeagleUIElement<Schema>,
  middlewares?: Array<BeagleMiddleware<Schema>>,
  /* default mode is "replace" */
  mode?: TreeUpdateMode,
  /* id of element to replace if mode is 'replace' or id of parent if mode is 'append' or 'prepend'.
  If not specified, the operation will be done in the tree's root node. */
  elementId?: string,
  shouldRunMiddlewares?: boolean,
  shouldRunListeners?: boolean,
}

export interface BeagleView<Schema = DefaultSchema> {
  subscribe: (listener: Listener<Schema>) => (() => void),
  addErrorListener: (errorListener: ErrorListener) => (() => void),
  updateWithFetch: (
    params: LoadParams<Schema>,
    /* id of element to replace if mode is 'replace' or id of parent if mode is 'append' or
    'prepend'. If not specified, the operation will be done in the tree's root node. */
    elementId?: string,
    /* default mode is "replace" */
    mode?: TreeUpdateMode,
  ) => Promise<void>,
  updateWithTree: (params: UpdateWithTreeParams<Schema>) => Promise<void>,
  getTree: () => IdentifiableBeagleUIElement<Schema>,
}

export interface BeagleContext<T = any> {
  replace: (params: LoadParams<T>) => Promise<void>,
  append: (params: LoadParams<T>) => Promise<void>,
  prepend: (params: LoadParams<T>) => Promise<void>,
  updateWithTree: (params: Omit<UpdateWithTreeParams<T>, 'elementId'>) => Promise<void>,
  getElementId: () => string,
  getElement: () => IdentifiableBeagleUIElement<T> | null,
  getView: () => BeagleView<T>,
}
