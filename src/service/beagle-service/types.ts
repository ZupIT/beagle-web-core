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

import { IdentifiableBeagleUIElement, ComponentName } from 'beagle-tree/types'
import { ActionHandler } from 'action/types'
import { NavigationController } from 'beagle-navigator/types'
import { URLBuilder } from 'service/network/url-builder/types'
import { ViewClient } from 'service/network/view-client/types'
import { GlobalContext } from 'service/global-context/types'
import { ViewContentManagerMap } from 'service/view-content-manager/types'
import { ChildrenMetadataMap } from 'metadata/types'
import { HttpClient } from 'service/network/types'
import { AnalyticsProvider, AnalyticsService } from 'service/analytics/types'

export type Lifecycle = 'beforeStart' | 'beforeViewSnapshot' | 'afterViewSnapshot' | 'beforeRender'

export type ExecutionMode = 'development' | 'production'

export type LifecycleHook<T = any> = (viewTree: T) => void | T

export type LifecycleHookMap = Record<Lifecycle, {
  global?: (tree: any) => any,
  components: Record<string, LifecycleHook>,
}>

export type Operation = ((...args: any[]) => any)

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
   * Custom function to make HTTP requests. You can use this to implement your own HTTP client,
   * calculating your own headers, cookies, response transformation, etc. The function provided here
   * must implement the same interface as the default fetch function of the browser. By default, the
   * browser's fetch function will be used.
   */
  fetchData?: typeof fetch,
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
  lifecycles?: {
    beforeStart?: LifecycleHook,
    beforeViewSnapshot?: LifecycleHook<IdentifiableBeagleUIElement>,
    afterViewSnapshot?: LifecycleHook<IdentifiableBeagleUIElement>,
    beforeRender?: LifecycleHook<IdentifiableBeagleUIElement>,
  },
  /**
   * Sets the default navigation controller. If not set, The DefaultNavigationController is used.
   *
   * The Navigation Controller is responsible for handling the events loading, error and success
   * of a navigator.
   */
  defaultNavigationController?: NavigationController,
  /**
   * Additional navigation controllers for customizing sections of the application. Every navigation
   * that changes the current stack can have its own navigation controller.
   */
  navigationControllers?: Record<string, NavigationController>,
  /**
   * Accepts a custom API that implements the provided interface `AnalyticsProvider` to handle the event tracking through the application.
   * If not analytics provider is registered, no analytics will be generated
   */
  analyticsProvider?: AnalyticsProvider,
  /**
   * the platform in which the project is currently running
   */
  platform?: string,
  /**
   * The map of custom operations that can be used to extend the capability of the Beagle expressions and are called like functions,
   * e.g. `@{sum(1, 2)}`.
   * The keys of this object represent the operation name and the values must be the functions themselves.
   * An operation name must contain only letters, numbers and the character _,
   * it also must contain at least one letter or _.
   * Note: If you create custom operations using the same name of a default from Beagle, the default will be overwritten by the custom one
   */
  customOperations?: Record<string, Operation>,
  /**
   * Disables the default style conversion to CSS in a Beagle tree.
   */
  disableCssTransformation?: boolean,
  viewClient?: ViewClient,
}

export type BeagleService = Readonly<{
  getConfig: () => BeagleConfig<any>,
  // processed configuration
  actionHandlers: Record<string, ActionHandler>,
  lifecycleHooks: LifecycleHookMap,
  childrenMetadata: ChildrenMetadataMap,
  operationHandlers: Record<string, Operation>,
  // services
  httpClient: HttpClient,
  urlBuilder: URLBuilder,
  viewClient: ViewClient,
  globalContext: GlobalContext,
  viewContentManagerMap: ViewContentManagerMap,
  analyticsService: AnalyticsService,
}>
