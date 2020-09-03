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

import { BeagleUIElement, ComponentName, DefaultSchema } from 'beagle-tree/types'
import { ActionHandler } from 'action/types'
import { BeagleView } from 'beagle-view/types'
import { RemoteCache } from 'service/network/remote-cache/types'
import { DefaultHeaders } from 'service/network/default-headers/types'
import { URLBuilder } from 'service/network/url-builder/types'
import { ViewClient, Strategy } from 'service/network/view-client/types'
import { GlobalContext } from 'service/global-context/types'
import { ViewContentManagerMap } from 'service/view-content-manager/types'
import { ChildrenMetadataMap } from 'metadata/types'
import { HttpClient } from 'service/network/types'

export type Lifecycle = 'beforeStart' | 'beforeViewSnapshot' | 'afterViewSnapshot' | 'beforeRender'

export type ExecutionMode = 'development' | 'production'

export type LifecycleHook = (viewTree: Record<string, any>) => void | Record<string, any>

export type LifecycleHookMap = Record<Lifecycle, {
  global?: (tree: any) => any,
  components: Record<string, LifecycleHook>,
}>

export type BeagleMiddleware<Schema = DefaultSchema> = (uiTree: BeagleUIElement<Schema>) =>
  BeagleUIElement<Schema>

export type NavigatorType = 'BROWSER_HISTORY' | 'BEAGLE_NAVIGATOR'

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

export interface BeagleConfig<Schema> {
  /**
   * URL to the backend providing the views (JSON) for Beagle. 
   */
  baseUrl: string,
  /**
   * Reserved for future use. Has no effect for now.
   */
  schemaUrl?: string,
  /**
   * @deprecated Since version 1.2. Will be deleted in version 2.0. Use lifecycles instead.
   */
  middlewares?: Array<BeagleMiddleware<Schema>>,
  /**
   * The default cache strategy for fetching views from the backend.
   */
  strategy?: Strategy,
  /**
   * Custom function to make HTTP requests. You can use this to implement your own HTTP client,
   * calculating your own headers, cookies, response transformation, etc. The function provided here
   * must implement the same interface as the default fetch function of the browser. By default, the
   * browser's fetch function will be used.
   */
  fetchData?: typeof fetch,
  /**
   * Provides an Analytics client so Analytics records can be generated. By default, no Analytics
   * data is registered.
   */
  analytics?: Analytics,
  /**
   * The map of components to be used when rendering a view. The key must be the `_beagleComponent_`
   * identifier and the value must be the component itself. The key must always start with `beagle:`
   * or `custom:`.
   */
  components: {
    [K in ComponentName<Schema>]: any
  },
  /**
   * The map of custom actions. The key must be the `_beagleAction_` identifier and the value must
   * be the action handler. The key must always start with `beagle:` or `custom:`.
   */
  customActions?: Record<string, ActionHandler>,
  /**
   * The map of global lifecycles, these will be run when rendering a view, before the components
   * themselves are rendered as HTML.
   */
  lifecycles?: Partial<Record<Lifecycle, (viewTree: Record<string, any>) => void>>,
  /**
   * The custom storage. By default, uses the browser's `localStorage`.
   */
  customStorage?: Storage,
  /**
   * Wether or not to send specific beagle headers in the requests to fetch a view. Default is true.
   */
  useBeagleHeaders?: boolean,
}

export type BeagleService = Readonly<{
  createView: () => BeagleView,
  getConfig: () => BeagleConfig<any>,
  // processed configuration
  actionHandlers: Record<string, ActionHandler>,
  lifecycleHooks: LifecycleHookMap,
  childrenMetadata: ChildrenMetadataMap,
  // services
  storage: Storage,
  httpClient: HttpClient,
  urlBuilder: URLBuilder,
  analytics?: Analytics,
  remoteCache: RemoteCache,
  viewClient: ViewClient,
  defaultHeaders: DefaultHeaders,
  globalContext: GlobalContext,
  viewContentManagerMap: ViewContentManagerMap,
}>
