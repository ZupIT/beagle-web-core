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

import { LocalView } from 'beagle-navigator/types'
import { PushOperation } from '../types'
import { prepare } from '../utils'

export function localFlowWithCustomController(type: PushOperation) {
  describe('Local view flow with custom controller', () => {
    const route: LocalView = {
      screen: { id: 'test', _beagleComponent_: 'beagle:container' }
    }
    let t: ReturnType<typeof prepare>

    beforeAll(async () => {
      t = prepare()
      await t.navigator[type](route, 'myCustomController')
    })

    it('should handle onSuccess', () => {
      expect(t.navigationControllers.myCustomController.onSuccess)
        .toHaveBeenCalledWith(t.beagleViewRef.current, route.screen)
    })
  })
}
