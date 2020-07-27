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

import createBeagleUIView from './BeagleUIView'
import beagleHttpClient from './BeagleHttpClient'
import beagleAnalytics from './BeagleAnalytics'
import urlBuilder from './UrlBuilder'
import { loadFromCache, loadFromServer } from './utils/tree-fetching'
import { checkPrefix } from './utils/tree-manipulation'
import defaultActionHandlers from './actions'
import ComponentMetadata, { ExtractedMetadata } from './ComponentMetadata'
import beagleStorage from './BeagleStorage'
import beagleHeaders from './utils/beagle-headers'
import globalContext from './GlobalContextAPI'
import lazyComponentMiddleware from './legacy/lazyComponent'
import tabViewMiddleware from './legacy/lazyComponent'
import {
  DefaultSchema,
  BeagleConfig,
  BeagleUIElement,
  BeagleUIService,
  LifecycleHookMap,
} from './types'

function getLifecycleHookMap(
  globalLifecycleHooks: BeagleConfig<any>['lifecycles'],
  componentLifecycleHooks: ExtractedMetadata['lifecycles'],
): LifecycleHookMap {
  return {
    beforeStart: {
      components: componentLifecycleHooks.beforeStart,
      global: globalLifecycleHooks && globalLifecycleHooks.beforeStart,
    },
    beforeViewSnapshot: {
      components: {},
      global: globalLifecycleHooks && globalLifecycleHooks.beforeViewSnapshot,
    },
    afterViewSnapshot: {
      components: {},
      global: globalLifecycleHooks && globalLifecycleHooks.afterViewSnapshot,
    },
    beforeRender: {
      components: {},
      global: globalLifecycleHooks && globalLifecycleHooks.beforeRender,
    },
  }
}

function createBeagleUIService<
  Schema = DefaultSchema,
  ConfigType extends BeagleConfig<Schema> = BeagleConfig<Schema>
> (config: ConfigType): BeagleUIService<Schema, ConfigType> {

  // legacy code: remove as soon as legacy middlewares have been transferred somewhere else
  if (!config.middlewares) config.middlewares = []
  config.middlewares.push(lazyComponentMiddleware, tabViewMiddleware)
  // end of legacy code

  checkPrefix(config.components)
  config.customActions && checkPrefix(config.customActions)

  beagleHttpClient.setFetchFunction(config.fetchData || fetch)
  urlBuilder.setBaseUrl(config.baseUrl || '')  
  config.analytics && beagleAnalytics.setAnalytics(config.analytics)

  const actionHandlers = { ...defaultActionHandlers, ...config.customActions }
  const metadata = ComponentMetadata.extract(config.components)
  const lifecycleHooks = getLifecycleHookMap(config.lifecycles, metadata.lifecycles)

  // compatibility mode for middlewares. Remove on v2.0.0
  if (config.middlewares) {
    config.lifecycles = config.lifecycles || {}
    const originalBeforeViewSnapshot = config.lifecycles.beforeViewSnapshot
    config.lifecycles.beforeViewSnapshot = (viewTree) => {
      let result = originalBeforeViewSnapshot ? originalBeforeViewSnapshot(viewTree) : viewTree
      if (!result) result = viewTree 
      config.middlewares!.forEach((middleware) => {
        result = middleware(viewTree as BeagleUIElement<Schema>)
      })
  
      return result
    }
  }
  // end of compatibility mode

  beagleHeaders.setUseBeagleHeaders(config.useBeagleHeaders)
  if (config.customStorage) beagleStorage.setStorage(config.customStorage)

  return {
    loadBeagleUITreeFromServer: loadFromServer,
    loadBeagleUITreeFromCache: loadFromCache,
    createView: (initialRoute: string) => createBeagleUIView<Schema>(
      initialRoute,
      actionHandlers,
      lifecycleHooks,
      metadata.children,
    ),
    getConfig: () => config,
    globalContext,
  }
}

export default createBeagleUIService
