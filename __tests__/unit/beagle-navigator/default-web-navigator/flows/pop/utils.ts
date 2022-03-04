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

import DefaultWebNavigator from 'beagle-navigator/default-web-navigator'
import { BeagleView as BeagleViewType } from 'beagle-view/types'
import { BeagleService } from 'service/beagle-service/types'
import LocalContextsManager from 'beagle-view/local-contexts/manager'
import { DefaultWebNavigatorItem, DoubleStack as DoubleStackType } from 'beagle-navigator/types'
import { createBeagleServiceMock, createDoubleStackMock } from '../../../../old-structure/utils/test-utils'
import { PopOperation, PrepareParams } from './types'

export const navigationToStackOperation: Record<PopOperation, keyof DoubleStackType<any>> = {
  popStack: 'popStack',
  popView: 'popItem',
  popToView: 'popUntil',
}

export function prepare({
  hasSingleStack = false,
  hasSingleItem = false,
  shouldPopUntil = true,
  useTopItemWithNavigationContext = false,
}: PrepareParams = {},
beagleServiceCustom: Partial<BeagleService> = {}) {
  const service = createBeagleServiceMock(beagleServiceCustom)
  const topItemLocalContextsManager = LocalContextsManager.create()
  const topItemNavigationContext = { path: 'previous', value: { previousKey: 'previous value' } }
  if (useTopItemWithNavigationContext) {
    topItemLocalContextsManager.setContext('navigationContext', topItemNavigationContext.value, topItemNavigationContext.path)
  }

  const topItem = { screen: { id: '/test', content: {}, rootId: 'test-root' }, localContextsManager: topItemLocalContextsManager }
  const onChange = jest.fn()
  const doubleStack = createDoubleStackMock<DefaultWebNavigatorItem<BeagleViewType>>({
    hasSingleStack: () => !!hasSingleStack,
    hasSingleItem: () => !!hasSingleItem,
    getTopItem: () => topItem,
    // @ts-ignore
    popUntil: jest.fn(() => shouldPopUntil ? [{}] : []),
  })
  const navigator = DefaultWebNavigator.create(service, v => v, doubleStack)
  navigator.onChange(onChange)
  globalMocks.log.mockClear()

  return { service, topItem, onChange, doubleStack, navigator, topItemNavigationContext, topItemLocalContextsManager }
}
