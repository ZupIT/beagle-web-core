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

import { BeagleUIElement, URLBuilder, BeagleHeaders } from '../types'
import { loadFromServer } from '../utils/tree-fetching'
import NavigationActions from '../actions/navigation'
import { addPrefix } from '../utils/string'

const createShouldPrefetchMiddleware = (urlFormatter: URLBuilder, beagleHeaders: BeagleHeaders) => {

  const beagleShouldPrefetch = (uiTree: BeagleUIElement<any>) => {
    const keys = Object.keys(uiTree)

    keys.forEach(key => {
      const isNavigationAction = uiTree[key] && NavigationActions[uiTree[key]._beagleAction_]
      const shouldPrefetch = uiTree[key].route && uiTree[key].route.shouldPrefetch
      if (isNavigationAction && shouldPrefetch) {
        const path = addPrefix(uiTree[key].route.url, '/')
        const url = urlFormatter.build(path)
        loadFromServer(url, beagleHeaders)
      }
    })

    if (uiTree.children) uiTree.children.forEach(beagleShouldPrefetch)

    return uiTree
  }

  return beagleShouldPrefetch

}

export default createShouldPrefetchMiddleware
