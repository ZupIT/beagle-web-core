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

import { PushOperation } from '../../types'
import { prepare } from '../../utils'

export function remoteSuccessfulFlowWithCustomController(
  type: PushOperation,
) {
  describe('Successful flow with custom controller', () => {
    const result = { _beagleComponent_: 'beagle:container' }
    let t: ReturnType<typeof prepare>

    beforeAll(async () => {
      t = prepare({ fetchResult: result })
      await t.navigator[type]({ route: { url: '/test' }, controllerId: 'myCustomController' })
    })

    afterAll(() => t.tearDown())

    it('should use custom onLoading', () => {
      expect(t.navigationControllers.myCustomController.onLoading)
        .toHaveBeenCalledWith(t.beagleViewRef.current, expect.any(Function))
    })

    it('should use custom onSuccess', () => {
      expect(t.navigationControllers.myCustomController.onSuccess)
        .toHaveBeenCalledWith(t.beagleViewRef.current, result)
    })
  })
}
