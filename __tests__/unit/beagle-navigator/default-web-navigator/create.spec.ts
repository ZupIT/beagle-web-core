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
  createBeagleServiceMock,
  createDoubleStackMock,
} from '../../old-structure/utils/test-utils'

describe('DefaultWebNavigator: create', () => {
  const widgetBuilder = (v: BeagleViewType) => v
  const service = createBeagleServiceMock()

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
