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
import { ChildrenMetadata } from 'metadata/types'
import Component from 'beagle-view/render/component'
import { createRenderer } from './utils'
import { createTree } from './integration.mock'
import { createBeagleViewMock } from '../../old-structure/utils/test-utils'

/**
 * This test suit validates the integration between all rendering modules, i.e. it runs the entire
 * rendering process and expect the tree passed as a parameter to be rendered.
 *
 * The tree we use here is created in the file 'integration.mock'. Its three stages (original,
 * pre-processed and ready to render) have been manually created and the goal here is to verify if
 * the rendering process can take the original tree and modify it into the two next stages.
 *
 * The tree we created to make this test has missing ids, custom children properties, nulls,
 * pre-fetches, context, actions and expressions. This is so we can guarantee that the handlers for
 * every feature are being correctly called.
 */

describe('Beagle View: render: integration', () => {
  const { original, preProcessed, readyToRender, withoutCss } = createTree()
  const setTree = jest.fn()
  const renderToScreen = jest.fn()
  const beagleView = createBeagleViewMock()
  const childrenMetadata: Record<string, ChildrenMetadata> = {
    'custom:table': { property: 'rows' },
    'custom:row': { property: 'columns' },
    'custom:column': { property: 'content' }
  }
  const renderer = createRenderer({ setTree, renderToScreen, beagleView, childrenMetadata })
  renderer.doFullRender(Tree.clone(original))

  it('should pre-process', () => {
    expect(setTree).toHaveBeenCalledWith(preProcessed)
  })

  it('should be ready to render', () => {
    expect(renderToScreen).toHaveBeenCalledWith(readyToRender)
  })

  it('should not convert style to css', () => {
    Component.resetIdCounter()
    const renderer = createRenderer({
      setTree,
      renderToScreen,
      beagleView,
      childrenMetadata,
      disableCssTransformation: true,
    })
    renderer.doFullRender(Tree.clone(original))
    expect(renderToScreen).toHaveBeenCalledWith(withoutCss)
  })
})
