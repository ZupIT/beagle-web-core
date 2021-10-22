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

export function remoteUnsuccessfulFlowWithRetrial(
  type: PushOperation,
) {
  describe('Unsuccessful remote view flow with successful retrial', () => {
    const result = { _beagleComponent_: 'beagle:container' }
    const error = Error('test')
    let retry: () => Promise<void>
    let t: ReturnType<typeof prepare>

    beforeAll(async () => {
      t = prepare({
        fetchError: error,
        defaultController: {
          onError: jest.fn((_, __, retryParam) => retry = retryParam),
        },
      })
      await t.navigator[type]({ url: '/test' })
      t.viewClient.fetch = () => Promise.resolve(result)
      await retry()
    })

    afterAll(() => t.tearDown())

    it('onLoading should be called a second time', async () => {
      expect(t.controller.onLoading).toHaveBeenCalledTimes(2)
    })

    it('onError should not be called again', async () => {
      expect(t.controller.onError).toHaveBeenCalledTimes(1)
    })

    it('onSuccess should be handled on retrial', async () => {
      expect(t.controller.onSuccess).toHaveBeenCalledTimes(1)
      expect(t.controller.onSuccess).toHaveBeenCalledWith(t.beagleViewRef.current, result)
    })
  })
}
