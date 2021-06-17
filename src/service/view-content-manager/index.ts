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
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { ViewContentManager, ViewContentManagerMap } from './types'

function createViewContentManagerMap(): ViewContentManagerMap {
  const views: Record<string, BeagleView> = {}
  const unsubscribe: Record<string, () => void> = {}
  const idCache: Record<string, Record<string, IdentifiableBeagleUIElement>> = {}

  function createIdCache(tree: IdentifiableBeagleUIElement) {
    const cache: Record<string, IdentifiableBeagleUIElement> = {}
    Tree.forEach(tree, node => cache[node.id] = node)
    return cache
  }

  function create(viewId: string, elementId: string): ViewContentManager {
    const view = views[viewId]
    if (!view) throw new BeagleError(`ViewContentManagerMap couldn\'t find view with id ${viewId}`)

    return {
      getElementId: () => elementId,
      getElement: () => {
        if (!idCache[viewId]) idCache[viewId] = createIdCache(view.getTree())
        return idCache[viewId][elementId]
      },
      getView: () => view,
    }
  }

  function get(viewId: string, elementId: string) {
    if (!viewId || !elementId) {
      throw new BeagleError('ViewContentManagerMap couldn\'t find viewId or elementId')
    }

    return create(viewId, elementId)
  }

  function register(viewId: string, view: BeagleView) {
    views[viewId] = view
    unsubscribe[viewId] = view.subscribe(() => delete idCache[viewId])
  }

  function unregister(viewId: string) {
    unsubscribe[viewId]()
    delete unsubscribe[viewId]
    delete idCache[viewId]
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
