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

import LocalContextsManager from 'beagle-view/local-contexts/manager'
import { LocalView } from 'beagle-navigator/types'
import { createLocalContextsMock } from '../../../../../old-structure/utils/test-utils'
import { PushOperation } from '../types'
import { prepare } from '../utils'

const IMMEDIATELY_THRESHOLD_MS = 10

export function localFlowWithDefaultController(type: PushOperation) {
  describe('Local view flow with default controller', () => {
    const localContextsManager = createLocalContextsMock()
    const route: LocalView = {
      screen: { id: 'test', _beagleComponent_: 'beagle:container' }
    }
    let timeTaken: number
    let t: ReturnType<typeof prepare>

    beforeAll(async () => {
      t = prepare({}, {}, { getLocalContexts: () => localContextsManager })
      const started = new Date().getTime()
      await t.navigator[type]({ route })
      timeTaken = new Date().getTime() - started
    })

    it('should resolve immediately', () => {
      expect(timeTaken).toBeLessThan(IMMEDIATELY_THRESHOLD_MS)
    })

    it('should not handle onLoading', () => {
      expect(t.controller.onLoading).not.toHaveBeenCalled()
    })

    it('should not fetch view', () => {
      expect(t.viewClient.fetch).not.toHaveBeenCalled()
    })

    it('should not handle onError', () => {
      expect(t.controller.onError).not.toHaveBeenCalled()
    })

    it('should handle onSuccess', () => {
      expect(t.controller.onSuccess).toHaveBeenCalledWith(t.beagleViewRef.current, route.screen)
    })

    it('should create analytics record', () => {
      expect(t.service.analyticsService.createScreenRecord).toHaveBeenCalledWith({
        route: route.screen.id,
        rootId: route.screen.id,
        platform: t.service.getConfig().platform,
      })
      expect(t.service.analyticsService.createScreenRecord).toHaveBeenCalledAfter(t.controller.onSuccess as jest.Mock)
    })

    it('should not set the navigation context', () => {
      expect(localContextsManager.setContext).not.toHaveBeenCalled()
    })

    it('should run change listeners', () => {
      expect(t.onChange).toHaveBeenCalledWith(t.beagleViewRef.current, route.screen.id)
      expect(t.onChange).toHaveBeenCalledAfter(t.controller.onSuccess as jest.Mock)
    })
  })

  describe('Local view flow with default controller with navigation context flow', () => {
    const localContextsManager = LocalContextsManager.create()
    let t: ReturnType<typeof prepare>

    beforeAll(async () => {
      t = prepare({}, {}, { getLocalContexts: () => localContextsManager })
    })

    it('should keep empty the navigation context if none is given', async () => {
      const setContextSpy = jest.spyOn(localContextsManager, 'setContext')
      const route: LocalView = {
        screen: { id: 'test', _beagleComponent_: 'beagle:container' }
      }
      await t.navigator[type]({ route })

      expect(setContextSpy).not.toHaveBeenCalled()
      expect(localContextsManager.getAllAsDataContext().length).toBe(0)

      setContextSpy.mockRestore()
    })

    it('should set the navigation context if given', async () => {
      const setContextSpy = jest.spyOn(localContextsManager, 'setContext')
      const route: LocalView = {
        screen: { id: 'route-with-navigation-context', _beagleComponent_: 'beagle:container' }
      }
      await t.navigator[type]({ route, navigationContext: { path: 'test', value: 'value of test' } })

      const dataContexts = localContextsManager.getAllAsDataContext()
      expect(setContextSpy).toHaveBeenCalledWith('navigationContext', 'value of test', 'test')
      expect(dataContexts.length).toBe(1)
      expect(dataContexts[0]).toEqual({ id: 'navigationContext', value: { test: 'value of test' } })

      setContextSpy.mockRestore()
    })
  })
}
