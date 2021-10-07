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
import DoubleStack from 'beagle-navigator/double-stack'
import {
  DefaultWebNavigatorItem,
} from 'beagle-navigator/types'
import {
  createBeagleServiceMock,
  createDoubleStackMock,
} from '../../old-structure/utils/test-utils'
import { createNewRouteTestSuit } from './utils'

describe('DefaultWebNavigator', () => {
  const service = createBeagleServiceMock()
  const widgetBuilder = (v: BeagleViewType) => v

  /*describe('Creation', () => {
    it('should create navigator', () => {
      // mock
      const originalDoubleStack = DoubleStack.create
      DoubleStack.create = jest.fn(() => createDoubleStackMock())
      // test
      DefaultWebNavigator.create(service, widgetBuilder)
      expect(DoubleStack.create).toHaveBeenCalledWith()
      // unmock
      DoubleStack.create = originalDoubleStack
    })
  })

  describe('Read operations', () => {
    it('should be empty', () => {
      const dsMock = createDoubleStackMock<DefaultWebNavigatorItem<BeagleViewType>>({
        isEmpty: () => true,
      })
      const navigator = DefaultWebNavigator.create(service, widgetBuilder, dsMock)
      expect(navigator.isEmpty()).toBe(true)
    })

    it('should not be empty', () => {
      const dsMock = createDoubleStackMock<DefaultWebNavigatorItem<BeagleViewType>>({
        isEmpty: () => false,
      })
      const navigator = DefaultWebNavigator.create(service, widgetBuilder, dsMock)
      expect(navigator.isEmpty()).toBe(false)
    })

    it('should get current route name', () => {
      const dsMock = createDoubleStackMock<DefaultWebNavigatorItem<BeagleViewType>>({
        getTopItem: () => ({ screen: { id: '/test' } }),
      })
      const navigator = DefaultWebNavigator.create(service, widgetBuilder, dsMock)
      expect(navigator.getCurrentRoute()).toBe('/test')
    })

    it('should not get current route name of empty navigator', () => {
      const dsMock = createDoubleStackMock<DefaultWebNavigatorItem<BeagleViewType>>({
        getTopItem: () => undefined,
      })
      const navigator = DefaultWebNavigator.create(service, widgetBuilder, dsMock)
      expect(navigator.getCurrentRoute()).toBe(undefined)
    })
  })*/

  createNewRouteTestSuit('pushView')

  /*describe('Push view', () => {

  })

  it('should pop stack', () => {

  })

  it('should not pop stack from empty navigator', () => {

  })

  it('should not pop stack from navigator with a single stack', () => {

  })

  it('should push first view of navigator (should act as push stack)', () => {

  })

  it('should push view to last stack', () => {

  })

  it('should pop view of stack with 3 pages', () => {

  })

  it('should pop entire stack when popView is called on a stack with a single page ', () => {

  })

  it('should not pop view of an empty navigator', () => {

  })

  it('should not pop view of navigator with a single page', () => {

  })

  it('should pop to view', () => {

  })

  it('should do nothing when popping to inexistent view', () => {

  })

  it('should resetStack', () => {

  })

  it('should reset application', () => {

  })

  it(
    'should be able to use the "navigate" method instead of calling the operation directly',
    () => {

    },
  )*/
})
