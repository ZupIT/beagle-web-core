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
import { BeagleView as BeagleViewType, NetworkOptions } from 'beagle-view/types'
import { NavigationController } from 'beagle-view/navigator/types'
import { BeagleService, BeagleConfig } from 'service/beagle-service/types'
import * as Renderer from 'beagle-view/render'
import {
  createViewClientMock,
  createUrlBuilderMock,
  createPreFetcherMock,
  createBeagleServiceMock,
} from '../old-structure/utils/test-utils'

describe('Beagle View', () => {
  describe('general behavior', () => {
    it('should return a copy of the NetworkOptions', () => {
      const beagleService = createBeagleServiceMock()
      const networkOptions: NetworkOptions = { strategy: 'network-only' }
      const beagleView = BeagleView.create(beagleService, networkOptions)
      expect(beagleView.getNetworkOptions()).not.toBe(networkOptions)
      expect(beagleView.getNetworkOptions()).toEqual(networkOptions)
    })

    it('should return undefined if no NetworkOptions is provided', () => {
      const beagleService = createBeagleServiceMock()
      const beagleView = BeagleView.create(beagleService)
      expect(beagleView.getNetworkOptions()).toBeUndefined()
    })

    it('should disable css on renderer', () => {
      const originalCreateRenderer = Renderer.default.create
      Renderer.default.create = jest.fn()
      const beagleService = createBeagleServiceMock({
        getConfig: () => ({
          baseUrl: '',
          components: {},
          platform: 'Test',
          disableCssTransformation: true,
        }),
      })
      BeagleView.create(beagleService)
      expect(Renderer.default.create).toHaveBeenCalledWith(
        expect.objectContaining({ disableCssTransformation: true }),
      )
      Renderer.default.create = originalCreateRenderer
    })
  })

  describe('navigation', () => {
    let beagleService: BeagleService
    const doFullRender = jest.fn()
    const mock = { _beagleComponent_: 'beagle:container' }
    const navigationControllers: Record<string, NavigationController> = {
      secured: {
        errorComponent: 'test:error',
        loadingComponent: 'test:loading',
        shouldShowError: false,
        shouldShowLoading: false,
      }
    }
    let beagleView: BeagleViewType

    beforeEach(() => {
      const viewClient = createViewClientMock({
        load: jest.fn(async ({ onChangeTree }) => onChangeTree(mock)),
        loadFromCache: jest.fn(() => Promise.resolve(mock)),
      })
      const urlBuilder = createUrlBuilderMock({
        build: jest.fn(url => `base${url}`)
      })
      const preFetcher = createPreFetcherMock({
        recover: jest.fn(url => url === 'base/home' ? Promise.resolve(mock) : Promise.reject()),
      })
      beagleService = createBeagleServiceMock({
        viewClient,
        urlBuilder,
        preFetcher,
        getConfig: () => ({ navigationControllers } as BeagleConfig<any>),
      })
      beagleView = BeagleView.create(beagleService)
      beagleView.getRenderer().doFullRender = doFullRender
    })

    it('should apply initial navigation controller', () => {
      beagleView = BeagleView.create(beagleService, {}, 'secured')
      expect(beagleView.getNavigator().get()).toEqual([{ routes: [], controllerId: 'secured' }])
    })

    it('should use network options', () => {
      const networkOptions: NetworkOptions = {
        method: 'POST',
        headers: { testHeader: 'test-header' },
        strategy: 'network-only',
      }
      beagleView = BeagleView.create(beagleService, networkOptions)
      beagleView.getNavigator().pushStack({ url: '/home' })
      expect(beagleService.viewClient.load).toHaveBeenCalledWith(expect.objectContaining({
        url: 'base/home',
        ...networkOptions,
      }))
    })

    it('should navigate to remote route', async () => {
      await beagleView.getNavigator().pushView({
        url: '/home',
        fallback: { _beagleComponent_: 'custom:fallback'},
      })
      expect(beagleService.viewClient.load).toHaveBeenCalledWith(expect.objectContaining({
        url: 'base/home',
        fallbackUIElement: { _beagleComponent_: 'custom:fallback'},
      }))
      expect(doFullRender).toHaveBeenCalledWith(mock, undefined, 'replaceComponent')
    })

    it('should add "/" if missing', async () => {
      await beagleView.getNavigator().pushView({ url: 'home' })
      expect(beagleService.urlBuilder.build).toHaveBeenCalledWith('/home')
    })

    it('should navigate to local tree', async () => {
      await beagleView.getNavigator().pushView({ screen: mock })
      expect(beagleService.viewClient.load).not.toHaveBeenCalled()
      expect(doFullRender).toHaveBeenCalledWith(mock, undefined, 'replaceComponent')
    })

    it('should use pre-fetched view', async () => {
      await beagleView.getNavigator().pushView({
        url: '/home',
        shouldPrefetch: true,
      })
      expect(beagleService.viewClient.load).not.toHaveBeenCalled()
      expect(beagleService.preFetcher.recover).toHaveBeenCalledWith('base/home')
      expect(doFullRender).toHaveBeenCalledWith(mock)
    })

    it('should pre-fetch and add "/" if missing', async () => {
      await beagleView.getNavigator().pushView({
        url: 'home',
        shouldPrefetch: true,
      })
      expect(beagleService.urlBuilder.build).toHaveBeenCalledWith('/home')
    })

    it('should fallback to network if pre-fetched recovery failed', async () => {
      beagleService.preFetcher.recover = () => Promise.reject()

      await beagleView.getNavigator().pushView({
        url: '/profile',
        shouldPrefetch: true,
      })

      expect(beagleService.viewClient.load).toHaveBeenCalledWith(expect.objectContaining({
        url: 'base/profile',
      }))
      expect(doFullRender).toHaveBeenCalledWith(mock, undefined, 'replaceComponent')
    })

    it('should use a navigation controller', async () => {
      await beagleView.getNavigator().pushView({ url: '/login' })
      await beagleView.getNavigator().resetStack({ url: '/account' }, 'secured')
      await beagleView.getNavigator().pushView({ url: '/profile' })

      expect(beagleService.viewClient.load)
        .toHaveBeenLastCalledWith(expect.objectContaining(navigationControllers.secured))
    })
  })
})
