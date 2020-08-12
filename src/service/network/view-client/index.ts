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

import BeagleCacheError from 'error/BeagleCacheError'
import BeagleNetworkError from 'error/BeagleNetworkError'
import BeagleExpiredCacheError from 'error/BeagleExpiredCacheError'
import { BeagleUIElement, ErrorComponentParams } from 'beagle-tree/types'
import { HttpMethod, HttpClient } from 'service/network/types'
import { RemoteCache, CacheMetadata } from 'service/network/remote-cache/types'
import { DefaultHeaders } from 'service/network/default-headers/types'
import { ViewClient, Strategy, StrategyType, StrategyArrays, ViewClientLoadParams } from './types'

export const namespace = '@beagle-web/cache'

const DEFAULT_STRATEGY: Strategy = 'beagle-with-fallback-to-cache'

const strategyNameToStrategyArrays: Record<Strategy, StrategyArrays> = {
  'beagle-cache-only': { fetch: ['cache-ttl', 'network-beagle'], fallback: [] },
  'beagle-with-fallback-to-cache': { fetch: ['cache-ttl', 'network-beagle'], fallback: ['cache'] },
  'network-with-fallback-to-cache': { fetch: ['network'], fallback: ['cache'] },
  'cache-with-fallback-to-network': { fetch: ['cache'], fallback: ['network'] },
  'cache-only': { fetch: ['cache'], fallback: [] },
  'network-only': { fetch: ['network'], fallback: [] },
  'cache-first': { fetch: ['cache', 'network'], fallback: [] },
}

