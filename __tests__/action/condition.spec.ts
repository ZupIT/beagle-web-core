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

import actions from 'action'
import condition from 'action/condition'
import { ConditionAction } from 'action/types'
import { BeagleView } from 'beagle-view/types'

describe('Action: condition', () => {
  const element = { _beagleComponent_: 'beagle:button', id: 'btn' }
  const onTrue = [{ _beagleAction_: 'custom:onTrue' }]
  const onFalse = [{ _beagleAction_: 'custom:onFalse' }]
  const trueAction: ConditionAction = {
    _beagleAction_: 'beagle:condition',
    condition: true,
    onFalse,
    onTrue,
  }
  const beagleView = {} as BeagleView
  const executeAction = jest.fn()

  beforeEach(() => {
    executeAction.mockClear()
  })

  it('should exist', () => {
    expect(actions['beagle:condition']).toBe(condition)
  })

  it('should run onTrue, but not onFalse', () => {
    condition({ action: trueAction, element, beagleView, executeAction })
    expect(executeAction).toHaveBeenCalledTimes(1)
    expect(executeAction).toHaveBeenCalledWith(onTrue)
  })

  it('should run onFalse, but not onTrue', () => {
    const action = { ...trueAction, condition: false }
    condition({ action, element, beagleView, executeAction })
    expect(executeAction).toHaveBeenCalledTimes(1)
    expect(executeAction).toHaveBeenCalledWith(onFalse)
  })

  it('should do nothing when resolved to true and no onTrue exists', () => {
    const action = { ...trueAction, onTrue: undefined }
    condition({ action, element, beagleView, executeAction })
    expect(executeAction).toHaveBeenCalledTimes(0)
  })

  it('should do nothing when resolved to false and no onFalse exists', () => {
    const action = { ...trueAction, condition: false, onFalse: undefined }
    condition({ action, element, beagleView, executeAction })
    expect(executeAction).toHaveBeenCalledTimes(0)
  })
})
