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

import { RemoteView } from 'beagle-navigator/types'
import { BeagleUIElement } from 'beagle-tree/types'
import logger from 'logger'
import { HttpClient } from '../types'
import { URLBuilder } from '../url-builder/types'
import { ViewClient } from './types'

function createViewClient(httpClient: HttpClient, urlBuilder: URLBuilder): ViewClient {
  const preFetched: Record<string, BeagleUIElement> = {}

  async function fetchView(route: RemoteView): Promise<BeagleUIElement> {
    const url = urlBuilder.build(route.url)
    const response = await httpClient.fetch(url, route.httpAdditionalData)

    if (response.ok) return await response.json()
    if (route.fallback) return route.fallback
    throw new Error(`${response.status}: ${response.statusText}`)
  }

  return {
    prefetch: async (route) => {
      try {
        preFetched[route.url] = await fetchView(route)
      } catch (error) {
        logger.error(`Error while pre-fetching view: ${route.url}`, error)
      }
    },
    fetch: async (route) => {
      if (preFetched[route.url]) {
        const result = preFetched[route.url]
        delete preFetched[route.url]
        return result
      }
      return await fetchView(route)
    },
  }
}

export default {
  create: createViewClient,
}
