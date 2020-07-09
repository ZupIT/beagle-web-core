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

import { beagleCacheNamespace, HttpMethod, BeagleMetadata } from '../types'

export async function getMetadata(url: string, method: HttpMethod) {
  const metadataFromStorage = await localStorage.getItem(`${beagleCacheNamespace}/${url}/${method}`)  
  return metadataFromStorage ? JSON.parse(metadataFromStorage) as BeagleMetadata : null
}

export async function getHash(url: string, method: HttpMethod) {
  const metadataFromStorage =  await getMetadata(url, method)
  return metadataFromStorage ? metadataFromStorage.beagleHash : ''
}

export function updateMetadata(metadata: BeagleMetadata, url: string, method: HttpMethod) {
  localStorage.setItem(`${beagleCacheNamespace}/${url}/${method}`, JSON.stringify(metadata))
}
