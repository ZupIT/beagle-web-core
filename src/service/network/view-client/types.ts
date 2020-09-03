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

export type Strategy = (
  'beagle-cache-only'
  | 'beagle-with-fallback-to-cache'
  | 'network-with-fallback-to-cache'
  | 'cache-with-fallback-to-network'
  | 'cache-only'
  | 'network-only'
  | 'cache-first'
)

export interface StrategyArrays {
  fetch: Array<StrategyType>,
  fallback: Array<StrategyType>,
}

export interface ViewClientLoadParams {
  /**
   * The url to fetch the view
   */
  url: string,
  /**
   * Tree to fallback to in case of error
   */
  fallbackUIElement?: BeagleUIElement,
  /**
   * The http method to call the `url` with. Default is get.
   */
  method?: HttpMethod,
  /**
   * Additional headers to send with the request
   */
  headers?: Record<string, string>,
  /**
   * The cache strategy to use. Default is the base config.
   */
  strategy?: Strategy,
  /**
   * The loading component to use. Default is the base config.
   */
  loadingComponent?: string,
  /**
   * The error component to use. Default is the base config.
   */
  errorComponent?: string,
  /**
   * Wether to show the loading feedback or not. Default is true.
   */
  shouldShowLoading?: boolean,
  /**
   * Wether to show the loading feedback or not. Default is true.
   */
  shouldShowError?: boolean,
  /**
   * Function to be called every time the tree changes during the process.
   */
  onChangeTree: (tree: BeagleUIElement) => void,
  /**
   * Function to call if we want to retry the process.
   */
  retry: () => void,
}

export interface ViewClient {
  /**
   * Load a view according to the options passed as parameter. This function controls the cache
   * and makes the actual request only when necessary.
   * 
   * @param options the options for the request and its feedback
   * @return a promise that resolves when the request or cache recovery finishes. The promise is
   * rejected on errors.
   */
  load: (options: ViewClientLoadParams) => Promise<void>,
  /**
   * Local cache. Recovers the last view stored in the cache corresponding to the given url and http
   * method. This is the cache defined by the local configurations and not by the Beagle backend.
   * 
   * @param url the url to retrieve the cache for
   * @param method optional. The http method of the url. Default is get.
   * @returns a promise that resolves to the cache result. The promise is rejected if no cache is
   * available.
   */
  loadFromCache: (url: string, method?: HttpMethod) => Promise<BeagleUIElement>,
  /**
   * Remote cache. Recovers the last view stored in the cache corresponding to the given url and
   * http method. This is the cache defined by the Beagle backend and not by the local
   * configurations.
   * 
   * @param url the url to retrieve the cache for
   * @param method optional. The http method of the url. Default is get.
   * @returns a promise that resolves to the cache result. The promise is rejected if no cache is
   * available.
   */
  loadFromCacheCheckingTTL: (url: string, method?: HttpMethod) => Promise<BeagleUIElement>,
  /**
   * Makes a request and load the view from the backend, ignoring existent caches. The result may
   * be saved to the cache, this is decided according to the parameter `shouldSaveCache`.
   * 
   * @param url the url to load the view from
   * @param method optional. The http method to call the url with. Default is get.
   * @param headers optional. Additional headers to send with the request.
   * @param shouldSaveCache optional. Wether or not to save the response to the local cache. Default
   * is true.
   * @param useBeagleCacheProtocol optional. Wether or not to consider the cache defined by the
   * Beagle backend when saving the response. Default is true.
   */
  loadFromServer: (
    url: string,
    method?: HttpMethod,
    headers?: Record<string, string>,
    shouldSaveCache?: boolean,
    useBeagleCacheProtocol?: boolean,
  ) => Promise<BeagleUIElement>,
}
