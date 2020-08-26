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

import Renderer from 'beagle-view/render'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import Tree from 'beagle-tree'
import { LifecycleHookMap } from 'service/beagle-service/types'
import { createBeagleViewMock } from '../../old-structure/utils/test-utils'
import {
  createLifecycleMap,
  createLifecycleMapWithModificationsToTree,
  createTreeWithContainerAndText,
  createTreeWithContainerTextAndImage,
  createExpectationsForExecutionOrderTests,
} from './lifecycles.mock'

function createRenderer(lifecycleHooks: LifecycleHookMap) {
  let currentTree: IdentifiableBeagleUIElement
  const beagleView = createBeagleViewMock({ getTree: () => currentTree })
  const setTree = jest.fn(t => currentTree = t)
  const renderToScreen = jest.fn()

  const renderer = Renderer.create({
    beagleView,
    setTree,
    lifecycleHooks,
    actionHandlers: {},
    childrenMetadata: {},
    executionMode: 'development',
    renderToScreen,
    typesMetadata: {},
  })

  return { renderer, setTree, renderToScreen }
}

describe('Renderer: lifecycles', () => {
  it('should run global lifecycles', () => {
    const lifecycleHooks = createLifecycleMap(true, false)
    const { renderer } = createRenderer(lifecycleHooks)
    const mock = createTreeWithContainerTextAndImage()
    renderer.doFullRender(mock)
    expect(lifecycleHooks.beforeStart.global).toHaveBeenCalledWith(mock)
    expect(lifecycleHooks.beforeViewSnapshot.global).toHaveBeenCalledWith(mock)
    expect(lifecycleHooks.afterViewSnapshot.global).toHaveBeenCalledWith(mock)
    expect(lifecycleHooks.beforeRender.global).toHaveBeenCalledWith(mock)
  })

  it('should run components lifecycles', () => {
    const lifecycleHooks = createLifecycleMap(false, true)
    const { renderer } = createRenderer(lifecycleHooks)
    const mock = createTreeWithContainerTextAndImage()
    renderer.doFullRender(mock)
    
    expect(lifecycleHooks.beforeStart.components['beagle:container']).toHaveBeenCalledTimes(2)
    expect(lifecycleHooks.beforeStart.components['beagle:container']).toHaveBeenCalledWith(mock)
    expect(lifecycleHooks.beforeStart.components['beagle:container'])
      .toHaveBeenLastCalledWith(Tree.findById(mock, 'imageContainer'))
    
    const text = Tree.findById(mock, 'text')
    expect(lifecycleHooks.beforeStart.components['beagle:text']).toHaveBeenCalledWith(text)
    expect(lifecycleHooks.beforeViewSnapshot.components['beagle:text']).toHaveBeenCalledWith(text)
    expect(lifecycleHooks.afterViewSnapshot.components['beagle:text']).toHaveBeenCalledWith(text)
    expect(lifecycleHooks.beforeRender.components['beagle:text']).toHaveBeenCalledWith(text)

    expect(lifecycleHooks.afterViewSnapshot.components['beagle:image'])
      .toHaveBeenCalledWith(Tree.findById(mock, 'image'))
  })

  it('should not run lifecycle for component that doesn\'t appear in the tree', () => {
    const lifecycleHooks = createLifecycleMap(false, true)
    const { renderer } = createRenderer(lifecycleHooks)
    const mock = createTreeWithContainerAndText()
    renderer.doFullRender(mock)

    expect(lifecycleHooks.afterViewSnapshot.components['beagle:image']).not.toHaveBeenCalled()
  })

  it('should work even if lifecycles don\'t have return values', () => {
    const expectations = createExpectationsForExecutionOrderTests()
    const lifecycleHooks = createLifecycleMapWithModificationsToTree(false)
    const { renderer, renderToScreen } = createRenderer(lifecycleHooks)
    const mock = createTreeWithContainerTextAndImage()
    renderer.doFullRender(mock)

    expect(renderToScreen).toHaveBeenCalledWith(expectations.renderToScreen.global)
  })

  it('should run only afterViewSnapshot and beforeRender on a partial render', () => {
    const lifecycleHooks = createLifecycleMap(true, true)
    const { renderer } = createRenderer(lifecycleHooks)
    const mock = createTreeWithContainerTextAndImage()
    const text = Tree.findById(mock, 'text')
    renderer.doPartialRender(mock)
    
    expect(lifecycleHooks.beforeStart.global).not.toHaveBeenCalled()
    expect(lifecycleHooks.beforeStart.components['beagle:container']).not.toHaveBeenCalled()
    expect(lifecycleHooks.beforeStart.components['beagle:container']).not.toHaveBeenCalled()
    expect(lifecycleHooks.beforeStart.components['beagle:text']).not.toHaveBeenCalled()
    expect(lifecycleHooks.beforeViewSnapshot.global).not.toHaveBeenCalled()
    expect(lifecycleHooks.beforeViewSnapshot.components['beagle:text']).not.toHaveBeenCalled()

    expect(lifecycleHooks.afterViewSnapshot.global).toHaveBeenCalledWith(mock)
    expect(lifecycleHooks.afterViewSnapshot.components['beagle:text']).toHaveBeenCalledWith(text)
    expect(lifecycleHooks.beforeRender.global).toHaveBeenCalledWith(mock)
    expect(lifecycleHooks.beforeRender.components['beagle:text']).toHaveBeenCalledWith(text)
  })

  it('should be case insensitive', () => {
    // this test considers the lifecycle hook map to be all lowercase
    const lifecycleHooks = createLifecycleMap(true, true)
    const { renderer } = createRenderer(lifecycleHooks)
    const mock = createTreeWithContainerTextAndImage()
    mock._beagleComponent_ = 'bEaGle:CONTAiNER'
    renderer.doFullRender(mock)

    expect(lifecycleHooks.beforeStart.components['beagle:container']).toHaveBeenCalledWith(mock)
  })

  describe('Renderer: lifecycles: order of execution', () => {
    const expectations = createExpectationsForExecutionOrderTests()
    const lifecycleHooks = createLifecycleMapWithModificationsToTree(true)
    const { renderer, setTree, renderToScreen } = createRenderer(lifecycleHooks)
    const mock = createTreeWithContainerTextAndImage()
    renderer.doFullRender(mock)

    it('first: should run beforeStart', () => {
      expect(lifecycleHooks.beforeStart.global)
        .toHaveBeenCalledWith(expectations.beforeStart.global)
      expect(lifecycleHooks.beforeStart.components['beagle:container'])
        .toHaveBeenCalledWith(expectations.beforeStart.container)
      expect(lifecycleHooks.beforeStart.components['beagle:text'])
        .toHaveBeenCalledWith(expectations.beforeStart.text)
      expect(lifecycleHooks.beforeStart.components['beagle:container'])
        .toHaveBeenLastCalledWith(expectations.beforeStart.imageContainer)
    })
  
    it('second: should run beforeViewSnapshot', () => { 
      expect(lifecycleHooks.beforeViewSnapshot.global)
        .toHaveBeenCalledWith(expectations.beforeViewSnapshot.global)
      expect(lifecycleHooks.beforeViewSnapshot.components['beagle:text'])
        .toHaveBeenCalledWith(expectations.beforeViewSnapshot.text)
    })
  
    it('third: should take view snapshot', () => { 
      expect(setTree).toHaveBeenCalledWith(expectations.afterViewSnapshot.global)
    })

    it('fourth: should run afterViewSnapshot', () => {  
      expect(lifecycleHooks.afterViewSnapshot.global)
        .toHaveBeenCalledWith(expectations.afterViewSnapshot.global)
      expect(lifecycleHooks.afterViewSnapshot.components['beagle:text'])
        .toHaveBeenCalledWith(expectations.afterViewSnapshot.text)
      expect(lifecycleHooks.afterViewSnapshot.components['beagle:image'])
        .toHaveBeenCalledWith(expectations.afterViewSnapshot.image)
    })

    it('fifth: should run beforeRender', () => {  
      expect(lifecycleHooks.beforeRender.global)
        .toHaveBeenCalledWith(expectations.beforeRender.global)
      expect(lifecycleHooks.beforeRender.components['beagle:text'])
        .toHaveBeenCalledWith(expectations.beforeRender.text)
    })

    it('last: should render to screen', () => {  
      expect(renderToScreen).toHaveBeenCalledWith(expectations.renderToScreen.global)
    })
  })
})
