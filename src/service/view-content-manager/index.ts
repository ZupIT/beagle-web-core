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
import BeagleError from 'error/BeagleError'
import { BeagleView } from 'beagle-view/types'
import set from 'lodash/set'
import getLodash from 'lodash/get'
import { ViewContentManager, ViewContentManagerMap } from './types'

function createViewContentManagerMap(): ViewContentManagerMap {
  const views: Record<string, BeagleView> = {}

  function create(view: BeagleView, elementId: string): ViewContentManager {
    return {
      getElementId: () => elementId,
      getElement: () => Tree.findById(view.getTree(), elementId)!,
      getView: () => view,
      getState: (key: string) => getLodash(view.getState(), `contentManager.${elementId}.${key}`),
      setState: (key: string, value: any) => set(view.getState(), `contentManager.${elementId}.${key}`, value),
    }
  }

  function get(viewId: string, elementId: string) {
    if (!viewId || !elementId) {
      throw new BeagleError('ViewContentManagerMap couldn\'t find viewId or elementId')
    }

    const view = views[viewId]
    if (!view) throw new BeagleError(`ViewContentManagerMap couldn\'t find view with id ${viewId}`)

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
