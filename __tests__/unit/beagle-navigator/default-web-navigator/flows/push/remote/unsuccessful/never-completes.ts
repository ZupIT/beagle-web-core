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

import BeagleView from 'beagle-view'
import { PushOperation } from '../../types'
import { prepare, navigationToStackOperation } from '../../utils'

export function remoteUnsuccessfulFlowWithoutCompletion(
  type: PushOperation,
) {
  describe('Unsuccessful remote view flow (never completes)', () => {
    const error = Error('test')
    let t: ReturnType<typeof prepare>

    beforeAll(async () => {
      t = prepare({ fetchError: error })
      await t.navigator[type]({ url: '/test' })
    })

    afterAll(() => t.tearDown())

    it('should handle onError', () => {
      expect(t.controller.onError).toHaveBeenCalledWith(
        t.beagleViewRef.current,
        error,
        expect.any(Function),
        expect.any(Function),
      )
      expect(t.controller.onError).toHaveBeenCalledAfter(t.controller.onLoading as jest.Mock)
    })

    it('should not change navigation data structure', () => {
      expect(t.doubleStack[navigationToStackOperation[type]]).not.toHaveBeenCalled()
    })

    it('should not handle onSuccess', () => {
      expect(t.controller.onSuccess).not.toHaveBeenCalled()
    })

    it('should not create analytics record', () => {
      expect(t.service.analyticsService.createScreenRecord).not.toHaveBeenCalled()
    })

    it('should not run change listeners', () => {
      expect(t.onChange).not.toHaveBeenCalled()
    })
  })
}
