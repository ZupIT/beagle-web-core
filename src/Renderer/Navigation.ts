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

import { BeagleUIElement } from '../types'
import { loadFromServer } from '../utils/tree-fetching'
import NavigationActions from '../actions/navigation'
import { addPrefix } from '../utils/string'
import urlBuilder from '../UrlBuilder'

function preFetchViews(component: BeagleUIElement) {
  const keys = Object.keys(component)

  keys.forEach((key) => {
    if (!component[key]) return
    const isNavigationAction = NavigationActions[component[key]._beagleAction_]
    const shouldPrefetch = component[key].route && component[key].route.shouldPrefetch
    if (isNavigationAction && shouldPrefetch) {
      const path = addPrefix(component[key].route.url, '/')
      const url = urlBuilder.build(path)
      loadFromServer(url)
    }
  })
}

export default {
  preFetchViews,
}
