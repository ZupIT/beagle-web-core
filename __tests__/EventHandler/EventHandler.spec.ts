/**
 * FIXME: should be refactored according to Renderer/Action. Should decouple 'Context.ts' and
 * 'Tree.ts' from this.
 */

import { unmockDefaultActions } from './mockDefaultActions'
import Context from '../../src/Renderer/Context'
import Expression from '../../src/Renderer/Expression'
import Action from '../../src/Renderer/Action'
import Tree from '../../src/utils/tree'
import { findById } from '../../src/utils/tree-reading'
import { clone } from '../../src/utils/tree-manipulation'
import { createContainerWithAction, createModalMock } from './mocks'
import { createBeagleViewMock } from '../test-utils'
import defaultActionHandlers from '../../src/actions'
import { ActionHandlerParams, BeagleAction } from '../../src/actions/types'
import { IdentifiableBeagleUIElement, BeagleUIElement, BeagleView } from '../../src/types'

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
  expect(handlerParams.element).toEqual(element)
  expect(handlerParams.beagleView).toBe(beagleView)
  expect(typeof handlerParams.executeAction).toBe('function')
}

function interpretEventsInTree(tree: IdentifiableBeagleUIElement, beagleView: BeagleView) {
  const contexts = Context.evaluate(tree)
  Tree.forEach(tree, (component) => {
    Action.deserialize({
      component,
      contextHierarchy: contexts[component.id],
      beagleView,
      actionHandlers: defaultActionHandlers,
    })
  })
}

