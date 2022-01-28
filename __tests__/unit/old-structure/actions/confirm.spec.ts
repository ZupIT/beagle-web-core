/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import confirm from 'action/confirm'
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
