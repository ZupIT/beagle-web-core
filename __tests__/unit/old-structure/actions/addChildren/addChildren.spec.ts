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

import addChildren from 'action/add-children'
import Tree from 'beagle-tree'
import { createBeagleViewMock } from '../../utils/test-utils'
import { createSimpleMock } from './mocks'

describe('Actions: addChildren', () => {
  beforeEach(() => {
    globalMocks.log.mockClear()
  })
  
  it('should add children', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleComponent_: 'text', id: 'text', value: 'Hello World! '}
    const expected = Tree.clone(mock)
    const content = Tree.findById(expected, 'content')!
    content.children!.push(newContent)
  
    addChildren({
      action: {
        _beagleAction_: 'beagle:addChildren',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: Tree.findById(mock, 'button')!,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doFullRender).toHaveBeenCalledWith(content, content.id)
  })

  it('should append children', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleComponent_: 'text', id: 'text', value: 'Hello World! '}
    const expected = Tree.clone(mock)
    const content = Tree.findById(expected, 'content')!
    content.children!.push(newContent)
  
    addChildren({
      action: {
        _beagleAction_: 'beagle:addChildren',
        mode: 'append',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: Tree.findById(mock, 'button')!,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doFullRender).toHaveBeenCalledWith(content, content.id)
  })

  it('should prepend children', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleComponent_: 'text', id: 'text', value: 'Hello World! '}
    const expected = Tree.clone(mock)
    const content = Tree.findById(expected, 'content')!
    content.children!.unshift(newContent)
  
    addChildren({
      action: {
        _beagleAction_: 'beagle:addChildren',
        mode: 'prepend',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: Tree.findById(mock, 'button')!,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doFullRender).toHaveBeenCalledWith(content, content.id)
  })

  it('should replace children', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleComponent_: 'text', id: 'text', value: 'Hello World! '}
    const expected = Tree.clone(mock)
    const content = Tree.findById(expected, 'content')!
    content.children = [newContent]
  
    addChildren({
      action: {
        _beagleAction_: 'beagle:addChildren',
        mode: 'replace',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: Tree.findById(mock, 'button')!,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doFullRender).toHaveBeenCalledWith(content, content.id)
  })

  it('should warn and not update view when component is not found', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleComponent_: 'text', id: 'text', value: 'Hello World! '}
  
    addChildren({
      action: {
        _beagleAction_: 'beagle:addChildren',
        componentId: 'blah',
        value: [newContent],
      },
      beagleView,
      element: Tree.findById(mock, 'button')!,
      executeAction: jest.fn(),
    })

    expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(String))
    expect(beagleView.getRenderer().doFullRender).not.toHaveBeenCalled()
  })

  it('should complete action even if mode is in UpperCase', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleComponent_: 'text', id: 'text', value: 'Hello World! '}
    const expected = Tree.clone(mock)
    const content = Tree.findById(expected, 'content')!
    content.children!.unshift(newContent)
  
    addChildren({
      action: {
        _beagleAction_: 'beagle:addChildren',
        //@ts-ignore
        mode: 'PREPEND',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: Tree.findById(mock, 'button')!,
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doFullRender).toHaveBeenCalledWith(content, content.id)
  })
})
