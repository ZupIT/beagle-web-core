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

import Renderer from 'beagle-view/render'
import Tree from 'beagle-tree'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { LifecycleHookMap } from 'service/beagle-service/types'
import { createBeagleViewMock } from '../../old-structure/utils/test-utils'
import defaultOperations from 'operation'

export function createRenderer(params: Partial<Parameters<typeof Renderer.create>[0]> = {}) {
  let currentTree: IdentifiableBeagleUIElement
  const beagleView = params.beagleView || createBeagleViewMock()
  beagleView.getTree = () => Tree.clone(currentTree)
  const setTree = jest.fn((t) => {
    currentTree = t
    params.setTree && params.setTree(t)
  })
  const lifecycleHooks: LifecycleHookMap = {
    afterViewSnapshot: { components: {} },
    beforeRender: { components: {} },
    beforeStart: { components: {} },
    beforeViewSnapshot: { components: {} },
  }

  const renderer = Renderer.create({
    beagleView: params.beagleView || beagleView,
    setTree,
    lifecycleHooks: params.lifecycleHooks || lifecycleHooks,
    actionHandlers: params.actionHandlers || {},
    operationHandlers: params.operationHandlers || defaultOperations,
    childrenMetadata: params.childrenMetadata || {},
    executionMode: params.executionMode || 'development',
    renderToScreen: params.renderToScreen || jest.fn(),
    typesMetadata: params.typesMetadata || {},
    disableCssTransformation: params.disableCssTransformation || false,
  })

  return renderer
}
