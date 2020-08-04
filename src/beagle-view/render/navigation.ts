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
import NavigationActions from 'action/navigation'
import StringUtils from 'utils/string'
import { URLBuilder } from 'service/network/url-builder'
import { ViewClient } from 'service/network/view-client'

function preFetchViews(component: BeagleUIElement, urlBuilder: URLBuilder, viewClient: ViewClient) {
  const keys = Object.keys(component)

  keys.forEach((key) => {
    if (!component[key]) return
    const isNavigationAction = NavigationActions[component[key]._beagleAction_]
    const shouldPrefetch = component[key].route && component[key].route.shouldPrefetch
    if (isNavigationAction && shouldPrefetch) {
      const path = StringUtils.addPrefix(component[key].route.url, '/')
      const url = urlBuilder.build(path)
      viewClient.loadFromServer(url)
    }
  })
}

export default {
  preFetchViews,
}
