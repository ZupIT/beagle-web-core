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

import DefaultWebNavigator from 'beagle-navigator/default-web-navigator'
import BeagleView from 'beagle-view'
import { BeagleView as BeagleViewType } from 'beagle-view/types'
import { BeagleService } from 'service/beagle-service/types'
import { ViewClient } from 'service/network/view-client/types'
import { BeagleUIElement } from 'beagle-tree/types'
import {
  DefaultWebNavigatorItem,
  BeagleNavigator,
  NavigationController,
  DoubleStack as DoubleStackType,
} from 'beagle-navigator/types'
import {
  createViewClientMock,
  createBeagleServiceMock,
  createDoubleStackMock,
  createBeagleViewMock,
} from '../../old-structure/utils/test-utils'

const SERVER_DELAY_MS = 50

interface PrepareParams {
  fetchResult?: BeagleUIElement,
  customController?: Partial<NavigationController>,
  fetchError?: Error,
}

type NewRouteOperation = 'pushView' | 'pushStack' | 'resetStack' | 'resetApplication'

const navigationToStackOperation: Record<NewRouteOperation, keyof DoubleStackType<any>> = {
  pushView: 'pushItem',
  pushStack: 'pushStack',
  resetApplication: 'reset',
  resetStack: 'resetStack',
}

