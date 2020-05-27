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

import { findById } from './utils/tree-reading'
import { BeagleView, BeagleContext } from './types'
import beagleAnalytics from './BeagleAnalytics'

export const views: Record<string, BeagleView> = {}

function createContext<T>(view: BeagleView<T>, elementId: string): BeagleContext<T> {
  return {
    replace: params => view.updateWithFetch(params, elementId, 'replace'),
    append: params => view.updateWithFetch(params, elementId, 'append'),
    prepend: params => view.updateWithFetch(params, elementId, 'prepend'),
    updateWithTree: params => view.updateWithTree({ ...params, elementId }),
    getElementId: () => elementId,
    getElement: () => findById(view.getTree(), elementId),
    getView: () => view,
    getAnalytics: () => beagleAnalytics.getAnalytics(),
  }
}

function getContext(viewId: string, elementId: string) {
  if (!viewId || !elementId) throw Error('Beagle: getContext couldn\'t find viewId or elementId')

  const view = views[viewId]
  if (!view) throw Error(`Beagle: getContext couldn\'t find view with id ${viewId}`)

  return createContext(view, elementId)
}

function registerView(viewId: string, view: BeagleView) {
  views[viewId] = view
}

function unregisterView(viewId: string) {
  delete views[viewId]
}

export default {
  getContext,
  registerView,
  unregisterView,
}
