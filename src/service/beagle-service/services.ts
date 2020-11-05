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

import { HttpClient } from 'service/network/types'
import RemoteCache from 'service/network/remote-cache'
import DefaultHeaders from 'service/network/default-headers'
import URLBuilder from 'service/network/url-builder'
import ViewClient from 'service/network/view-client'
import PreFetchService from 'service/network/pre-fetch'
import GlobalContext from 'service/global-context'
import ViewContentManagerMap from 'service/view-content-manager'
import { BeagleConfig } from './types'

export function createServices(config: BeagleConfig<any>) {
  const httpClient: HttpClient = {
    fetch: (...args) => (config.fetchData ? config.fetchData(...args) : fetch(...args)),
  }
  const storage = config.customStorage || localStorage
  const urlBuilder = URLBuilder.create(config.baseUrl)
  const analytics = config.analytics
  const remoteCache = RemoteCache.create(storage)
  const defaultHeaders = DefaultHeaders.create(remoteCache, config.useBeagleHeaders)
  const viewClient = ViewClient.create(
    storage,
    defaultHeaders,
    remoteCache,
    httpClient,
    config.strategy,
  )
  const preFetchService = PreFetchService.create(viewClient)
  const globalContext = GlobalContext.create()
  const viewContentManagerMap = ViewContentManagerMap.create()

  return {
    storage,
    httpClient,
    urlBuilder,
    analytics,
    remoteCache,
    viewClient,
    defaultHeaders,
    preFetchService,
    globalContext,
    viewContentManagerMap,
  }
}
