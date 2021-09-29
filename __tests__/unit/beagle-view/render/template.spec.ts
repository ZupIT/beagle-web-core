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

import BeagleService from 'service/beagle-service'
import { BeagleView as BeagleViewType } from 'beagle-view/types'
import BeagleView from 'beagle-view'
import { createTemplateRenderMocks } from './template.mock'
import { BeagleUIElement, IdentifiableBeagleUIElement } from 'beagle-tree/types'
import * as templateManager from 'beagle-view/render/template-manager'

describe('Render a template with doTemplateRender ', () => {
  let view: BeagleViewType
  const baseUrl = 'http://test.com'
  const viewId = 'beagleId'
  const mocks = createTemplateRenderMocks()
  const service = BeagleService.create({
    baseUrl,
    components: {},
  })
  const { viewContentManagerMap } = service

  describe('doTemplateRender', () => {
    beforeAll(() => {
      viewContentManagerMap.unregister(viewId)
      view = BeagleView.create(service)
      view.getRenderer().doFullRender(mocks.baseContainer as BeagleUIElement)
      viewContentManagerMap.register(viewId, view)
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

      const templateOrder = [
        mocks.templateManager.templates[0].view,
        mocks.templateManager.templates[1].view,
        mocks.templateManager.default,
        mocks.templateManager.templates[2].view,
        mocks.templateManager.templates[3].view,
      ]

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
        for (let i = 0; i < 5; i++) {
          expect(componentManager).toHaveBeenNthCalledWith(i + 1, templateOrder[i], i)
        }
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

      describe('Insertion Modes', () => {
        beforeAll(() => {
          componentManager.mockClear()
        })

        it('should have five children', async () => {
          expect(view.getTree().children).toBeDefined()
          expect(view.getTree().children?.length).toBe(5)
        })

        it('should continue with five children after a new template render call, without the mode being defined', () => {
          view.getRenderer().doTemplateRender(mocks.templateManager, 'template-container', mocks.dataSource, componentManager)
          expect(view.getTree().children).toBeDefined()
          expect(view.getTree().children?.length).toBe(5)
        })

        it('should have ten children when the mode is defined as "append", having the previous result and then appended the new result', () => {
          view.getRenderer().doTemplateRender(mocks.templateManager, 'template-container', mocks.dataSource, componentManager, 'append')
          const renderedChildren = view.getTree().children || []

          expect(renderedChildren).toBeDefined()
          expect(renderedChildren.length).toBe(10)
          expect(componentManager).toHaveBeenCalledTimes(10)

          for (let i = 0; i < 10; i++) {
            const relativeIndex = (i >= 5 ? (i - 5) : i)
            expect(componentManager).toHaveBeenNthCalledWith(i + 1, templateOrder[relativeIndex], relativeIndex)
            expect(renderedChildren[i].id).toEqual(templateOrder[relativeIndex]?.id)
            expect(renderedChildren[i]).toEqual(mockChildren[relativeIndex])
          }
        })

        it('should have fifteen children when the mode is defined as "prepend", having the new result and then appended the previous result', () => {
          view.getRenderer().doTemplateRender(mocks.templateManager, 'template-container', mocks.dataSource, componentManager, 'prepend')
          const renderedChildren = view.getTree().children || []

          expect(renderedChildren).toBeDefined()
          expect(renderedChildren.length).toBe(15)
          expect(componentManager).toHaveBeenCalledTimes(15)

          for (let i = 0; i < 15; i++) {
            const subtract = [15, 10, 5].find(tol => i >= tol) || 0
            const relativeIndex = (i >= subtract ? (i - subtract) : i)
            const relativeReversedIndex = (i < 5 ? ((5 - 1) - i) : relativeIndex)

            expect(componentManager).toHaveBeenNthCalledWith(i + 1, templateOrder[relativeIndex], relativeIndex)
            expect(renderedChildren[i].id).toEqual(templateOrder[relativeReversedIndex]?.id)
            expect(renderedChildren[i]).toEqual(mockChildren[relativeReversedIndex])
          }
        })
      })
    })
  })

  describe('doTemplateRender - exceptions', () => {
    beforeAll(() => {
      viewContentManagerMap.unregister(viewId)
      view = BeagleView.create(service)
      view.getRenderer().doFullRender(mocks.baseContainer as BeagleUIElement)
      viewContentManagerMap.register(viewId, view)
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

        const order = [
          { viewIndex: 0, elementIndex: 1 },
          { viewIndex: 0, elementIndex: 2 },
          { viewIndex: 2, elementIndex: 3 },
          { viewIndex: 3, elementIndex: 5 },
          { viewIndex: 1, elementIndex: 7 },
          { viewIndex: 2, elementIndex: 8 },
        ]

        for (let i = 0; i < order.length; i++) {
          const item = order[i]
          expect(componentManager).toHaveBeenNthCalledWith(i + 1, { ...views[item.viewIndex], id: `${views[item.viewIndex].id}:${item.elementIndex}` }, item.elementIndex)
        }
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
