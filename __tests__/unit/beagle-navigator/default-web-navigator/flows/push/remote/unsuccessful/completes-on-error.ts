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

import { createLocalContextsMock } from '../../../../../../old-structure/utils/test-utils'
import { PushOperation } from '../../types'
import { prepare, navigationToStackOperation } from '../../utils'

export function remoteUnsuccessfulFlowWithCompletionOnError(type: PushOperation) {
  describe('Unsuccessful remote view flow (completes onError)', () => {
    const route = { url: '/test' }
    const error = Error('test')
    const localContextsManager = createLocalContextsMock()
    let t: ReturnType<typeof prepare>

    beforeAll(async () => {
      t = prepare({
        fetchError: error,
        defaultController: {
          onError: jest.fn((_, __, ___, complete) => complete()),
        }
      }, {}, { getLocalContexts: () => localContextsManager })
      await t.navigator[type]({ route, navigationContext: { path: 'testPath', value: 'Test value' } })
    })

    afterAll(() => t.tearDown())

    it('should add the new route to the navigation data structure', () => {
      expect(t.doubleStack[navigationToStackOperation[type]]).toHaveBeenCalledWith({
        controller: t.controller,
        screen: { id: route.url, content: t.beagleViewRef.current },
        localContextsManager: localContextsManager,
      })
      expect(t.doubleStack[navigationToStackOperation[type]]).toHaveBeenCalledAfter(t.controller.onError as jest.Mock)
    })

    it('should not create analytics record', () => {
      expect(t.service.analyticsService.createScreenRecord).not.toHaveBeenCalled()
    })

    it('should create the navigationContext', () => {
      expect(localContextsManager.setContext).toHaveBeenCalledWith('navigationContext', 'Test value', 'testPath')
    })

    it('should run change listeners', () => {
      expect(t.onChange).toHaveBeenCalledWith(t.beagleViewRef.current, route.url)
      expect(t.onChange).toHaveBeenCalledAfter(t.controller.onError)
    })
  })
}