export function createNewRouteTestSuit(type: NewRouteOperation) {
  describe(type, () => {
    let viewClient: ViewClient
    let service: BeagleService
    let controller: NavigationController
    let navigator: BeagleNavigator<BeagleViewType>
    let doubleStack: DoubleStackType<DefaultWebNavigatorItem<BeagleViewType>>
    let onChange: jest.Mock
    let beagleView: BeagleViewType
    let unmockBeagleView: () => void
    const navigationControllers = {
      myCustomController: {
        onLoading: jest.fn(),
        onError: jest.fn(),
        onSuccess: jest.fn,
      }
    }

    function prepare({
      fetchResult = { _beagleComponent_: '' },
      customController,
      fetchError,
    }: PrepareParams) {
      // Services
      viewClient = createViewClientMock({
        fetch: jest.fn(() => new Promise((resolve, reject) => {
          setTimeout(() => {
            if (fetchError) reject(fetchError)
            else resolve(fetchResult)
          }, SERVER_DELAY_MS)
        })),
      })

      controller = {
        onError: jest.fn(),
        onLoading: jest.fn(),
        onSuccess: jest.fn(),
        ...customController,
      }

      service = createBeagleServiceMock({
        viewClient,
        getConfig: () => ({
          baseUrl: '',
          components: {},
          platform: 'Test',
          defaultNavigationController: controller,
          navigationControllers,
        })
      })

      // Navigator
      doubleStack = createDoubleStackMock()
      const widgetBuilder = (v: BeagleViewType) => v
      navigator = DefaultWebNavigator.create(service, widgetBuilder, doubleStack)
      onChange = jest.fn()
      navigator.onChange(onChange)

      // BeagleView
      const originalBeagleView = BeagleView.create
      BeagleView.create = jest.fn(() => {
        beagleView = createBeagleViewMock()
        return beagleView
      })
      unmockBeagleView = () => BeagleView.create = originalBeagleView
    }

    function tearDown() {
      unmockBeagleView()
    }

    describe('Successful remote view flow (completion after success)', () => {
      const route = { url: '/test' }
      const result = { _beagleComponent_: 'beagle:container' }

      beforeAll(async () => {
        prepare({ fetchResult: result })
        await navigator[type](route)
      })

      afterAll(tearDown)

      it('should create BeagleView', () => {
        expect(BeagleView.create).toHaveBeenCalledWith(service, navigator)
      })

      it('should handle onLoading', () => {
        expect(controller.onLoading).toHaveBeenCalledWith(beagleView, expect.any(Function))
      })

      it('should fetch view', () => {
        expect(viewClient.fetch).toHaveBeenCalledWith(route)
      })

      it('should not handle error', () => {
        expect(controller.onError).not.toHaveBeenCalled()
      })

      it('should handle onSuccess', () => {
        expect(controller.onSuccess).toHaveBeenCalledWith(beagleView, result)
        expect(controller.onSuccess).toHaveBeenCalledAfter(viewClient.fetch as jest.Mock)
        expect(controller.onSuccess).toHaveBeenCalledAfter(controller.onLoading as jest.Mock)
      })

      it('should add the new route to the navigation data structure', () => {
        expect(doubleStack[navigationToStackOperation[type]]).toHaveBeenCalledWith({
          controller,
          screen: { id: route.url, content: beagleView },
        })
        expect(doubleStack[navigationToStackOperation[type]]).toHaveBeenCalledAfter(
          controller.onSuccess as jest.Mock,
        )
      })

      it('should create analytics record and call change listeners', () => {
        expect(service.analyticsService.createScreenRecord).toHaveBeenCalledWith({
          route: route.url,
          platform: service.getConfig().platform,
        })
        expect(service.analyticsService.createScreenRecord).toHaveBeenCalledAfter(
          controller.onSuccess as jest.Mock,
        )
      })

      it('should run change listeners', () => {
        expect(onChange).toHaveBeenCalledWith(beagleView, route.url)
        expect(onChange).toHaveBeenCalledAfter(controller.onSuccess as jest.Mock)
      })
    })

    describe('Successful remote view flow (completion on loading)', () => {
      beforeAll(() => {
        prepare({
          customController: {
            onLoading: (_, complete) => complete(),
          },
        })
        // it's important to not wait the navigation to finish here
        navigator[type]({ url: '/test' })
      })

      afterAll(tearDown)

      it(
        'should not wait response to finish before adding the new route to the navigation data structure',
        () => {
          const doubleStackOperation = type === 'pushView' ? 'pushItem' : type
          expect(doubleStack[navigationToStackOperation[type]]).toHaveBeenCalled()
        },
      )

      it('should not wait response to finish before creating analytics record', () => {
        expect(service.analyticsService.createScreenRecord).toHaveBeenCalled()
      })

      it('should not wait response to finish before running change listeners', () => {
        expect(onChange).toHaveBeenCalled()
      })
    })

    describe('Unsuccessful remote view flow (never completes)', () => {
      const error = Error('test')

      beforeAll(async () => {
        prepare({ fetchError: error })
        await navigator[type]({ url: '/test' })
      })

      afterAll(tearDown)

      it('should handle onError', () => {
        expect(controller.onError).toHaveBeenCalledWith(
          beagleView,
          error,
          expect.any(Function),
          expect.any(Function),
        )
        expect(controller.onError).toHaveBeenCalledAfter(controller.onLoading as jest.Mock)
      })

      it('should not change navigation data structure', () => {
        expect(doubleStack[navigationToStackOperation[type]]).not.toHaveBeenCalled()
      })

      it('should not handle onSuccess', () => {
        expect(controller.onSuccess).not.toHaveBeenCalled()
      })

      it('should not create analytics record', () => {
        expect(service.analyticsService.createScreenRecord).not.toHaveBeenCalled()
      })

      it('should not run change listeners', () => {
        expect(onChange).not.toHaveBeenCalled()
      })
    })

    describe('Unsuccessful remote view flow (completes onError)', () => {
      const route = { url: '/test' }
      const error = Error('test')

      beforeAll(async () => {
        prepare({
          fetchError: error,
          customController: {
            onError: jest.fn((_, __, ___, complete) => complete()),
          },
        })
        await navigator[type](route)
      })

      afterAll(tearDown)

      it('should add the new route to the navigation data structure', () => {
        expect(doubleStack[navigationToStackOperation[type]]).toHaveBeenCalledWith({
          controller,
          screen: { id: route.url, content: beagleView },
        })
        expect(doubleStack[navigationToStackOperation[type]]).toHaveBeenCalledAfter(
          controller.onError as jest.Mock,
        )
      })

      it('should create analytics record', () => {
        expect(service.analyticsService.createScreenRecord).toHaveBeenCalledWith({
          route: route.url,
          platform: service.getConfig().platform,
        })
        expect(service.analyticsService.createScreenRecord).toHaveBeenCalledAfter(
          controller.onError as jest.Mock,
        )
      })

      it('should run change listeners', () => {
        expect(onChange).toHaveBeenCalledWith(beagleView, route.url)
        expect(onChange).toHaveBeenCalledAfter(controller.onError as jest.Mock)
      })
    })

    describe('Unsuccessful remote view flow with successful retrial', () => {
      const result = { _beagleComponent_: 'beagle:container' }
      const error = Error('test')
      let retry: () => Promise<void>

      beforeAll(async () => {
        prepare({
          fetchError: error,
          customController: {
            onError: jest.fn((_, __, retryParam) => retry = retryParam),
          },
        })
        await navigator[type]({ url: '/test' })
        viewClient.fetch = () => Promise.resolve(result)
        await retry()
      })

      afterAll(tearDown)

      it('onLoading should be called a second time', async () => {
        expect(controller.onLoading).toHaveBeenCalledTimes(2)
      })

      it('onError should not be called again', async () => {
        expect(controller.onError).toHaveBeenCalledTimes(1)
      })

      it('onSuccess should be handled on retrial', async () => {
        expect(controller.onSuccess).toHaveBeenCalledTimes(1)
        expect(controller.onSuccess).toHaveBeenCalledWith(beagleView, result)
      })
    })

    /*if (type === 'pushView') return

    describe('Successful flow with custom controller', () => {
      const result = { _beagleComponent_: 'beagle:container' }

      beforeAll(async () => {
        prepare({ fetchResult: result })
        await navigator[type]({ url: '/test' }, 'myCustomController')
      })

      afterAll(tearDown)

      it('should use custom onLoading', () => {
        expect(navigationControllers.myCustomController.onLoading)
          .toHaveBeenCalledWith(beagleView, expect.any(Function))
      })

      it('should use custom onSuccess', () => {
        expect(navigationControllers.myCustomController.onSuccess)
          .toHaveBeenCalledWith(beagleView, result)
      })
    })

    describe('Unsuccessful flow with custom controller', () => {
      const error = Error('test')

      beforeAll(async () => {
        prepare({ fetchError: error })
        await navigator[type]({ url: '/test' })
      })

      afterAll(tearDown)

      it('should use custom onError', () => {
        expect(controller.onError).toHaveBeenCalledWith(
          beagleView,
          error,
          expect.any(Function),
          expect.any(Function),
        )
      })
    })*/
  })
}

