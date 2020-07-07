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

import { beagleCacheNamespace, HttpMethod, BeagleMetadata, BeagleConfigMetadata } from '../types'

function handleBeagleMetadata() {
  const beagleMetadata = {} as BeagleConfigMetadata

  return {
    getMetadata: (url: string, method: HttpMethod) => beagleMetadata[`${url}/${method}`],
    getHash: (url: string, method: HttpMethod) => {
      const metadata = beagleMetadata[`${url}/${method}`]
      return metadata ? metadata.beagleHash : ''
    },
    updateMetadata: (metadata: BeagleMetadata, url: string, method: HttpMethod) => {
      beagleMetadata[`${url}/${method}`] = metadata
      // localStorage.setItem(`${beagleCacheNamespace}/${url}/${method}`, JSON.stringify(metadata))
    },
  }
}

const beagleMetadata = handleBeagleMetadata()

export default beagleMetadata
