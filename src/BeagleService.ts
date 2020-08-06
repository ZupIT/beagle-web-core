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
import beagleLogger from './BeagleLogger'

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
      components: componentLifecycleHooks.beforeViewSnapshot,
      global: globalLifecycleHooks && globalLifecycleHooks.beforeViewSnapshot,
    },
    afterViewSnapshot: {
      components: componentLifecycleHooks.afterViewSnapshot,
      global: globalLifecycleHooks && globalLifecycleHooks.afterViewSnapshot,
    },
    beforeRender: {
      components: componentLifecycleHooks.beforeRender,
      global: globalLifecycleHooks && globalLifecycleHooks.beforeRender,
    },
  }
}

function updateMiddlewaresInConfiguration(config: BeagleConfig<any>) {
  if (config.middlewares) {
    config.lifecycles = config.lifecycles || {}
    const originalBeforeViewSnapshot = config.lifecycles.beforeViewSnapshot
    config.lifecycles.beforeViewSnapshot = (viewTree) => {
      let result = originalBeforeViewSnapshot ? originalBeforeViewSnapshot(viewTree) : viewTree
      if (!result) result = viewTree
      config.middlewares!.forEach((middleware) => {
        result = middleware(viewTree as BeagleUIElement<any>)
      })

      return result
    }
  }
}

function checkConfiguration(config: BeagleConfig<any>) {
  checkPrefix(config.components)
  config.customActions && checkPrefix(config.customActions)

  // todo: legacy code, remove as soon as legacy middlewares have been transferred somewhere else
  if (!config.middlewares) config.middlewares = []
  config.middlewares.push(lazyComponentMiddleware, tabViewMiddleware)
  // end of legacy code

  // todo: remove with version 2.0
  updateMiddlewaresInConfiguration(config)
}

function initializeLogger(config: BeagleConfig<any>) {
  console.log('ABCDEFGHIJ')
  if (config.log && !config.log.debug) {
    config.log = { ...config.log, debug: ['error', 'warn'] }
  }
  beagleLogger.setConfig(config.log || { mode: 'development', debug: ['error', 'warn'] })
}

function initializeServices(config: BeagleConfig<any>) {
  beagleHttpClient.setFetchFunction(config.fetchData || fetch)
  urlBuilder.setBaseUrl(config.baseUrl || '')
  config.analytics && beagleAnalytics.setAnalytics(config.analytics)
  beagleHeaders.setUseBeagleHeaders(config.useBeagleHeaders)
  if (config.customStorage) beagleStorage.setStorage(config.customStorage)
}

function processConfiguration(config: BeagleConfig<any>) {
  const actionHandlers = { ...defaultActionHandlers, ...config.customActions }
  const metadata = ComponentMetadata.extract(config.components)
  const lifecycleHooks = getLifecycleHookMap(config.lifecycles, metadata.lifecycles)

  return { actionHandlers, metadata, lifecycleHooks }
}

function createBeagleUIService<
  Schema = DefaultSchema,
  ConfigType extends BeagleConfig<Schema> = BeagleConfig<Schema>
>(config: ConfigType): BeagleUIService<Schema, ConfigType> {
  checkConfiguration(config)
  initializeServices(config)
  initializeLogger(config)
  const { actionHandlers, metadata, lifecycleHooks } = processConfiguration(config)

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
