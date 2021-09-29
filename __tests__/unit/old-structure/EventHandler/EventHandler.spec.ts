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

/**
 * FIXME: should be refactored according to Renderer/Action. Should decouple 'Context.ts' and
 * 'Tree.ts' from this.
 */

import { unmockDefaultActions } from './mockDefaultActions'
import Context from 'beagle-view/render/context'
import Expression from 'beagle-view/render/expression'
import Action from 'beagle-view/render/action'
import Tree from 'beagle-tree'
import defaultActionHandlers from 'action'
import defaultOperationHandlers from 'operation'
import { ActionHandlerParams, BeagleAction } from 'action/types'
import BeagleService from 'service/beagle-service'
import { IdentifiableBeagleUIElement, BeagleUIElement } from 'beagle-tree/types'
import { BeagleView as BeagleViewType } from 'beagle-view/types'
import BeagleView from 'beagle-view'
import { createContainerWithAction, createModalMock, listViewWithAction } from './mocks'
import { createBeagleViewMock } from '../utils/test-utils'

interface ActionHandlerExpectation {
  handler: jest.Mock,
  times?: number,
  action: BeagleAction,
  element: BeagleUIElement,
  beagleView: BeagleViewType,
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

function interpretEventsInTree(tree: IdentifiableBeagleUIElement, beagleView: BeagleViewType) {
  const contexts = Context.evaluate(tree)
  Tree.forEach(tree, (component) => {
    Action.deserialize({
      component,
      contextHierarchy: contexts[component.id],
      beagleView,
      actionHandlers: defaultActionHandlers,
      operationHandlers: defaultOperationHandlers
    })
  })
}

describe('EventHandler', () => {
  beforeEach(() => {
    globalMocks.log.mockClear()
  })

  afterAll(unmockDefaultActions)

  it('should deserialize BeagleAction into function', () => {
    const beagleView = createBeagleViewMock()
    const mock = createContainerWithAction('onInit')
    interpretEventsInTree(mock, beagleView)
    expect(typeof mock.onInit).toBe('function')
  })

  it('Should NOT resolve expressions in sub-actions when creating action record with expressions', () => {
    const beagleView = createBeagleViewMock()
    beagleView.getNavigator()!.getCurrentRoute = () => 'test'
    const beagleAnalytics = beagleView.getBeagleService().analyticsService
    spyOn(beagleAnalytics, 'createActionRecord').and.callThrough()

    const beagleComponent: IdentifiableBeagleUIElement = {
      _beagleComponent_: 'beagle:button',
      id: 'someId',
      context: {
        id: 'context',
        value: {
          query: 'test',
          message: 'message'
        }
      },
      onPress: {
        _beagleAction_: "beagle:sendRequest",
        onSuccess: [
          {
            _beagleAction_: "beagle:alert",
            message: " @{eq(context.query, 'test')}"
          }
        ],
        analytics: {
          attributes: ["condition"]
        },
        condition: "@{eq(context.query, 'test')}"
      }
    }

    const resolvedComponent = {
      action: {
        _beagleAction_: "beagle:sendRequest",
        analytics: {
          attributes: [
            "condition",
          ],
        },
        condition: true,
        onSuccess: [
          {
            _beagleAction_: "beagle:alert",
            message: " @{eq(context.query, 'test')}",
          },
        ],

      },
      component: {
        _beagleComponent_: "beagle:button",
        context: {
          id: "context",
          value: {
            query: "test",
            message: "message"
          },
        },
        id: "someId",
        onPress: expect.any(Function),
      },
      eventName: "onPress",
      platform: "Test",
      route:  "test",
    }

    interpretEventsInTree(beagleComponent, beagleView)
    beagleComponent.onPress()

    expect(beagleAnalytics.createActionRecord).toBeCalledWith(resolvedComponent)
  })

  it('should resolve expressions and call analytics', () => {
    const beagleView = createBeagleViewMock()
    beagleView.getNavigator()!.getCurrentRoute = () => 'test'
    const beagleAnalytics = beagleView.getBeagleService().analyticsService
    spyOn(beagleAnalytics, 'createActionRecord').and.callThrough()

    const beagleComponent: IdentifiableBeagleUIElement = {
      _beagleComponent_: 'beagle:button',
      id: 'someId',
      context: {
        id: 'context',
        value: {
          query: 'test'
        }
      },
      onPress: {
        _beagleAction_: "beagle:condition",
        analytics: {
          attributes: ["condition"]
        },
        condition: "@{eq(context.query, 'test')}"
      }
    }

    const resolvedComponent = {
      action: {
        _beagleAction_: "beagle:condition",
        analytics: {
          attributes: [
            "condition",
          ],
        },
        condition: true,
      },
      component: {
        _beagleComponent_: "beagle:button",
        context: {
          id: "context",
          value: {
            query: "test",
          },
        },
        id: "someId",
        onPress: expect.any(Function),
      },
      eventName: "onPress",
      platform: "Test",
      route: "test",
    }

    interpretEventsInTree(beagleComponent, beagleView)
    beagleComponent.onPress()

    expect(beagleAnalytics.createActionRecord).toBeCalledWith(resolvedComponent)


  })

  it('should not deserialize action if received data is a component', () => {
    const beagleView = createBeagleViewMock()
    const mock = listViewWithAction
    interpretEventsInTree(mock, beagleView)
    expect(typeof mock.template.onInit).not.toBe('function')
    expect(typeof mock.template.onInit.onSuccess).not.toBe('function')
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
      defaultOperationHandlers
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

  // fixme: this is testing too many things. This should be moved and test only the BeagleService.
  it('should handle custom action', async () => {
    const myActionHandler = jest.fn()
    const service = BeagleService.create({
      baseUrl: '',
      components: {},
      customActions: {
        'custom:myAction': myActionHandler,
      }
    })

    const beagleView = BeagleView.create(service)
    const action = { _beagleAction_: 'custom:myAction', value: 'test' }
    const mock = createContainerWithAction('onInit', action)
    await new Promise((resolve: (value?: unknown) => void) => {
      beagleView.onChange(view => {
        view.onInit()
        resolve()
      })
      beagleView.getRenderer().doFullRender(mock)
    })

    expect(myActionHandler).toHaveBeenCalledWith(
      expect.objectContaining({ action })
    )
  })

  it('should warn if action handler doesn\'t exist', () => {
    const beagleView = createBeagleViewMock()
    const action = { _beagleAction_: 'blah', value: 'test' }
    const mock = createContainerWithAction('onInit', action)
    interpretEventsInTree(mock, beagleView)

    mock.onInit()
    expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(String))
  })

  it('should deserialize all actions in ui tree', () => {
    const beagleView = createBeagleViewMock()
    const modalMock = createModalMock()
    interpretEventsInTree(modalMock, beagleView)

    const btnOpenModal = Tree.findById(modalMock, 'btn-open-modal')!
    const modal = Tree.findById(modalMock, 'modal')!
    const modalContent = Tree.findById(modalMock, 'modal-content')!

    expect(typeof btnOpenModal.onPress).toBe('function')
    expect(typeof modal.onClose).toBe('function')
    expect(typeof modalContent.onInit).toBe('function')
  })

  it('should handle action with upper letter', () => {
    const beagleView = createBeagleViewMock()
    const action = { _beagleAction_: 'beagle:aLErt', value: 'test' }
    const mock = createContainerWithAction('onInit', action)
    interpretEventsInTree(mock, beagleView)
    const alertEvent = defaultActionHandlers['beagle:alert'] as jest.Mock

    mock.onInit()

    expectActionHandlerToHaveBeenCalled({
      handler: alertEvent,
      action,
      beagleView,
      element: mock,
    })
  })
})
