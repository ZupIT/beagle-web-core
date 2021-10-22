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

export function successfulPopFlow(type: PopOperation) {
  describe('Successful pop flow', () => {
    const toView = '/test'
    let t: ReturnType<typeof prepare>

    beforeAll(() => {
      t = prepare()
      t.navigator[type](toView)
    })

    if (type === 'popToView') {
      it('should correctly call the popUntil function and update navigation data structure', () => {
        expect(t.doubleStack.popUntil).toHaveBeenCalledWith(expect.any(Function))
        const predicate = (t.doubleStack.popUntil as jest.Mock).mock.calls[0][0]
        expect(predicate({ screen: { id: "not the page we're looking for" } })).toBe(false)
        expect(predicate({ screen: { id: toView } })).toBe(true)
      })
    } else {
      it('should update navigation data structure', () => {
        expect(t.doubleStack[navigationToStackOperation[type]]).toHaveBeenCalled()
      })
    }

    it('should create analytics record', () => {
      expect(t.service.analyticsService.createScreenRecord).toHaveBeenCalledWith({
        route: t.topItem.screen.id,
        platform: t.service.getConfig().platform,
      })
    })

    it('should run change listeners', () => {
      expect(t.onChange).toHaveBeenCalledWith(t.topItem.screen.content, t.topItem.screen.id)
    })
  })
}
