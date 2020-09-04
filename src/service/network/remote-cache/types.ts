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

import { HttpMethod } from 'service/network/types'

export interface CacheMetadata {
  'beagleHash': string,
  'requestTime': number,
  'ttl': string,
}

export interface RemoteCache {
  /**
   * Updates the locally stored cache metadata for the pair url/method passed as parameter. If
   * no metadata exists yet, it is created.
   * 
   * @param metadata the updated metadata
   * @param url the url associate to the metadata to
   * @param method the http method to associate the metadata to
   */
  updateMetadata: (metadata: CacheMetadata, url: string, method: HttpMethod) => void,
  /**
   * Gets the stored hash for the given url and http method. Beware, this function is asynchronous,
   * i.e. it returns a promise and not the hash directly.
   * 
   * @param url the url
   * @param method the http method
   * @returns a promise that resolves to the hash
   */
  getHash: (url: string, method: HttpMethod) => Promise<string>,
  /**
   * Gets the cache metadata for the given url and http method. Beware, this function is
   * asynchronous, i.e. it returns a promise and not the cache metadata directly.
   * 
   * @param url the url
   * @param method the http method
   * @returns a promise that resolves to the cache metadata
   */
  getMetadata: (url: string, method: HttpMethod) => Promise<CacheMetadata | null>,
}
