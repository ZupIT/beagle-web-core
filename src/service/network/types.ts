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

export type HttpMethod = (
  'post' | 'get' | 'put' | 'delete' | 'patch' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
)

export type Strategy = (
  'beagle-cache-only'
  | 'beagle-with-fallback-to-cache'
  | 'network-with-fallback-to-cache'
  | 'cache-with-fallback-to-network'
  | 'cache-only'
  | 'network-only'
  | 'cache-first'
)

export interface HttpClient {
  fetch: typeof fetch,
}

export interface BeagleHeaders {
  setUseBeagleHeaders: (useDefaultBeagleHeaders?: boolean) => void,
  getBeagleHeaders: (url: string, method: HttpMethod) => Promise<{} | BeagleDefaultHeaders>,
}

export interface CacheMetadata {
  'beagleHash': string,
  'requestTime': number,
  'ttl': string,
}

export type ConfigCacheMetadata = Record<string, CacheMetadata>

export interface BeagleDefaultHeaders {
  'beagle-platform': 'WEB',
  'beagle-hash'?: string,
}

export interface LoadParams {
  path: string,
  fallback?: BeagleUIElement,
  method?: HttpMethod,
  headers?: Record<string, string>,
  shouldShowLoading?: boolean,
  shouldShowError?: boolean,
  strategy?: Strategy,
  loadingComponent?: string,
  errorComponent?: string,
}
