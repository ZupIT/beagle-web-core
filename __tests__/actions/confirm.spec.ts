import confirm from '../../src/actions/confirm'
import { createBeagleViewMock, mockSystemDialogs } from '../test-utils'

describe('Actions: confirm', () => {
  it('should show confirm message', () => {
    const mock = { _beagleComponent_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs()

    confirm({
      action: {
        _actionType_: 'confirm',
        message: 'Would you like to continue?',
      },
      beagleView: createBeagleViewMock({ getTree: () => mock }),
      element: mock,
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    })

    expect(window.confirm).toHaveBeenCalledWith('Would you like to continue?')
    unmockDialogs()
  })

  it('should run onPressOk', () => {
    const mock = { _beagleComponent_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs(true)
    const handleAction = jest.fn()
    const onPressOk = { _actionType_: 'test-ok' }
    const onPressCancel = { _actionType_: 'test-cancel' }

    confirm({
      action: {
        _actionType_: 'confirm',
        message: 'Would you like to continue?',
        onPressOk,
        onPressCancel,
      },
      beagleView: createBeagleViewMock({ getTree: () => mock }),
      element: mock,
      eventContextHierarchy: [],
      handleAction,
    })

    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({ action: onPressOk }))
    unmockDialogs()
  })

  it('should run onPressCancel', () => {
    const mock = { _beagleComponent_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs(false)
    const handleAction = jest.fn()
    const onPressOk = { _actionType_: 'test-ok' }
    const onPressCancel = { _actionType_: 'test-cancel' }

    confirm({
      action: {
        _actionType_: 'confirm',
        message: 'Would you like to continue?',
        onPressOk,
        onPressCancel,
      },
      beagleView: createBeagleViewMock({ getTree: () => mock }),
      element: mock,
      eventContextHierarchy: [],
      handleAction,
    })

    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({ action: onPressCancel }))
    unmockDialogs()
  })
})