function createViewClient(
  storage: Storage,
  defaultHeadersService: DefaultHeaders,
  remoteCache: RemoteCache,
  httpClient: HttpClient,
  globalStrategy = DEFAULT_STRATEGY,
): ViewClient {
  /* The following function is async for future compatibility with environments other than web. React
  native's localStorage, for instance, always returns promises. */
  async function loadFromCache(url: string, method: HttpMethod = 'get') {
    const fromStorage = await storage.getItem(`${namespace}/${url}/${method}`)
    const uiTree = fromStorage ? JSON.parse(fromStorage) as BeagleUIElement : null
    if (!uiTree) throw new BeagleCacheError(url)
    return uiTree
  }

  async function loadFromCacheCheckingTTL(url: string, method: HttpMethod = 'get') {
    const metadata = await remoteCache.getMetadata(url, method)
    const timeInMs = Date.now()
    const isCacheValid = (
      metadata
      && (timeInMs - metadata.requestTime) / 1000 < parseInt(metadata.ttl)
    )
    if (!metadata || !isCacheValid) {
      throw new BeagleExpiredCacheError(url)
    }
    return loadFromCache(url, method)
  }

  function updateCacheMetadataFromResponse(
    response: Response,
    requestTime: number,
    url: string,
    method: HttpMethod
  ) {
    const beagleHash = response.headers.get('beagle-hash') || ''
    const cacheControl = response.headers.get('cache-control') || ''
    const maxAge = cacheControl && cacheControl.match(/max-age=(\d+)/)
    const ttl = (maxAge && maxAge[1]) || ''
    const metadata: CacheMetadata = {
      beagleHash,
      requestTime,
      ttl,
    }
    remoteCache.updateMetadata(metadata, url, method)
  }

  async function getUITreeCacheProtocol(
    response: Response,
    url: string,
    method: HttpMethod,
    shouldSaveCache: boolean,
  ) {
    let uiTree = {} as BeagleUIElement
    if (response.status === 304) {
      uiTree = await loadFromCache(url, method)
    } else {
      uiTree = await response.json() as BeagleUIElement
      if (shouldSaveCache) {
        storage.setItem(`${namespace}/${url}/${method}`, JSON.stringify(uiTree))
      }
    }
    return uiTree
  }

  async function loadFromServer(
    url: string,
    method: HttpMethod = 'get',
    headers?: Record<string, string>,
    shouldSaveCache = true,
    useBeagleCacheProtocol = true,
  ) {
    let response: Response
    const requestTime = Date.now()
    try {
      response = await httpClient.fetch(
        url,
        { method, headers }
      )
    } catch (error) {
      throw new BeagleNetworkError(url, error)
    }

    if (response.status < 100 || response.status >= 400) throw new BeagleNetworkError(url, response)

    let uiTree = {} as BeagleUIElement
    if (useBeagleCacheProtocol) {
      updateCacheMetadataFromResponse(response, requestTime, url, method)
      uiTree = await getUITreeCacheProtocol(response, url, method, shouldSaveCache)
    } else {
      uiTree = await response.json() as BeagleUIElement

      if (shouldSaveCache) {
        storage.setItem(`${namespace}/${url}/${method}`, JSON.stringify(uiTree))
      }
    }
    return uiTree
  }

  async function load({
    url,
    fallbackUIElement,
    method = 'get',
    headers,
    strategy = globalStrategy,
    loadingComponent = 'custom:loading',
    errorComponent = 'custom:error',
    shouldShowLoading = true,
    shouldShowError = true,
    onChangeTree,
    retry,
  }: ViewClientLoadParams) {
    async function loadNetwork(hasPreviousSuccess = false, useBeagleCacheProtocol = true) {
      if (shouldShowLoading && !hasPreviousSuccess) {
        onChangeTree({ _beagleComponent_: loadingComponent })
      }
      const defaultHeaders = await defaultHeadersService.get(url, method)
      const requestHeaders = { ...headers, ...defaultHeaders }
      const tree = await loadFromServer(
        url,
        method,
        requestHeaders,
        strategy !== 'network-only',
        useBeagleCacheProtocol,
      )
      onChangeTree(tree)
    }

    async function loadCache() {
      onChangeTree(await loadFromCache(url, method))
    }

    async function loadCacheTTL() {
      onChangeTree(await loadFromCacheCheckingTTL(url, method))
    }

    async function runStrategies(
      strategies: Array<StrategyType>,
      stopOnSuccess: boolean,
    ): Promise<[boolean, Array<Error>]> {
      const errors: Array<Error> = []
      let hasSuccess = false
      let isBeagleCache = false

      for (let i = 0; i < strategies.length; i++) {
        try {
          if (strategies[i] === 'network') await loadNetwork(hasSuccess, false)
          else if (strategies[i] === 'network-beagle') {
            await loadNetwork(hasSuccess, true)
            isBeagleCache = true
          }
          else if (strategies[i] === 'cache-ttl') {
            await loadCacheTTL()
            isBeagleCache = true
          }
          else await loadCache()
          hasSuccess = true
          if (stopOnSuccess || isBeagleCache) return [hasSuccess, errors]
        } catch (error) {
          errors.push(error)
        }
      }

      return [hasSuccess, errors]
    }

    async function start() {
      const { fetch, fallback: fallbackStrategy } = strategyNameToStrategyArrays[strategy]
      const [hasFetchSuccess, fetchErrors] = await runStrategies(fetch, false)
      if (hasFetchSuccess) return
      if (fallbackUIElement) return onChangeTree(fallbackUIElement)
      const [hasFallbackStrategySuccess, fallbackStrategyErrors] = await runStrategies(fallbackStrategy, true)
      if (hasFallbackStrategySuccess) return
      const errors = [...fetchErrors, ...fallbackStrategyErrors]
      if (shouldShowError) {
        const errorUITree: BeagleUIElement & ErrorComponentParams = {
          _beagleComponent_: errorComponent,
          retry,
          errors: errors.map(e => e.message),
        }
        onChangeTree(errorUITree)
      }
      throw errors
    }

    await start()
  }

  return {
    load,
    loadFromCache,
    loadFromCacheCheckingTTL,
    loadFromServer,
  }
}

export default {
  create: createViewClient,
}
