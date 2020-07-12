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
      eventContextHierarchy: [],
      handleAction,
    })

    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({ action: onPressOk }))
    unmockDialogs()
  })

  it('should run onPressOk with multiple actions', () => {
    const mock = { _beagleComponent_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs(true)
    const handleAction = jest.fn()
    const onPressOk = [
      { _beagleAction_: 'test-ok 1' },
      { _beagleAction_: 'test-ok 2' },
      { _beagleAction_: 'test-ok 3' },
    ]
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
      eventContextHierarchy: [],
      handleAction,
    })

    expect(handleAction).toHaveBeenCalledTimes(3)
    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({ action: onPressOk[0] }))
    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({ action: onPressOk[1] }))
    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({ action: onPressOk[2] }))
    unmockDialogs()
  })

  it('should run onPressCancel', () => {
    const mock = { _beagleComponent_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs(false)
    const handleAction = jest.fn()
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
      eventContextHierarchy: [],
      handleAction,
    })

    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({ action: onPressCancel }))
    unmockDialogs()
  })

  it('should run onPressCancel with multiple actions', () => {
    const mock = { _beagleComponent_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs(false)
    const handleAction = jest.fn()
    const onPressOk = { _beagleAction_: 'test-ok' }
    const onPressCancel = [
      { _beagleAction_: 'test-cancel 1' },
      { _beagleAction_: 'test-cancel 2' },
      { _beagleAction_: 'test-cancel 3' },
    ]

    confirm({
      action: {
        _beagleAction_: 'beagle:confirm',
        message: 'Would you like to continue?',
        onPressOk,
        onPressCancel,
      },
      beagleView: createBeagleViewMock({ getTree: () => mock }),
      element: mock,
      eventContextHierarchy: [],
      handleAction,
    })

    expect(handleAction).toHaveBeenCalledTimes(3)
    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({ action: onPressCancel[0] }))
    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({ action: onPressCancel[1] }))
    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({ action: onPressCancel[2] }))
    unmockDialogs()
  })
})
