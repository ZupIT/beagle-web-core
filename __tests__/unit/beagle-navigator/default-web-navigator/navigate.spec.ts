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

import DefaultWebNavigator from 'beagle-navigator/default-web-navigator'
import { BeagleView as BeagleViewType } from 'beagle-view/types'
import { DefaultWebNavigatorItem } from 'beagle-navigator/types'
import {
  createBeagleServiceMock,
  createDoubleStackMock,
} from '../../old-structure/utils/test-utils'

describe('DefaultWebNavigator: navigation method as an alternative call', () => {
  const widgetBuilder = (v: BeagleViewType) => v
  const service = createBeagleServiceMock()
  const dsMock = createDoubleStackMock<DefaultWebNavigatorItem<BeagleViewType>>()
  const navigator = DefaultWebNavigator.create(service, widgetBuilder, dsMock)
  navigator.pushStack = jest.fn()
  navigator.pushView = jest.fn()
  navigator.popView = jest.fn()
  navigator.popStack = jest.fn()
  navigator.popToView = jest.fn()
  navigator.resetApplication = jest.fn()
  navigator.resetStack = jest.fn()

  it('should push stack', () => {
    navigator.navigate('pushStack', '/test', 'myController')
    expect(navigator.pushStack).toHaveBeenCalledWith('/test', 'myController')
  })

  it('should push view', () => {
    navigator.navigate('pushView', '/test')
    const pushViewMock = navigator.pushView as jest.Mock
    expect(pushViewMock.mock.calls[0][0]).toBe('/test')
  })

  it('should pop stack', () => {
    navigator.navigate('popStack')
    expect(navigator.popStack).toHaveBeenCalled()
  })

  it('should pop view', () => {
    navigator.navigate('popView')
    expect(navigator.popView).toHaveBeenCalled()
  })

  it('should pop to view', () => {
    navigator.navigate('popToView', '/test')
    const popToViewMock = navigator.popToView as jest.Mock
    expect(popToViewMock.mock.calls[0][0]).toBe('/test')
  })

  it('should reset stack', () => {
    navigator.navigate('resetStack', '/test', 'myController')
    expect(navigator.resetStack).toHaveBeenCalledWith('/test', 'myController')
  })

  it('should reset application', () => {
    navigator.navigate('resetApplication', '/test', 'myController')
    expect(navigator.resetApplication).toHaveBeenCalledWith('/test', 'myController')
  })
})
