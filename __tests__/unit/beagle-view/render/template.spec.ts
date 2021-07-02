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

import nock from 'nock'
import BeagleService from 'service/beagle-service'
import { BeagleView } from 'beagle-view/types'
import { mockLocalStorage } from '../../old-structure/utils/test-utils'
import { createTemplateRenderMocks } from './template.mock'
import { BeagleUIElement, DataContext, IdentifiableBeagleUIElement } from 'beagle-tree/types'
import * as templateManager from 'beagle-view/render/template-manager'

describe('Render a template with doTemplateRender ', () => {
  let view: BeagleView
  const baseUrl = 'http://test.com'
  const viewId = 'beagleId'
  const mocks = createTemplateRenderMocks()
  const localStorageMock = mockLocalStorage()
  const { createView,viewContentManagerMap } = BeagleService.create({
    baseUrl,
    components: {},
  })

  describe('doTemplateRender', () => {
    beforeAll(() => {
      viewContentManagerMap.unregister(viewId)
      view = createView()
      view.getRenderer().doFullRender(mocks.baseContainer as BeagleUIElement)
      viewContentManagerMap.register(viewId, view)
      nock.cleanAll()
      localStorageMock.clear()
    })

    afterAll(() => {
      localStorageMock.unmock()
    })

    it('should start only with the container that will be the parent of the children templates', async () => {
      expect(view.getTree()).toEqual(mocks.baseContainer)
    })

    describe('Template render', () => {
      let tree: IdentifiableBeagleUIElement
      let treeChildren: IdentifiableBeagleUIElement[]
      let mockChildren: BeagleUIElement[]
      const templateManagerSpy = jest.spyOn(templateManager, 'getEvaluatedTemplate')
      const componentManager = jest.fn((component: IdentifiableBeagleUIElement, index: number) => {
        return component
      })

      beforeAll(() => {
        view.getRenderer().doTemplateRender(mocks.templateManager, 'template-container', mocks.dataSource, componentManager)
        tree = view.getTree()
        treeChildren = tree.children || []
        mockChildren = mocks.renderedContainer.children || []
      })

      afterAll(() => {
        templateManagerSpy.mockClear()
      })

      it('should have five children', async () => {
        expect(tree.children).toBeDefined()
        expect(tree.children?.length).toBe(5)
      })

      it('should have called the getEvaluatedTemplate five times merging all the higher hierarchy contexts and the context of the item', async () => {
        expect(templateManagerSpy).toHaveBeenCalledTimes(5)

        const higherContexts = [{ id: 'global', value: null }, mocks.baseContainer.context]
        for (let i = 0; i < 5; i++) {
          expect(templateManagerSpy.mock.calls[i][0]).toBe(mocks.templateManager)
          expect(templateManagerSpy.mock.calls[i][1]).toEqual([...mocks.dataSource[i], ...higherContexts])
        }
      })

      it('should have been called the componentManager five times with the respective template', async () => {
        expect(componentManager).toHaveBeenCalledTimes(5)
        expect(componentManager).toHaveBeenNthCalledWith(1, mocks.templateManager.templates[0].view, 0)
        expect(componentManager).toHaveBeenNthCalledWith(2, mocks.templateManager.templates[1].view, 1)
        expect(componentManager).toHaveBeenNthCalledWith(3, mocks.templateManager.default, 2)
        expect(componentManager).toHaveBeenNthCalledWith(4, mocks.templateManager.templates[2].view, 3)
        expect(componentManager).toHaveBeenNthCalledWith(5, mocks.templateManager.templates[3].view, 4)
      })

      it('should render the first template on the first position', async () => {
        expect(treeChildren[0].id).toEqual('first-child')
        expect(treeChildren[0]).toEqual(mockChildren[0])
      })

      it('should render the second template on the second position', async () => {
        expect(treeChildren[1].id).toEqual('second-child')
        expect(treeChildren[1]).toEqual(mockChildren[1])
      })

      it('should render the unknown template on the third position, because it does not match any case', async () => {
        expect(treeChildren[2].id).toEqual('unknown-child')
        expect(treeChildren[2]).toEqual(mockChildren[2])
      })

      it('should render the third template on the fourth position', async () => {
        expect(treeChildren[3].id).toEqual('third-child')
        expect(treeChildren[3]).toEqual(mockChildren[3])
      })

      it('should be able evaluate a tree context on the case condition and render the fifth template on the fifth position', async () => {
        expect(treeChildren[4].id).toEqual('second-unknown-child')
        expect(treeChildren[4]).toEqual(mockChildren[4])
      })

      it('should render the full tree matching the cases of templates', async () => {
        expect(tree).toEqual(mocks.renderedContainer)
      })
    })
  })

  describe('doTemplateRender - exceptions', () => {
    beforeAll(() => {
      viewContentManagerMap.unregister(viewId)
      view = createView()
      view.getRenderer().doFullRender(mocks.baseContainer as BeagleUIElement)
      viewContentManagerMap.register(viewId, view)
      nock.cleanAll()
      localStorageMock.clear()
    })

    afterAll(() => {
      localStorageMock.unmock()
    })

    it('should start only with the container that will be the parent of the children templates', async () => {
      expect(view.getTree()).toEqual(mocks.baseContainer)
    })

    describe('Template render', () => {
      let tree: IdentifiableBeagleUIElement
      let treeChildren: IdentifiableBeagleUIElement[]
      let mockChildren: BeagleUIElement[]
      const templateManagerSpy = jest.spyOn(templateManager, 'getEvaluatedTemplate')
      const componentManager = jest.fn((component: IdentifiableBeagleUIElement, index: number) => {
        component.id = `${component.id}:${index}`
        return component
      })

      beforeAll(() => {
        view.getRenderer().doTemplateRender(
          mocks.exceptionTemplateManager,
          'template-container',
          mocks.exceptionDataSource,
          componentManager
        )

        tree = view.getTree()
        treeChildren = tree.children || []
        mockChildren = mocks.renderedExceptionContainer.children || []
      })

      afterAll(() => {
        templateManagerSpy.mockClear()
      })

      it('should have six child', async () => {
        expect(tree.children).toBeDefined()
        expect(tree.children?.length).toBe(6)
      })

      it('should have called the getEvaluatedTemplate ten times (all data source items) merging all the higher hierarchy contexts and the context of the item', async () => {
        expect(templateManagerSpy).toHaveBeenCalledTimes(10)

        const higherContexts = [{ id: 'global', value: null }, mocks.baseContainer.context]
        for (let i = 0; i < 10; i++) {
          expect(templateManagerSpy.mock.calls[i][0]).toBe(mocks.exceptionTemplateManager)
          expect(templateManagerSpy.mock.calls[i][1]).toEqual([...mocks.exceptionDataSource[i], ...higherContexts])
        }
      })

      it('should have called the componentManager six times', async () => {
        const views = mocks.exceptionTemplateManager.templates.map(t => t.view)

        expect(componentManager).toHaveBeenCalledTimes(6)
        expect(componentManager).toHaveBeenNthCalledWith(1, { ...views[0], id: `${views[0].id}:${1}`}, 1)
        expect(componentManager).toHaveBeenNthCalledWith(2, { ...views[0], id: `${views[0].id}:${2}`}, 2)
        expect(componentManager).toHaveBeenNthCalledWith(3, { ...views[2], id: `${views[2].id}:${3}`}, 3)
        expect(componentManager).toHaveBeenNthCalledWith(4, { ...views[3], id: `${views[3].id}:${5}`}, 5)
        expect(componentManager).toHaveBeenNthCalledWith(5, { ...views[1], id: `${views[1].id}:${7}`}, 7)
        expect(componentManager).toHaveBeenNthCalledWith(6, { ...views[2], id: `${views[2].id}:${8}`}, 8)
      })

      it('should not render a context when the case is not matched and default template is not defined', async () => {
        expect(treeChildren[0].id).not.toEqual('unknown-child:0')
        expect(treeChildren[4].id).not.toEqual('unknown-child:4')
      })

      it('should render the first template on the first position', async () => {
        expect(treeChildren[0].id).toEqual('first-child:1')
        expect(treeChildren[0]).toEqual(mockChildren[0])
      })

      it('should render the first template on the second position', async () => {
        expect(treeChildren[1].id).toEqual('first-child:2')
        expect(treeChildren[1]).toEqual(mockChildren[1])
      })

      it('should render the third template on the third position', async () => {
        expect(treeChildren[2].id).toEqual('third-child:3')
        expect(treeChildren[2]).toEqual(mockChildren[2])
      })

      it('should be able evaluate a tree context on the case condition and render the fourth template on the fifth position', async () => {
        expect(treeChildren[3].id).toEqual('second-unknown-child:5')
        expect(treeChildren[3]).toEqual(mockChildren[3])
      })

      it('should render the second template on the fourth position', async () => {
        expect(treeChildren[4].id).toEqual('second-child:7')
        expect(treeChildren[4]).toEqual(mockChildren[4])
      })

      it('should render the third template on the fifth position', async () => {
        expect(treeChildren[5].id).toEqual('third-child:8')
        expect(treeChildren[5]).toEqual(mockChildren[5])
      })

      it('should render the full tree matching the cases of templates', async () => {
        expect(tree).toEqual(mocks.renderedExceptionContainer)
      })
    })
  })
})
