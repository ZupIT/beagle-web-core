/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import { HttpAdditionalData, RemoteView } from 'beagle-navigator/types'
import { BeagleUIElement } from 'beagle-tree/types'
import { HttpClient } from '../types'
import { URLBuilder } from '../url-builder/types'
import { findNavigationActions, validateUrl } from './utils'
import { ViewClient } from './types'

const preFetched = new Map()

async function preFetchViews(
  component: BeagleUIElement,
  urlBuilder: URLBuilder,
) {
  component.children?.forEach(async (item: BeagleUIElement) => {
    const navigationActions = findNavigationActions(item, false)
    navigationActions.forEach(async (action: any) => {
      const shouldPrefetch = action.route && action.route.shouldPrefetch
      const isUrlValid = action.route && validateUrl(action.route.url)
      if (shouldPrefetch && isUrlValid) {
        const url = urlBuilder.build(action.route.url)
        const response = await fetch(url, action.route.httpAdditionalData)
        preFetched.set(action.route.url, await response.json())
      }
    })
  })
}

function createViewClient(httpClient: HttpClient, urlBuilder: URLBuilder, platform?: string): ViewClient {

  async function fetchView(route: RemoteView): Promise<BeagleUIElement> {
    const url = urlBuilder.build(route.url)
    const additionalData: HttpAdditionalData | undefined = platform ? {
      ...route.httpAdditionalData,
      headers: { ...route.httpAdditionalData?.headers, 'beagle-platform': platform },
    } : route.httpAdditionalData
    const response = await httpClient.fetch(url, additionalData)

    if (response.ok) return await response.json()

    if (route.fallback) return route.fallback
    throw new Error(`${response.status}: ${response.statusText}`)
  }
  return {
    fetch: async (route) => {
      const view = preFetched.get(route.url) || await fetchView(route)
      preFetched.delete(route.url)
      preFetchViews(view, urlBuilder)
      return view
    },
  }
}

export default {
  preFetchViews,
  create: createViewClient,
}
