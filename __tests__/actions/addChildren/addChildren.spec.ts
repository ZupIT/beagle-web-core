import addChildren from '../../../src/actions/addChildren'
import { findById } from '../../../src/utils/tree-reading'
import { clone } from '../../../src/utils/tree-manipulation'
import { createBeagleViewMock } from '../../utils/test-utils'
import { createSimpleMock } from './mocks'

describe('Actions: addChildren', () => {
  it('should add children', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleComponent_: 'text', id: 'text', value: 'Hello World! '}
    const expected = clone(mock)
    const content = findById(expected, 'content')
    content.children.push(newContent)
  
    addChildren({
      action: {
        _beagleAction_: 'beagle:addChildren',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: findById(mock, 'button'),
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doFullRender).toHaveBeenCalledWith(content, content.id)
  })

  it('should append children', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleComponent_: 'text', id: 'text', value: 'Hello World! '}
    const expected = clone(mock)
    const content = findById(expected, 'content')
    content.children.push(newContent)
  
    addChildren({
      action: {
        _beagleAction_: 'beagle:addChildren',
        mode: 'append',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: findById(mock, 'button'),
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doFullRender).toHaveBeenCalledWith(content, content.id)
  })

  it('should prepend children', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleComponent_: 'text', id: 'text', value: 'Hello World! '}
    const expected = clone(mock)
    const content = findById(expected, 'content')
    content.children.unshift(newContent)
  
    addChildren({
      action: {
        _beagleAction_: 'beagle:addChildren',
        mode: 'prepend',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: findById(mock, 'button'),
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doFullRender).toHaveBeenCalledWith(content, content.id)
  })

  it('should replace children', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleComponent_: 'text', id: 'text', value: 'Hello World! '}
    const expected = clone(mock)
    const content = findById(expected, 'content')
    content.children = [newContent]
  
    addChildren({
      action: {
        _beagleAction_: 'beagle:addChildren',
        mode: 'replace',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: findById(mock, 'button'),
      executeAction: jest.fn(),
    })

    expect(beagleView.getRenderer().doFullRender).toHaveBeenCalledWith(content, content.id)
  })

  it('should warn and not update view when component is not found', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleComponent_: 'text', id: 'text', value: 'Hello World! '}
    const originalWarn = console.warn
    console.warn = jest.fn()
  
    addChildren({
      action: {
        _beagleAction_: 'beagle:addChildren',
        componentId: 'blah',
        value: [newContent],
      },
      beagleView,
      element: findById(mock, 'button'),
      executeAction: jest.fn(),
    })

    expect(console.warn).toHaveBeenCalled()
    console.warn = originalWarn
    expect(beagleView.getRenderer().doFullRender).not.toHaveBeenCalled()
  })
})
