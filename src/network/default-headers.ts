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

import { RemoteCache } from './remote-cache'
import { HttpMethod, BeagleDefaultHeaders } from './types'

const defaultHeaders: BeagleDefaultHeaders = { 'beagle-platform': 'WEB' }

function createDefaultHeaders(remoteCache: RemoteCache, useDefaultHeaders = true) {
  async function get(url: string, method: HttpMethod) {
    if (!useDefaultHeaders) return {}
    else {
      const hash = await remoteCache.getHash(url, method)
      let requestHeaders = { ...defaultHeaders }
      if (hash) {
        requestHeaders = { ...defaultHeaders, 'beagle-hash': hash }
      }
      return requestHeaders
    }
  }

  return {
    get,
  }
}

export default {
  create: createDefaultHeaders,
}

export type DefaultHeaders = ReturnType<typeof createDefaultHeaders>
