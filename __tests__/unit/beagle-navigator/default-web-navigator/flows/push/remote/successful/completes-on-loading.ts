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

import { PushOperation } from '../../types'
import { prepare, navigationToStackOperation } from '../../utils'

export function remoteSuccessfulFlowWithCompletionOnLoading(
  type: PushOperation,
) {
  describe('Successful remote view flow (completion on loading)', () => {
    let t: ReturnType<typeof prepare>

    beforeAll(() => {
      t = prepare({
        defaultController: {
          onLoading: (_, complete) => complete(),
        },
      })
      // it's important to not wait the navigation to finish here
      t.navigator[type]({ url: '/test' })
    })

    afterAll(() => t.tearDown())

    it(
      'should not wait response to finish before adding the new route to the navigation data structure',
      () => {
        expect(t.doubleStack[navigationToStackOperation[type]]).toHaveBeenCalled()
      },
    )

    it('should not wait response to finish before creating analytics record', () => {
      expect(t.service.analyticsService.createScreenRecord).toHaveBeenCalled()
    })

    it('should not wait response to finish before running change listeners', () => {
      expect(t.onChange).toHaveBeenCalled()
    })
  })
}
