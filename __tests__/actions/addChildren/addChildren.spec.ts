import addChildren from '../../../src/actions/addChildren'
import { findById } from '../../../src/utils/tree-reading'
import { clone } from '../../../src/utils/tree-manipulation'
import { createBeagleViewMock } from '../../test-utils'
import { createSimpleMock } from './mocks'

describe('Actions: addChildren', () => {
  it('should add children', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleType_: 'text', id: 'text', value: 'Hello World! '}
    const expected = clone(mock)
    const content = findById(expected, 'content')
    content.children.push(newContent)
  
    addChildren({
      action: {
        _actionType_: 'addChildren',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: findById(mock, 'button'),
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    })

    expect(beagleView.updateWithTree).toHaveBeenCalledWith({ sourceTree: expected })
  })

  it('should append children', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleType_: 'text', id: 'text', value: 'Hello World! '}
    const expected = clone(mock)
    const content = findById(expected, 'content')
    content.children.push(newContent)
  
    addChildren({
      action: {
        _actionType_: 'addChildren',
        mode: 'append',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: findById(mock, 'button'),
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    })

    expect(beagleView.updateWithTree).toHaveBeenCalledWith({ sourceTree: expected })
  })

  it('should prepend children', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleType_: 'text', id: 'text', value: 'Hello World! '}
    const expected = clone(mock)
    const content = findById(expected, 'content')
    content.children.unshift(newContent)
  
    addChildren({
      action: {
        _actionType_: 'addChildren',
        mode: 'prepend',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: findById(mock, 'button'),
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    })

    expect(beagleView.updateWithTree).toHaveBeenCalledWith({ sourceTree: expected })
  })

  it('should replace children', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleType_: 'text', id: 'text', value: 'Hello World! '}
    const expected = clone(mock)
    const content = findById(expected, 'content')
    content.children = [newContent]
  
    addChildren({
      action: {
        _actionType_: 'addChildren',
        mode: 'replace',
        componentId: 'content',
        value: [newContent],
      },
      beagleView,
      element: findById(mock, 'button'),
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    })

    expect(beagleView.updateWithTree).toHaveBeenCalledWith({ sourceTree: expected })
  })

  it('should warn and not update view when component is not found', () => {
    const mock = createSimpleMock()
    const beagleView = createBeagleViewMock({ getTree: () => mock })
    const newContent = { _beagleType_: 'text', id: 'text', value: 'Hello World! '}
    const originalWarn = console.warn
    console.warn = jest.fn()
  
    addChildren({
      action: {
        _actionType_: 'addChildren',
        componentId: 'blah',
        value: [newContent],
      },
      beagleView,
      element: findById(mock, 'button'),
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    })

    expect(console.warn).toHaveBeenCalled()
    console.warn = originalWarn
    expect(beagleView.updateWithTree).not.toHaveBeenCalled()
  })
})
