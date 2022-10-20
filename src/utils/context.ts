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

import Context from 'beagle-view/render/context'
import { BeagleView } from 'beagle-view/types'

export function getTreeContextHierarchy(view: BeagleView) {
  const extraContexts = [
    view.getBeagleService().globalContext.getAsDataContext(),
    ...view.getLocalContexts().getAllAsDataContext(),
  ]
  const hierarchy = Context.evaluate(view.getTree(), extraContexts, false)
  return Object.keys(hierarchy)
    .map(key => hierarchy[key])
    .reduce((prev, cur) => [...prev, ...cur], [])
}
