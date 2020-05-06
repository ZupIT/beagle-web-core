import alert from '../../src/actions/alert'
import { createBeagleViewMock, mockSystemDialogs } from '../test-utils'

describe('Actions: alert', () => {
  it('should show alert message', () => {
    const mock = { _beagleType_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs()

    alert({
      action: {
        _actionType_: 'alert',
        message: 'Hello World!',
      },
      beagleView: createBeagleViewMock({ getTree: () => mock }),
      element: mock,
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    })

    expect(window.alert).toHaveBeenCalledWith('Hello World!')
    unmockDialogs()
  })

  it('should run onPressOk', () => {
    const mock = { _beagleType_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs()
    const handleAction = jest.fn()
    const onPressOk = { _actionType_: 'test' }

    alert({
      action: {
        _actionType_: 'alert',
        message: 'Hello World!',
        onPressOk,
      },
      beagleView: createBeagleViewMock({ getTree: () => mock }),
      element: mock,
      eventContextHierarchy: [],
      handleAction,
    })

    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({ action: onPressOk }))
    unmockDialogs()
  })
})
