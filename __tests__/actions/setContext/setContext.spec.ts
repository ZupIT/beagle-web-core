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

import setContext from 'action/set-context'
import Tree from 'beagle-tree'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { createBeagleViewMock } from '../../utils/test-utils'
import {
  createSingleContextMock,
  createDoubleContextMock,
  createMockWithDistantContext,
  createSameLevelContextMock,
  createMultipleScopesMock,
  createGlobalContextMock,
  createImplicitContextMock,
  createExplicitAndImplicitContextMock,
} from './mocks'

describe('Actions: beagle:setContext', () => {
  beforeEach(() => {
    globalMocks.log.mockClear()
  })

  it('should set single context', () => {
    const mock = createSingleContextMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        value: 'new value',
      },
      beagleView,
      element: Tree.findById(mock, 'button')!,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doPartialRender).toHaveBeenCalledWith({
      ...mock,
      context: {
        id: 'ctx_a',
        value: 'new value',
      },
    })
  })

  it('should set the first context in the hierarchy', () => {
    const mock = createDoubleContextMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        value: 'new value',
      },
      beagleView,
      element: Tree.findById(mock, 'button')!,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doPartialRender).toHaveBeenCalledWith({
      ...mock,
      children: [
        {
          ...mock.children![0],
          context: {
            id: 'ctx_b',
            value: 'new value',
          },
        }
      ],
    })
  })

  it('should set context by id', () => {
    const mock = createDoubleContextMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        contextId: 'ctx_a',
        value: 'new value',
      },
      beagleView,
      element: Tree.findById(mock, 'button')!,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doPartialRender).toHaveBeenCalledWith({
      ...mock,
      context: {
        id: 'ctx_a',
        value: 'new value',
      },
    })
  })

  it('should set context three levels above', () => {
    const mock = createMockWithDistantContext()
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        value: 'new value',
      },
      beagleView,
      element: Tree.findById(mock, 'button')!,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doPartialRender).toHaveBeenCalledWith({
      ...mock,
      context: {
        id: 'ctx_a',
        value: 'new value',
      },
    })
  })

  it('should set same-level context', () => {
    const mock = createSameLevelContextMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        value: 'new value',
      },
      beagleView,
      element: mock,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doPartialRender).toHaveBeenCalledWith({
      ...mock,
      context: {
        id: 'ctx_a',
        value: 'new value',
      },
    })
  })

  it('should set a sub-structure inside the context', () => {
    const contextValue = {
      name: 'Jest',
      lastName: 'Mockerson',
      age: 78,
      phones: ['(34) 98756-8574', '(34) 3212-2221'],
    }
    const mock = createSameLevelContextMock(contextValue)
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        path: 'age',
        value: 32,
      },
      beagleView,
      element: mock,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doPartialRender).toHaveBeenCalledWith({
      ...mock,
      context: {
        id: 'ctx_a',
        value: { ...contextValue, age: 32 },
      },
    })
  })

  it('should set an index of an array inside the the context', () => {
    const contextValue = {
      name: 'Jest',
      lastName: 'Mockerson',
      age: 78,
      phones: ['(34) 98756-8574', '(34) 3212-2221'],
    }
    const mock = createSameLevelContextMock(contextValue)
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        path: 'phones[0]',
        value: '(00) 00000-0000',
      },
      beagleView,
      element: mock,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doPartialRender).toHaveBeenCalledWith({
      ...mock,
      context: {
        id: 'ctx_a',
        value: { ...contextValue, phones: ['(00) 00000-0000', '(34) 3212-2221'] },
      },
    })
  })

  it('should set an index of the context', () => {
    const contextValue = ['Lorem', 'Ipsum', 'Sin', 'It']
    const mock = createSameLevelContextMock(contextValue)
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        path: '[2]',
        value: 'Dolor',
      },
      beagleView,
      element: mock,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doPartialRender).toHaveBeenCalledWith({
      ...mock,
      context: {
        id: 'ctx_a',
        value: ['Lorem', 'Ipsum', 'Dolor', 'It'],
      },
    })
  })

  it('should warn and not update view if context doesn\'t exist', () => {
    const mock: IdentifiableBeagleUIElement = { _beagleComponent_: 'container', id: 'container' }
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        contextId: 'blah',
        value: 'test',
      },
      beagleView,
      element: mock,
      executeAction: jest.fn(),
    })

    expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(String))
    expect(beagleView.getRenderer().doPartialRender).not.toHaveBeenCalled()
  })

  it('should warn and not update view if context is not part of current hierarchy', () => {
    const mock = createMultipleScopesMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        contextId: 'ctx_a',
        value: 'test',
      },
      beagleView,
      element: Tree.findById(mock, 'btn_b')!,
      executeAction: jest.fn(),
    })

    expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(String))
    expect(beagleView.getRenderer().doPartialRender).not.toHaveBeenCalled()
  })

  it('should create context structures according to path (object)', () => {
    const contextValue = { name: 'Jest' }
    const mock = createSameLevelContextMock(contextValue)
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        path: 'lorem.ipsum.sin.it.dolor',
        value: 'amet',
      },
      beagleView,
      element: mock,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doPartialRender).toHaveBeenCalledWith({
      ...mock,
      context: {
        id: 'ctx_a',
        value: { name: 'Jest', lorem: { ipsum: { sin: { it: { dolor: 'amet' } } } } },
      },
    })
  })

  it('should create context structures according to path (array)', () => {
    const contextValue = { name: 'Jest' }
    const mock = createSameLevelContextMock(contextValue)
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        path: 'lorem[1].ipsum.sin[3].it.dolor[0]',
        value: 'amet',
      },
      beagleView,
      element: mock,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doPartialRender).toHaveBeenCalledWith({
      ...mock,
      context: {
        id: 'ctx_a',
        value: {
          name: 'Jest',
          lorem: [
            undefined,
            {
              ipsum: {
                sin: [
                  undefined,
                  undefined,
                  undefined,
                  { it: { dolor: ['amet'] } },
                ],
              },
            },
          ],
        },
      },
    })
  })

  it('should update global context if it is the only context present', () => {
    const mock: IdentifiableBeagleUIElement = { _beagleComponent_: 'container', id: 'container' }
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const { globalContext } = beagleView.getBeagleService()

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        value: 'test',
      },
      beagleView,
      element: mock,
      executeAction: jest.fn(),
    }) 
    expect(globalContext.set).toHaveBeenCalled()
  })

  it('should call set global context when updating a global context', () => {
    const mock = createGlobalContextMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const { globalContext } = beagleView.getBeagleService()
  
    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        contextId: 'global',
        value: 'new value',
      },
      beagleView,
      element: Tree.findById(mock, 'button')!,
      executeAction: jest.fn(),
    })
  
    expect(globalContext.set).toHaveBeenCalledWith('new value', undefined)
  })

  it('should call set global context when updating a global context and pass path if defined', () => {
    const mock = createGlobalContextMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const { globalContext } = beagleView.getBeagleService()
  
    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        contextId: 'global',
        value: 'new value',
        path: 'testing.path'
      },
      beagleView,
      element: Tree.findById(mock, 'button')!,
      executeAction: jest.fn(),
    })
  
    expect(globalContext.set).toHaveBeenCalledWith('new value', 'testing.path')
  })

  it('should not find implicit context', () => {
    const mock = createImplicitContextMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        contextId: 'ctx',
        value: 'test',
      },
      beagleView,
      element: mock,
      executeAction: jest.fn(),
    })

    expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(String))
    expect(beagleView.getRenderer().doPartialRender).not.toHaveBeenCalled()
  })

  it('should ignore implicit context and modify explicit context with the same id', () => {
    const mock = createExplicitAndImplicitContextMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })

    setContext({
      action: {
        _beagleAction_: 'beagle:setContext',
        contextId: 'ctx',
        value: 'value',
      },
      beagleView,
      element: mock,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doPartialRender).toHaveBeenCalledWith({
      ...mock,
      context: {
        id: 'ctx',
        value: 'value',
      },
    })
  })
})
