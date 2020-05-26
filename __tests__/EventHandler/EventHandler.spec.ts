import { unmockDefaultActions } from './mockDefaultActions'
import createEventHandler from '../../src/EventHandler'
import { findById } from '../../src/utils/tree-reading'
import { clone } from '../../src/utils/tree-manipulation'
import { createContainerWithAction, createModalMock } from './mocks'
import { createBeagleViewMock } from '../test-utils'
import defaultActionHandlers from '../../src/actions'
import { ActionHandlerParams, BeagleAction } from '../../src/actions/types'
import { BeagleUIElement, BeagleView } from '../../src/types'

interface ActionHandlerExpectation {
  handler: jest.Mock,
  times?: number,
  action: BeagleAction,
  element: BeagleUIElement,
  beagleView: BeagleView,
  callIndex?: number,
}

function expectActionHandlerToHaveBeenCalled({
  handler,
  times = 1,
  action,
  element,
  beagleView,
  callIndex = 0,
}: ActionHandlerExpectation) {
  expect(handler).toHaveBeenCalledTimes(times)
  const handlerParams = handler.mock.calls[callIndex][0] as ActionHandlerParams
  expect(handlerParams.action).toEqual(action)
  expect(handlerParams.eventContextHierarchy instanceof Array).toBe(true)
  expect(handlerParams.element).toEqual(element)
  expect(handlerParams.beagleView).toBe(beagleView)
  expect(typeof handlerParams.handleAction).toBe('function')
}

