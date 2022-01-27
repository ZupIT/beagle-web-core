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

import alert from 'action/alert'
import { createBeagleViewMock, mockSystemDialogs } from '../utils/test-utils'

describe('Actions: alert', () => {
  it('should show alert message', () => {
    const mock = { _beagleComponent_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs()

    alert({
      action: {
        _beagleAction_: 'beagle:alert',
        message: 'Hello World!',
      },
      beagleView: createBeagleViewMock({ getTree: () => mock }),
      element: mock,
      executeAction: jest.fn(),
    })

    expect(window.alert).toHaveBeenCalledWith('Hello World!')
    unmockDialogs()
  })
  
  it('should show alert message as string for object', () => {
    const mock = { _beagleComponent_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs()
    const message = {hello:'Hello World!'}

    alert({
      action: {
        _beagleAction_: 'beagle:alert',
        message,
      },
      beagleView: createBeagleViewMock({ getTree: () => mock }),
      element: mock,
      executeAction: jest.fn(),
    })

    expect(window.alert).toHaveBeenCalledWith(JSON.stringify(message))
    unmockDialogs()
  })


  it('should run onPressOk', () => {
    const mock = { _beagleComponent_: 'container', id: 'container' }
    const unmockDialogs = mockSystemDialogs()
    const executeAction = jest.fn()
    const onPressOk = { _beagleAction_: 'test' }

    alert({
      action: {
        _beagleAction_: 'beagle:alert',
        message: 'Hello World!',
        onPressOk,
      },
      beagleView: createBeagleViewMock({ getTree: () => mock }),
      element: mock,
      executeAction,
    })

    expect(executeAction).toHaveBeenCalledWith(onPressOk)
    unmockDialogs()
  })
})
