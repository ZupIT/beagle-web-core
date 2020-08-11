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

import { BeagleUIElement } from 'beagle-tree/types'
import { HttpMethod } from 'service/network/types'

export type StrategyType = 'network' | 'cache' | 'cache-ttl' | 'network-beagle'

export interface StrategyArrays {
  fetch: Array<StrategyType>,
  fallback: Array<StrategyType>,
}

export interface ViewClientLoadParams {
  url: string,
  fallbackUIElement?: BeagleUIElement,
  method?: HttpMethod,
  headers?: Record<string, string>,
  strategy?: Strategy,
  loadingComponent?: string,
  errorComponent?: string,
  shouldShowLoading?: boolean,
  shouldShowError?: boolean,
  onChangeTree: (tree: BeagleUIElement) => void,
  retry: () => void,
}

export type Strategy = (
  'beagle-cache-only'
  | 'beagle-with-fallback-to-cache'
  | 'network-with-fallback-to-cache'
  | 'cache-with-fallback-to-network'
  | 'cache-only'
  | 'network-only'
  | 'cache-first'
)

export interface ViewClient {
  load: (params: ViewClientLoadParams) => Promise<void>,
  loadFromCache: (url: string, method?: HttpMethod) => Promise<BeagleUIElement>,
  loadFromCacheCheckingTTL: (url: string, method?: HttpMethod) => Promise<BeagleUIElement>,
  loadFromServer: (
    url: string,
    method?: HttpMethod,
    headers?: Record<string, string>,
    shouldSaveCache?: boolean,
    useBeagleCacheProtocol?: boolean,
  ) => Promise<BeagleUIElement>,
}
