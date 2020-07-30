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

export type HttpMethod = 'post' | 'get' | 'put' | 'delete' | 'patch'

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

export type Strategy = (
  'beagle-cache-only'
  | 'beagle-with-fallback-to-cache'
  | 'network-with-fallback-to-cache'
  | 'cache-with-fallback-to-network'
  | 'cache-only'
  | 'network-only'
  | 'cache-first'
)

export type NavigatorType = 'BROWSER_HISTORY' | 'BEAGLE_NAVIGATOR'

export type ExecutionMode = 'development' | 'production'

export type ChildrenMetadataMap = Record<string, ChildrenMetadata>

export type ComponentTypeMetadata = any

export type Lifecycle = 'beforeStart' | 'beforeViewSnapshot' | 'afterViewSnapshot' | 'beforeRender'

export type LifecycleHook = (viewTree: Record<string, any>) => void | Record<string, any>

export type LifecycleHookMap = Record<Lifecycle, {
  global?: (tree: any) => any,
  components: Record<string, LifecycleHook>,
}>

export interface ClickEvent {
  category: string,
  label?: string,
  value?: string,
}

export interface ScreenEvent {
  screenName: string,
}

export interface Analytics {
  trackEventOnClick: (clickEvent: ClickEvent) => void,
  trackEventOnScreenAppeared: (screenEvent: ScreenEvent) => void,
  trackEventOnScreenDisappeared: (screenEvent: ScreenEvent) => void,
}

export interface BeagleDefaultHeaders {
  'beagle-platform': 'WEB',
  'beagle-hash'?: string,
}

export interface BeagleHeaders {
  setUseBeagleHeaders: (useDefaultBeagleHeaders?: boolean) => void,
  getBeagleHeaders: (url: string, method: HttpMethod) => Promise<{} | BeagleDefaultHeaders>,
}

export interface CacheMetadata {
  'beagleHash': string,
  'requestTime': number,
  'ttl': string,
}

export type ConfigCacheMetadata = Record<string, CacheMetadata>

export interface BeagleHttpClient {
  fetch: typeof fetch,
  setFetchFunction: (fetchFn: typeof fetch) => void,
}

export interface BeagleStorage {
  getStorage: () => Storage,
  setStorage: (newStorageFn: Storage) => void,
}

export interface BeagleConfig<Schema> {
  baseUrl: string,
  schemaUrl?: string,
  /**
   * @deprecated Since version 1.2. Will be deleted in version 2.0. Use lifecycles instead.
   */
  middlewares?: Array<BeagleMiddleware<Schema>>,
  strategy?: Strategy,
  fetchData?: typeof fetch,
  analytics?: Analytics,
  components: {
    [K in ComponentName<Schema>]: any
  },
  customActions?: Record<string, ActionHandler>,
  lifecycles?: Partial<Record<Lifecycle, (viewTree: Record<string, any>) => void>>,
  customStorage?: Storage,
  useBeagleHeaders?: boolean,
}

export interface LoadParams<Schema = DefaultSchema> {
  path: string,
  fallback?: BeagleUIElement<Schema>,
  method?: HttpMethod,
  headers?: Record<string, string>,
  shouldShowLoading?: boolean,
  shouldShowError?: boolean,
  strategy?: Strategy,
  loadingComponent?: ComponentName<Schema>,
  errorComponent?: ComponentName<Schema>,
}

export interface BeagleUIElement<Schema = DefaultSchema> {
  _beagleComponent_: ComponentName<Schema>,
  context?: DataContext,
  children?: Array<BeagleUIElement<Schema>>,
  style?: Record<string, any>,
  [key: string]: any,
}

export interface IdentifiableBeagleUIElement<Schema = DefaultSchema>
  extends BeagleUIElement<Schema> {
  id: string,
  children?: Array<IdentifiableBeagleUIElement<Schema>>,
}

export interface BeagleUIService<Schema = DefaultSchema, ConfigType = BeagleConfig<Schema>> {
  loadBeagleUITreeFromServer: (
    url: string,
    method?: HttpMethod,
    headers?: Record<string, string>,
  ) => Promise<BeagleUIElement<Schema>>,
  loadBeagleUITreeFromCache: (
    url: string,
    method?: HttpMethod,
  ) => Promise<BeagleUIElement<Schema> | null>,
  createView: (initialRoute: string) => BeagleView<Schema>,
  getConfig: () => ConfigType,
  globalContext: GlobalContextAPI,
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
  destroy: () => void,
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

export interface DataContext {
  id: string,
  value?: any,
}

export interface ChildrenMetadata {
  property: string,
  max?: number,
  min?: number,
  type?: string[],
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

export interface ComponentMetadata {
  children?: ChildrenMetadata,
  lifecycles?: Partial<Record<Lifecycle, LifecycleHook>>,
}

export interface ComponentWithMetadata {
  beagleMetadata?: ComponentMetadata,
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
