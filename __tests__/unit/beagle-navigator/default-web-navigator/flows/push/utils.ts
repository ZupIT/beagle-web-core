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
import BeagleView from 'beagle-view'
import { BeagleView as BeagleViewType } from 'beagle-view/types'
import { DefaultWebNavigatorItem, DoubleStack as DoubleStackType } from 'beagle-navigator/types'
import {
  createViewClientMock,
  createBeagleServiceMock,
  createDoubleStackMock,
  createBeagleViewMock,
} from '../../../../old-structure/utils/test-utils'
import { PushOperation, PrepareParams } from './types'

const SERVER_DELAY_MS = 50

export const navigationToStackOperation: Record<PushOperation, keyof DoubleStackType<any>> = {
  pushView: 'pushItem',
  pushStack: 'pushStack',
  resetApplication: 'reset',
  resetStack: 'resetStack',
}

export function prepare({
  fetchResult = { _beagleComponent_: '' },
  defaultController,
  fetchError,
}: PrepareParams = {}) {
  // Services
  const viewClient = createViewClientMock({
    fetch: jest.fn(() => new Promise((resolve, reject) => {
      setTimeout(() => {
        if (fetchError) reject(fetchError)
        else resolve(fetchResult)
      }, SERVER_DELAY_MS)
    })),
  })

  const navigationControllers = {
    myCustomController: {
      onLoading: jest.fn(),
      onError: jest.fn(),
      onSuccess: jest.fn(),
    }
  }

  const controller = {
    onError: jest.fn(defaultController?.onError),
    onLoading: jest.fn(defaultController?.onLoading),
    onSuccess: jest.fn(defaultController?.onSuccess),
  }

  const service = createBeagleServiceMock({
    viewClient,
    getConfig: () => ({
      baseUrl: '',
      components: {},
      platform: 'Test',
      defaultNavigationController: controller,
      navigationControllers,
    })
  })

  // Navigator
  const doubleStack = createDoubleStackMock<DefaultWebNavigatorItem<BeagleViewType>>()
  const widgetBuilder = (v: BeagleViewType) => v
  const navigator = DefaultWebNavigator.create(service, widgetBuilder, doubleStack)
  const onChange = jest.fn()
  navigator.onChange(onChange)

  // BeagleView
  const beagleViewRef: { current: BeagleViewType | null } = { current: null }
  const originalBeagleView = BeagleView.create
  BeagleView.create = jest.fn(() => {
    beagleViewRef.current = createBeagleViewMock()
    return beagleViewRef.current
  })

  function tearDown() {
    BeagleView.create = originalBeagleView
  }

  return {
    viewClient,
    service,
    beagleViewRef,
    controller,
    navigationControllers,
    navigator,
    doubleStack,
    onChange,
    tearDown,
  }
}
