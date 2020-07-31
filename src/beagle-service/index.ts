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

import mapKeys from 'lodash/mapKeys'
import createView from '../view'
import { checkPrefix } from '../utils/tree-manipulation'
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
} from '../types'

import RemoteCacheService from '../network/remote-cache'
import URLService from '../network/url'
import ViewClientService from '../network/view-client'
import BeagleView from '../view'
import GlobalContextService from './global-context'
import TreeContentService from './tree-content'

function checkPrefix(items: Record<string, any>) {
  mapKeys(items, (value, key: string) => {
    if (!key.startsWith('custom:') && !key.startsWith('beagle:')) {
      throw new Error(`Please check your config. The ${key} is not a valid name. Yours components or actions
      should always start with "beagle:" if it\'s overwriting a default component or an action, "custom:"
      if it\'s a custom component or an action`)
    }
  })
}

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

function createServices(config: BeagleConfig<any>) {
  const storage = config.customStorage || localStorage
  const httpClient = { fetch: config.fetchData || fetch }
  const url = URLService.create(config.baseUrl)
  const analytics = config.analytics
  const remoteCache = RemoteCacheService.create(storage, config.useBeagleHeaders)
  const globalContext = GlobalContextService.create()
  const treeContent = TreeContentService.create()

  return { storage, httpClient, url, analytics, remoteCache, globalContext, treeContent }
}

function processConfiguration(config: BeagleConfig<any>) {
  const actionHandlers = { ...defaultActionHandlers, ...config.customActions }
  const componentMetadata = ComponentMetadata.extract(config.components)
  const lifecycleHooks = getLifecycleHookMap(config.lifecycles, componentMetadata.lifecycles)

  return { actionHandlers, componentMetadata, lifecycleHooks }
}

function createBeagleUIService<
  Schema = DefaultSchema,
  ConfigType extends BeagleConfig<Schema> = BeagleConfig<Schema>
> (config: ConfigType): BeagleUIService<Schema, ConfigType> {
  checkConfiguration(config)
  const services = createServices(config)
  const processedConfig = processConfiguration(config)
  
  const beagle = {
    ...services,
    ...processedConfig,
    createView: (initialRoute: string) => BeagleView.create<Schema>(initialRoute, beagle),
    getConfig: () => config,
  }
}

export default createBeagleUIService
