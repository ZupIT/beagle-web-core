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
import { BeagleView as BeagleViewType } from 'beagle-view/types'
import NavigationActions from 'action/navigation'
import { createBeagleServiceMock } from '../utils/test-utils'
import { namespace } from 'service/network/view-client'
import { treeA } from "../mocks"

describe('Actions: Navigation', () => {
  let beagleView: BeagleViewType
  let params: any
  const element = { _beagleComponent_: 'button', id: 'button' }
  const externalUrl = 'http://google.com'
  const initialStack = [{ url: '/home' }]
  const url = 'http://my-app/my-view'

  const pushStack = (shouldPrefetch = false) => {
    NavigationActions['beagle:pushStack']({
      action: {
        _beagleAction_: 'beagle:pushStack',
        route: {
          url: '/profile',
          shouldPrefetch,
        },
      },
      ...params
    })
  }

  const pushView = () => {
    NavigationActions['beagle:pushView']({
      action: {
        _beagleAction_: 'beagle:pushView',
        route: {
          url: '/profile',
        },
      },
      ...params,
    })
  }

  const originalWindow = window
  // @ts-ignore
  window = { open: jest.fn(() => {}), location: { origin: 'origin', href: '' } }

  beforeEach(async () => {
    globalMocks.log.mockClear()
    const beagleService = createBeagleServiceMock()
    beagleService.storage.setItem(`${namespace}/${url}/get`, JSON.stringify(treeA))
    beagleService.storage.setItem(`${namespace}/${url}/post`, JSON.stringify(treeA))
    beagleView = BeagleView.create(beagleService)
    await beagleView.fetch({ path: '/home' })
    /* fixme: the tests in this file execute async operations that will result in errors since
     * the route they call doesn't exist. These async operations should be awaited before returning.
     * Since they're not being awaited, the beagle view tries to log to the console after the tests
     * are done. These operations should, somehow, be awaited before the tests finish. As a fast
     * fix, the following line prevents the beagle view from logging errors.
     */
    beagleView.addErrorListener(() => { /* ignore errors */ })
    params = {
      beagleView,
      element,
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    }
    // mocks the rendering part of the beagleView, we don't want to test that here
    beagleView.getRenderer().doFullRender = jest.fn()
    beagleView.getRenderer().doPartialRender = jest.fn()
    beagleView.fetch = jest.fn(beagleView.fetch)
  })

  it('should init beagle navigator correctly', () => {
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  it('should open external url', () => {
    NavigationActions['beagle:openExternalURL']({ action: { _beagleAction_: 'beagle:openExternalURL', url: externalUrl }, ...params })
    expect(window.open).toBeCalledWith(externalUrl)
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  it('should open native route', () => {
    NavigationActions['beagle:openNativeRoute']({ action: { _beagleAction_: 'beagle:openNativeRoute', route: 'teste', data: { param: '1' } }, ...params })
    expect(window.location.href).toBe('origin/teste?param=1')
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  it('should pushStack on beagle navigator', () => {
    pushStack()
    const newStack = [{ url: '/profile', shouldPrefetch: false }]
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack, newStack])
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  it('should popStack on beagle navigator', () => {
    pushStack()
    NavigationActions['beagle:popStack']({ action: { _beagleAction_: 'beagle:popStack' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  it('should pushView on beagle navigator', () => {
    pushView()
    const newView = { url: '/profile' }
    expect(beagleView.getBeagleNavigator().get()).toEqual([[{ url: '/home' }, newView]])
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  it('should popView on beagle navigator', () => {
    pushView()
    NavigationActions['beagle:popView']({ action: { _beagleAction_: 'beagle:popView' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  it('should popToView on beagle navigator', () => {
    pushView()
    NavigationActions['beagle:popToView']({ action: { _beagleAction_: 'beagle:popToView', route: '/home' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  it('should resetStack', () => {
    pushStack()
    NavigationActions['beagle:resetStack']({ action: { _beagleAction_: 'beagle:resetStack', route: { url: '/resetStack' }}, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack, [{ url: '/resetStack' }]])
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  it('should resetApplication', () => {
    pushView()
    NavigationActions['beagle:resetApplication']({ action: { _beagleAction_: 'beagle:resetApplication', route: { url: '/resetApplication' }}, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([[{ url: '/resetApplication' }]])
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  it('should do nothing when popView on a single route stack', () => {
    NavigationActions['beagle:popView']({ action: { _beagleAction_: 'beagle:popView' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(globalMocks.log).toHaveBeenCalledWith('error', expect.any(Error))
  })

  it('should do nothing when popStack on a single stack', () => {
    NavigationActions['beagle:popStack']({ action: { _beagleAction_: 'beagle:popStack' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(globalMocks.log).toHaveBeenCalledWith('error', expect.any(Error))
  })

  it('should do nothing when popToView for a not valid view', () => {
    NavigationActions['beagle:popToView']({ action: { _beagleAction_: 'beagle:popToView', route: '/non-existent-route' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(globalMocks.log).toHaveBeenCalledWith('error', expect.any(Error))
  })

  it('should fetch view on navigation', () => {
    pushStack()
    expect(beagleView.fetch).toHaveBeenCalledWith(expect.objectContaining({ path: '/profile' }))
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  it('should use pre-fetched view on navigation', () => {
    pushStack(true)
    expect(beagleView.getBeagleService().viewClient.loadFromCache)
      .toHaveBeenCalledWith('/profile', 'get')
    expect(beagleView.fetch).not.toHaveBeenCalled()
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

})
