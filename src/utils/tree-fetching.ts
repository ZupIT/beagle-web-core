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

import { BeagleNetworkError, BeagleCacheError } from '../errors'
import { BeagleUIElement, Strategy, HttpMethod, ComponentName } from '../types'
import beagleHttpClient from '../BeagleHttpClient'

type StrategyType = 'network' | 'cache'

interface StrategyArrays {
  fetch: Array<StrategyType>,
  fallback: Array<StrategyType>,
}

interface Params<Schema> {
  url: string,
  method?: HttpMethod,
  headers?: Record<string, string>,
  strategy?: Strategy,
  loadingComponent?: ComponentName<Schema>,
  errorComponent?: ComponentName<Schema>,
  shouldShowLoading?: boolean,
  shouldShowError?: boolean,
  onChangeTree: (tree: BeagleUIElement<Schema>) => void,
}

export const namespace = '@beagle-web/cache'

const strategyNameToStrategyArrays: Record<Strategy, StrategyArrays> = {
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

export async function loadFromServer<Schema>(
  url: string,
  method: HttpMethod = 'get',
  headers?: Record<string, string>,
  shouldSaveCache = true,
) {
  let response: Response

  try {
    response = await beagleHttpClient.fetch(url, { method, headers: headers && headers })
  } catch (error) {
    throw new BeagleNetworkError(url, error)
  }

  if (response.status < 100 || response.status >= 400) throw new BeagleNetworkError(url, response)
  const uiTree = await response.json() as BeagleUIElement<Schema>

  if (shouldSaveCache) {
    localStorage.setItem(`${namespace}/${url}/${method}`, JSON.stringify(uiTree))
  }

  return uiTree
}

export async function load<Schema>({
  url,
  method = 'get',
  headers,
  strategy = 'network-with-fallback-to-cache',
  loadingComponent = 'loading',
  errorComponent = 'error',
  shouldShowLoading = true,
  shouldShowError = true,
  onChangeTree,
}: Params<Schema>) {
  async function loadNetwork(hasPreviousSuccess = false) {
    if (shouldShowLoading && !hasPreviousSuccess) onChangeTree({ _beagleType_: loadingComponent })
    onChangeTree(await loadFromServer(url, method, headers, strategy !== 'network-only'))
  }

  async function loadCache() {
    onChangeTree(await loadFromCache(url, method))
  }

  async function runStrategies(
    strategies: Array<StrategyType>,
    stopOnSuccess: boolean,
  ): Promise<[boolean, Array<Error>]> {
    const errors: Array<Error> = []
    let hasSuccess = false
  
    for (let i = 0; i < strategies.length; i++) {
      try {
        await (strategies[i] === 'network' ? loadNetwork(hasSuccess) : loadCache())
        hasSuccess = true
        if (stopOnSuccess) return [hasSuccess, errors]
      } catch (error) {
        errors.push(error)
      }
    }

    return [hasSuccess, errors]
  }

  async function start() {
    const { fetch, fallback } = strategyNameToStrategyArrays[strategy]
    const [hasFetchSuccess, fetchErrors] = await runStrategies(fetch, false)
    if (hasFetchSuccess) return
    const [hasFallbackSuccess, fallbackErrors] = await runStrategies(fallback, true)
    if (hasFallbackSuccess) return
    if (shouldShowError) onChangeTree({ _beagleType_: errorComponent })
    throw [...fetchErrors, ...fallbackErrors]
  }

  await start()
}
