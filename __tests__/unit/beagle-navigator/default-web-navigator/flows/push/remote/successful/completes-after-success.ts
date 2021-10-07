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

export function remoteSuccessfulFlowWithCompletionAfterSuccess(
  type: PushOperation,
) {
  describe('Successful remote view flow (completion after success)', () => {
    const route = { url: '/test' }
    const result = { _beagleComponent_: 'beagle:container' }
    let t: ReturnType<typeof prepare>

    beforeAll(async () => {
      t = prepare({ fetchResult: result })
      await t.navigator[type](route)
    })

    afterAll(() => t.tearDown())

    it('should create BeagleView', () => {
      expect(BeagleView.create).toHaveBeenCalledWith(t.service, t.navigator)
    })

    it('should handle onLoading', () => {
      expect(t.controller.onLoading)
        .toHaveBeenCalledWith(t.beagleViewRef.current, expect.any(Function))
    })

    it('should fetch view', () => {
      expect(t.viewClient.fetch).toHaveBeenCalledWith(route)
    })

    it('should not handle error', () => {
      expect(t.controller.onError).not.toHaveBeenCalled()
    })

    it('should handle onSuccess', () => {
      expect(t.controller.onSuccess).toHaveBeenCalledWith(t.beagleViewRef.current, result)
      expect(t.controller.onSuccess).toHaveBeenCalledAfter(t.viewClient.fetch as jest.Mock)
      expect(t.controller.onSuccess).toHaveBeenCalledAfter(t.controller.onLoading as jest.Mock)
    })

    it('should add the new route to the navigation data structure', () => {
      expect(t.doubleStack[navigationToStackOperation[type]]).toHaveBeenCalledWith({
        controller: t.controller,
        screen: { id: route.url, content: t.beagleViewRef.current },
      })
      expect(t.doubleStack[navigationToStackOperation[type]]).toHaveBeenCalledAfter(
        t.controller.onSuccess as jest.Mock,
      )
    })

    it('should create analytics record', () => {
      expect(t.service.analyticsService.createScreenRecord).toHaveBeenCalledWith({
        route: route.url,
        platform: t.service.getConfig().platform,
      })
      expect(t.service.analyticsService.createScreenRecord).toHaveBeenCalledAfter(
        t.controller.onSuccess as jest.Mock,
      )
    })

    it('should run change listeners', () => {
      expect(t.onChange).toHaveBeenCalledWith(t.beagleViewRef.current, route.url)
      expect(t.onChange).toHaveBeenCalledAfter(t.controller.onSuccess as jest.Mock)
    })
  })
}
