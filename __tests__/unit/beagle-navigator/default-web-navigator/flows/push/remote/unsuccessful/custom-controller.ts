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
import { prepare } from '../../utils'

export function remoteUnsuccessfulFlowWithCustomController(
  type: PushOperation,
) {
  describe('Unsuccessful flow with custom controller', () => {
    const error = Error('test')
    let t: ReturnType<typeof prepare>

    beforeAll(async () => {
      t = prepare({ fetchError: error })
      await t.navigator[type]({ url: '/test' })
    })

    afterAll(() => t.tearDown())

    it('should use custom onError', () => {
      expect(t.controller.onError).toHaveBeenCalledWith(
        t.beagleViewRef.current,
        error,
        expect.any(Function),
        expect.any(Function),
      )
    })
  })
}
