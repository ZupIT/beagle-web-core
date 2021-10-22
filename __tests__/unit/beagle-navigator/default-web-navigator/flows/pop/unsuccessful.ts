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

import { prepare, navigationToStackOperation } from './utils'
import { PopOperation } from './types'

export function unsuccessfulPopFlow(type: PopOperation, toView?: string) {
  describe('Unsuccessful pop flow', () => {
    let t: ReturnType<typeof prepare>

    beforeAll(() => {
      const config = {
        popStack: { hasSingleStack: true },
        popView: { hasSingleItem: true },
        popToView: { shouldPopUntil: false },
      }
      t = prepare(config[type])
      t.navigator[type](toView!)
    })

    it('should log error', () => {
      expect(globalMocks.log).toHaveBeenCalledWith('error', expect.stringContaining("Can't pop"))
    })

    it('should not update navigation data structure', () => {
      expect(t.doubleStack.popStack).not.toHaveBeenCalled()
    })

    it('should not create analytics record', () => {
      expect(t.service.analyticsService.createScreenRecord).not.toHaveBeenCalled()
    })

    it('should not run change listeners', () => {
      expect(t.onChange).not.toHaveBeenCalled()
    })
  })
}
