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

import { Strategy } from 'service/network/types'
import { BeagleUIElement, ComponentName, DefaultSchema } from 'beagle-tree/types'
import { ActionHandler } from 'action/types'
import { BeagleView } from 'beagle-view'
import { RemoteCache } from 'service/network/remote-cache'
import { DefaultHeaders } from 'service/network/default-headers'
import { URLBuilder } from 'service/network/url-builder'
import { ViewClient } from 'service/network/view-client'
import { GlobalContext } from 'service/global-context'
import { ViewContentManagerMap } from 'service/view-content-manager'
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

export type BeagleService = Readonly<{
  createView: (initialRoute: string) => BeagleView,
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
