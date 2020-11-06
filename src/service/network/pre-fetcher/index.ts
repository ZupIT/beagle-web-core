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
import BeagleError from 'error/BeagleError'
import { ViewClient } from '../view-client/types'
import { PreFetcher } from './types'

function createPreFetcher(viewClient: ViewClient): PreFetcher {
  const views: Record<string, Promise<BeagleUIElement>> = {}

  async function fetch(url: string) {
    const error = new BeagleError(`Failed to pre-fetch view ${url}.`)

    views[url] = new Promise<BeagleUIElement>(async (resolve, reject) => {
      let view: BeagleUIElement | null = null
      try {
        await viewClient.load({
          onChangeTree: (v: BeagleUIElement) => view = v,
          url,
          retry: () => {},
        })
        if (view) resolve(view)
        else reject(error)
      } catch (errors) {
        reject(error)
      }
    })

    await views[url]
  }

  function recover(url: string) {
    return views[url] || Promise.reject(new BeagleError(`The view "${url}" is not pre-fetched.`))
  }

  return {
    fetch,
    recover,
  }
}

export default {
  create: createPreFetcher,
}
