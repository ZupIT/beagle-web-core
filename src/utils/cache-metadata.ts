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

import { HttpMethod, CacheMetadata } from '../types'
import beagleStorage from '../BeagleStorage'

export const beagleCacheNamespace = '@beagle-web/beagle-cache'

export async function getCacheMetadata(url: string, method: HttpMethod) {
  const cacheMetadataFromStorage = await beagleStorage.getStorage().getItem(`${beagleCacheNamespace}/${url}/${method}`)  
  return cacheMetadataFromStorage ? JSON.parse(cacheMetadataFromStorage) as CacheMetadata : null
}

export async function getCacheHash(url: string, method: HttpMethod) {
  const cacheMetadataFromStorage =  await getCacheMetadata(url, method)
  return cacheMetadataFromStorage ? cacheMetadataFromStorage.beagleHash : ''
}

export function updateCacheMetadata(metadata: CacheMetadata, url: string, method: HttpMethod) {
  beagleStorage.getStorage().setItem(`${beagleCacheNamespace}/${url}/${method}`, JSON.stringify(metadata))
}
