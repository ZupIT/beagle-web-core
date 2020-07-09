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

import { BeagleNetworkError, BeagleCacheError, BeagleExpiredCacheError } from '../errors'
import { BeagleUIElement, Strategy, HttpMethod, ComponentName, BeagleHeaders, BeagleMetadata } from '../types'
import beagleHttpClient from '../BeagleHttpClient'
import { getMetadata, updateMetadata } from './beagle-metadata'

type StrategyType = 'network' | 'cache' | 'cache-ttl' | 'network-beagle'

interface StrategyArrays {
  fetch: Array<StrategyType>,
  fallback: Array<StrategyType>,
}

interface Params<Schema> {
  url: string,
  fallbackUIElement?: BeagleUIElement<Schema>,
  method?: HttpMethod,
  headers?: Record<string, string>,
  strategy?: Strategy,
  loadingComponent?: ComponentName<Schema>,
  errorComponent?: ComponentName<Schema>,
  shouldShowLoading?: boolean,
  shouldShowError?: boolean,
  onChangeTree: (tree: BeagleUIElement<Schema>) => void,
  beagleHeaders: BeagleHeaders,
}

export const namespace = '@beagle-web/cache'

const strategyNameToStrategyArrays: Record<Strategy, StrategyArrays> = {
  'beagle-cache-only': { fetch: ['cache-ttl', 'network-beagle'], fallback: [] },
  'beagle-with-fallback-to-cache': { fetch: ['cache-ttl', 'network-beagle'], fallback: ['cache'] },
  'network-with-fallback-to-cache': { fetch: ['network'], fallback: ['cache'] },
  'cache-with-fallback-to-network': { fetch: ['cache'], fallback: ['network'] },
  'cache-only': { fetch: ['cache'], fallback: [] },
  'network-only': { fetch: ['network'], fallback: [] },
  'cache-first': { fetch: ['cache', 'network'], fallback: [] },
}

/* The following function is async for future compatibility with environments other than web. React
native's localStorage, for instance, always returns promises. */
export async function loadFromCache<Schema>(url: string, method: HttpMethod = 'get') {
  const fromStorage = await localStorage.getItem(`${namespace}/${url}/${method}`)
  const uiTree = fromStorage ? JSON.parse(fromStorage) as BeagleUIElement<Schema> : null
  if (!uiTree) throw new BeagleCacheError(url)
  return uiTree
}

export async function loadFromCacheCheckingTTL(url: string, method: HttpMethod = 'get') {
  const metadata = await getMetadata(url, method)
  const timeInMs = Date.now()
  const isCacheValid = metadata && (timeInMs - +metadata.requestTime) / 1000 < +metadata.ttl
  if (!metadata || !isCacheValid) {
    throw new BeagleExpiredCacheError(url)
  }
  return loadFromCache(url, method)
}

export async function loadFromServer<Schema>(
  url: string,
  beagleHeaders: BeagleHeaders,
  method: HttpMethod = 'get',
  headers?: Record<string, string>,
  shouldSaveCache = true,
  hasBeagleMetadata = true
) {
  let response: Response
  const defaultHeaders = await beagleHeaders.getBeagleHeaders(url, method)
  const requestTime = Date.now()
  try {
    response = await beagleHttpClient.fetch(
      url,
      { method, headers: { ...headers, ...defaultHeaders } }
    )
  } catch (error) {
    throw new BeagleNetworkError(url, error)
  }

  if (response.status < 100 || response.status >= 400) throw new BeagleNetworkError(url, response)

  let uiTree = {} as BeagleUIElement<Schema>
  if (hasBeagleMetadata) {
    const beagleHash = response.headers.get('beagle-hash') || ''
    const cacheControl = response.headers.get('cache-control') || ''
    const maxAge = cacheControl && cacheControl.match(/max-age=(\d+)/)
    const ttl = (maxAge && maxAge[1]) || ''
    const metadata: BeagleMetadata = {
      beagleHash,
      requestTime,
      ttl,
    }
    beagleHash && updateMetadata(metadata, url, method)
    if (response.status === 304) {
      uiTree = await loadFromCache(url, method)
    } else {
      uiTree = await response.json() as BeagleUIElement<Schema>

      if (shouldSaveCache) {
        localStorage.setItem(`${namespace}/${url}/${method}`, JSON.stringify(uiTree))
      }
    }
  } else {
    uiTree = await response.json() as BeagleUIElement<Schema>

    if (shouldSaveCache) {
      localStorage.setItem(`${namespace}/${url}/${method}`, JSON.stringify(uiTree))
    }
  }
  return uiTree
}

export async function load<Schema>({
  url,
  fallbackUIElement,
  beagleHeaders,
  method = 'get',
  headers,
  strategy = 'beagle-with-fallback-to-cache',
  loadingComponent = 'custom:loading',
  errorComponent = 'custom:error',
  shouldShowLoading = true,
  shouldShowError = true,
  onChangeTree,
}: Params<Schema>) {
  async function loadNetwork(hasPreviousSuccess = false, hasBeagleMetadata = true) {
    if (shouldShowLoading && !hasPreviousSuccess) onChangeTree({ _beagleComponent_: loadingComponent })
    onChangeTree(await loadFromServer(url, beagleHeaders, method, headers, strategy !== 'network-only', hasBeagleMetadata))
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
    if (shouldShowError) onChangeTree({ _beagleComponent_: errorComponent })
    throw [...fetchErrors, ...fallbackStrategyErrors]
  }

  await start()
}
