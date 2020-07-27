import confirm from '../../src/actions/confirm'
import { createBeagleViewMock, mockSystemDialogs } from '../utils/test-utils'

describe('Actions: beagle:confirm', () => {
  it('should show confirm message', () => {
    const mock = { _beagleComponent_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs()

    confirm({
      action: {
        _beagleAction_: 'beagle:confirm',
        message: 'Would you like to continue?',
      },
      beagleView: createBeagleViewMock({ getTree: () => mock }),
      element: mock,
      executeAction: jest.fn(),
    })

    expect(window.confirm).toHaveBeenCalledWith('Would you like to continue?')
    unmockDialogs()
  })

  it('should run onPressOk', () => {
    const mock = { _beagleComponent_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs(true)
    const executeAction = jest.fn()
    const onPressOk = { _beagleAction_: 'test-ok' }
    const onPressCancel = { _beagleAction_: 'test-cancel' }

    confirm({
      action: {
        _beagleAction_: 'beagle:confirm',
        message: 'Would you like to continue?',
        onPressOk,
        onPressCancel,
      },
      beagleView: createBeagleViewMock({ getTree: () => mock }),
      element: mock,
      executeAction,
    })

    expect(executeAction).toHaveBeenCalledWith(onPressOk)
    unmockDialogs()
  })

  it('should run onPressCancel', () => {
    const mock = { _beagleComponent_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs(false)
    const executeAction = jest.fn()
    const onPressOk = { _beagleAction_: 'test-ok' }
    const onPressCancel = { _beagleAction_: 'test-cancel' }

    confirm({
      action: {
        _beagleAction_: 'beagle:confirm',
        message: 'Would you like to continue?',
        onPressOk,
        onPressCancel,
      },
      beagleView: createBeagleViewMock({ getTree: () => mock }),
      element: mock,
      executeAction,
    })

    expect(executeAction).toHaveBeenCalledWith(onPressCancel)
    unmockDialogs()
  })
})