describe('EventHandler', () => {
  afterAll(unmockDefaultActions)

  it('should deserialize BeagleAction into function', () => {
    const beagleView = createBeagleViewMock()
    const mock = createContainerWithAction('onInit')
    interpretEventsInTree(mock, beagleView)
    expect(typeof mock.onInit).toBe('function')
  })

  it('should call new function and trigger action handler (single BeagleAction)', () => {
    const beagleView = createBeagleViewMock()
    const action = { _beagleAction_: 'beagle:alert', message: 'test' }
    const mock = createContainerWithAction('onInit', action)
    interpretEventsInTree(mock, beagleView)

    mock.onInit()

    const alert = defaultActionHandlers['beagle:alert'] as jest.Mock
    expectActionHandlerToHaveBeenCalled({
      handler: alert,
      action,
      beagleView,
      element: mock,
    })
    alert.mockClear()
  })

  it('should deserialize an array of BeagleActions into a single function', () => {
    const beagleView = createBeagleViewMock()
    const actions = [
      { _beagleAction_: 'beagle:alert', message: 'hello' },
      { _beagleAction_: 'beagle:alert', message: 'world' },
      { _beagleAction_: 'beagle:setContext', value: 'hello world!' },
      { _beagleAction_: 'beagle:openExternalURL', url: 'http://hello.world.com' },
    ]
    const mock = createContainerWithAction('onInit', actions)
    interpretEventsInTree(mock, beagleView)
    expect(typeof mock.onInit).toBe('function')
  })

  it('should call new function and trigger action handlers (array of BeagleAction)', () => {
    const beagleView = createBeagleViewMock()
    const actions = [
      { _beagleAction_: 'beagle:alert', message: 'hello' },
      { _beagleAction_: 'beagle:alert', message: 'world' },
      { _beagleAction_: 'beagle:setContext', value: 'hello world!' },
      { _beagleAction_: 'beagle:openExternalURL', url: 'http://hello.world.com' },
    ]
    const mock = createContainerWithAction('onInit', actions)
    interpretEventsInTree(mock, beagleView)
  
    mock.onInit()
  
    const alert = defaultActionHandlers['beagle:alert'] as jest.Mock
    expectActionHandlerToHaveBeenCalled({
      handler: alert,
      times: 2,
      action: actions[0],
      beagleView,
      element: mock,
    })
    expectActionHandlerToHaveBeenCalled({
      handler: alert,
      times: 2,
      action: actions[1],
      callIndex: 1,
      beagleView,
      element: mock,
    })
    alert.mockClear()

    const setContext = defaultActionHandlers['beagle:setContext'] as jest.Mock
    expectActionHandlerToHaveBeenCalled({
      handler: setContext,
      action: actions[2],
      beagleView,
      element: mock,
    })
    setContext.mockClear()

    const openExternalURL = defaultActionHandlers['beagle:openExternalURL'] as jest.Mock
    expectActionHandlerToHaveBeenCalled({
      handler: openExternalURL,
      action: actions[3],
      beagleView,
      element: mock,
    })
    openExternalURL.mockClear()
  })

  it('should create implicit context when function is called passing a parameter', () => {
    const originalResolve = Expression.resolveForAction
    Expression.resolveForAction = jest.fn()
    
    const beagleView = createBeagleViewMock()
    const action = {
      _beagleAction_: 'beagle:alert',
      message: 'hello @{onInit.name} @{onInit.lastName}',
    }
    const mock = createContainerWithAction('onInit', action)
    interpretEventsInTree(mock, beagleView)
    const event = { name: 'Beagle', lastName: 'Mockerson' }
    mock.onInit(event)
  
    expect(Expression.resolveForAction).toHaveBeenCalledWith(
      action,
      [{ id: 'onInit', value: event }],
    )

    Expression.resolveForAction = originalResolve
    const alert = defaultActionHandlers['beagle:alert'] as jest.Mock
    alert.mockClear()
  })

  it('should replace bindings when handling an action', () => {
    const beagleView = createBeagleViewMock()
    const action = { _beagleAction_: 'beagle:alert', message: '@{test}' }
    const mock = createContainerWithAction('onInit', action)
    mock.context = { id: 'test', value: 'Hello World!' }
    interpretEventsInTree(mock, beagleView)
    
    mock.onInit()

    const alert = defaultActionHandlers['beagle:alert'] as jest.Mock
    expect(alert).toHaveBeenCalledWith(
      expect.objectContaining({
        action: { _beagleAction_: 'beagle:alert', message: 'Hello World!' }
      })
    )
    alert.mockClear()
  })

  it('should handle custom action', () => {
    // todo
  })

  it('should replace default action with custom action and warn about replacement', () => {
    // todo
  })

  it('should warn if action handler doesn\'t exist', () => {
    const beagleView = createBeagleViewMock()
    const action = { _beagleAction_: 'blah', value: 'test' }
    const mock = createContainerWithAction('onInit', action)
    interpretEventsInTree(mock, beagleView)
  
    const originalWarn = console.warn
    console.warn = jest.fn()
    mock.onInit()
    expect(console.warn).toHaveBeenCalled()
    console.warn = originalWarn
  })

  it('should deserialize all actions in ui tree', () => {
    const beagleView = createBeagleViewMock()
    const modalMock = createModalMock()
    interpretEventsInTree(modalMock, beagleView)

    const btnOpenModal = findById(modalMock, 'btn-open-modal')
    const modal = findById(modalMock, 'modal')
    const modalContent = findById(modalMock, 'modal-content')

    expect(typeof btnOpenModal.onPress).toBe('function')
    expect(typeof modal.onClose).toBe('function')
    expect(typeof modalContent.onInit).toBe('function')
  })

  // todo: re-implement case-insensitivity
  // it('should handle action with upper letter', () => {
  //   const beagleView = createBeagleViewMock()
  //   const eventHandler = createEventHandler({},beagleView)
  //   const action = { _beagleAction_: 'beagle:aLErt', value: 'test' }
  //   const mock = createContainerWithAction('onInit', action)
  //   const treeWithFunction = eventHandler.interpretEventsInTree(mock)
  //   const alertEvent = defaultActionHandlers['beagle:alert'] as jest.Mock

  //   treeWithFunction.onInit()

  //   expectActionHandlerToHaveBeenCalled({
  //     handler: alertEvent,
  //     action,
  //     beagleView,
  //     element: treeWithFunction,
  //   })
  // })
})