describe('EventHandler', () => {
  afterAll(unmockDefaultActions)

  it('should not alter tree passed as parameter', () => {
    const eventHandler = createEventHandler({}, createBeagleViewMock())
    const mock = createContainerWithAction('onInit')
    const originalTree = clone(mock)
    eventHandler.interpretEventsInTree(mock)
    expect(mock).toEqual(originalTree)
  })

  it('should deserialize BeagleAction into function', () => {
    const eventHandler = createEventHandler({}, createBeagleViewMock())
    const mock = createContainerWithAction('onInit')
    const treeWithFunction = eventHandler.interpretEventsInTree(mock)
    expect(typeof treeWithFunction.onInit).toBe('function')
  })

  it('should call new function and trigger action handler (single BeagleAction)', () => {
    const beagleView = createBeagleViewMock()
    const eventHandler = createEventHandler({}, beagleView)
    const action = { _beagleAction_: 'beagle:alert', message: 'test' }
    const mock = createContainerWithAction('onInit', action)
    const treeWithFunction = eventHandler.interpretEventsInTree(mock)

    treeWithFunction.onInit()

    const alert = defaultActionHandlers['beagle:alert'] as jest.Mock
    expectActionHandlerToHaveBeenCalled({
      handler: alert,
      action,
      beagleView,
      element: treeWithFunction,
    })
    alert.mockClear()
  })

  it('should deserialize an array of BeagleActions into a single function', () => {
    const eventHandler = createEventHandler({}, createBeagleViewMock())
    const actions = [
      { _beagleAction_: 'beagle:alert', message: 'hello' },
      { _beagleAction_: 'beagle:alert', message: 'world' },
      { _beagleAction_: 'beagle:setContext', value: 'hello world!' },
      { _beagleAction_: 'beagle:openExternalURL', url: 'http://hello.world.com' },
    ]
    const mock = createContainerWithAction('onInit', actions)
    const treeWithFunction = eventHandler.interpretEventsInTree(mock)
    expect(typeof treeWithFunction.onInit).toBe('function')
  })

  it('should call new function and trigger action handlers (array of BeagleAction)', () => {
    const beagleView = createBeagleViewMock()
    const eventHandler = createEventHandler({}, beagleView)
    const actions = [
      { _beagleAction_: 'beagle:alert', message: 'hello' },
      { _beagleAction_: 'beagle:alert', message: 'world' },
      { _beagleAction_: 'beagle:setContext', value: 'hello world!' },
      { _beagleAction_: 'beagle:openExternalURL', url: 'http://hello.world.com' },
    ]
    const mock = createContainerWithAction('onInit', actions)
    const treeWithFunction = eventHandler.interpretEventsInTree(mock)
  
    treeWithFunction.onInit()
  
    const alert = defaultActionHandlers['beagle:alert'] as jest.Mock
    expectActionHandlerToHaveBeenCalled({
      handler: alert,
      times: 2,
      action: actions[0],
      beagleView,
      element: treeWithFunction,
    })
    expectActionHandlerToHaveBeenCalled({
      handler: alert,
      times: 2,
      action: actions[1],
      callIndex: 1,
      beagleView,
      element: treeWithFunction,
    })
    alert.mockClear()

    const setContext = defaultActionHandlers['beagle:setContext'] as jest.Mock
    expectActionHandlerToHaveBeenCalled({
      handler: setContext,
      action: actions[2],
      beagleView,
      element: treeWithFunction,
    })
    setContext.mockClear()

    const openExternalURL = defaultActionHandlers['beagle:openExternalURL'] as jest.Mock
    expectActionHandlerToHaveBeenCalled({
      handler: openExternalURL,
      action: actions[3],
      beagleView,
      element: treeWithFunction,
    })
    openExternalURL.mockClear()
  })

  it('should create implicit context when function is called passing a parameter', () => {
    const eventHandler = createEventHandler({}, createBeagleViewMock())
    const action = { _beagleAction_: 'beagle:alert', message: 'test' }
    const mock = createContainerWithAction('onInit', action)
    const treeWithFunction = eventHandler.interpretEventsInTree(mock)
    
    const event = { name: 'Beagle', lastName: 'Mockerson' }
    treeWithFunction.onInit(event)

    const alert = defaultActionHandlers['beagle:alert'] as jest.Mock
    expect(alert).toHaveBeenCalledWith(
      expect.objectContaining({
        eventContextHierarchy: [{ id: 'onInit', value: event }]
      })
    )
    alert.mockClear()
  })

  it('should replace bindings when handling an action', () => {
    const eventHandler = createEventHandler({}, createBeagleViewMock())
    const action = { _beagleAction_: 'beagle:alert', message: '${test}' }
    const mock = createContainerWithAction('onInit', action)
    mock._context_ = { id: 'test', value: 'Hello World!' }
    const treeWithFunction = eventHandler.interpretEventsInTree(mock)
    
    treeWithFunction.onInit()

    const alert = defaultActionHandlers['beagle:alert'] as jest.Mock
    expect(alert).toHaveBeenCalledWith(
      expect.objectContaining({
        action: { _beagleAction_: 'beagle:alert', message: 'Hello World!' }
      })
    )
    alert.mockClear()
  })

  it('should handle custom action', () => {
    const beagleView = createBeagleViewMock()
    const customHandlers = { myCustomAction: jest.fn() }
    const eventHandler = createEventHandler(customHandlers, beagleView)
    const action = { _beagleAction_: 'myCustomAction', value: 'test' }
    const mock = createContainerWithAction('onInit', action)
    const treeWithFunction = eventHandler.interpretEventsInTree(mock)

    treeWithFunction.onInit()

    expectActionHandlerToHaveBeenCalled({
      handler: customHandlers.myCustomAction,
      action,
      beagleView,
      element: treeWithFunction,
    })
  })

  it('should replace default action with custom action and warn about replacement', () => {
    const originalWarn = console.warn
    console.warn = jest.fn()

    const beagleView = createBeagleViewMock()
    const customHandlers = { 'beagle:alert': jest.fn() }

    const eventHandler = createEventHandler(customHandlers, beagleView)
    expect(console.warn).toHaveBeenCalled()
    console.warn = originalWarn
  
    const action = { _beagleAction_: 'beagle:alert', message: 'test' }
    const mock = createContainerWithAction('onInit', action)
    const treeWithFunction = eventHandler.interpretEventsInTree(mock)

    treeWithFunction.onInit()

    expect(defaultActionHandlers['beagle:alert']).not.toHaveBeenCalled()
    expectActionHandlerToHaveBeenCalled({
      handler: customHandlers['beagle:alert'],
      action,
      beagleView,
      element: treeWithFunction,
    })
  })

  it('should warn if action handler doesn\'t exist', () => {
    const eventHandler = createEventHandler({}, createBeagleViewMock())
    const action = { _beagleAction_: 'blah', value: 'test' }
    const mock = createContainerWithAction('onInit', action)
    const treeWithFunction = eventHandler.interpretEventsInTree(mock)
  
    const originalWarn = console.warn
    console.warn = jest.fn()
    treeWithFunction.onInit()
    expect(console.warn).toHaveBeenCalled()
    console.warn = originalWarn
  })

  it('should deserialize all actions in ui tree', () => {
    const eventHandler = createEventHandler({}, createBeagleViewMock())
    const modalMock = createModalMock()
    const treeWithFunctions = eventHandler.interpretEventsInTree(modalMock)

    const btnOpenModal = findById(treeWithFunctions, 'btn-open-modal')
    const modal = findById(treeWithFunctions, 'modal')
    const modalContent = findById(treeWithFunctions, 'modal-content')

    expect(typeof btnOpenModal.onPress).toBe('function')
    expect(typeof modal.onClose).toBe('function')
    expect(typeof modalContent.onInit).toBe('function')
  })
})
