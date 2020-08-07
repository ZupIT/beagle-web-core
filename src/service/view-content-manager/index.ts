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

import Tree from 'beagle-tree'
import { BeagleView, LoadParams } from 'beagle-view/types'
import { ViewContentManager, ViewContentManagerMap } from './types'

function createViewContentManagerMap(): ViewContentManagerMap {
  const views: Record<string, BeagleView> = {}

  function create(view: BeagleView, elementId: string): ViewContentManager {
    return {
      replaceComponent: (params: LoadParams) => view.fetch(params, elementId, 'replaceComponent'),
      replace: (params: LoadParams) => view.fetch(params, elementId, 'replace'),
      append: (params: LoadParams) => view.fetch(params, elementId, 'append'),
      prepend: (params: LoadParams) => view.fetch(params, elementId, 'prepend'),
      getElementId: () => elementId,
      getElement: () => Tree.findById(view.getTree(), elementId)!,
      getView: () => view,
    }
  }
  
  function get(viewId: string, elementId: string) {
    if (!viewId || !elementId) {
      throw Error('Beagle: ViewContentManagerMap couldn\'t find viewId or elementId')
    }
  
    const view = views[viewId]
    if (!view) throw Error(`Beagle: ViewContentManagerMap couldn\'t find view with id ${viewId}`)
  
    return create(view, elementId)
  }
  
  function register(viewId: string, view: BeagleView) {
    views[viewId] = view
  }
  
  function unregister(viewId: string) {
    delete views[viewId]
  }
  
  return {
    get,
    register,
    unregister,
    isRegistered: (viewId: string) => !!views[viewId],
  }
}

export default {
  create: createViewContentManagerMap,
}
