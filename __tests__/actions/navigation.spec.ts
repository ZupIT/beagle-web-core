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

import { LifecycleHookMap } from "service/beagle-service/types"
import BeagleView, { BeagleView as BeagleViewType } from "beagle-view"
import NavigationActions from 'action/navigation'
import { mockLocalStorage } from '../utils/test-utils'
import { namespace } from 'service/network/view-client'
import { treeA } from "../mocks"

describe('Actions: Navigation', () => {
  let beagleView: BeagleViewType
  let params
  const baseUrl = 'http://teste.com'
  const element = { _beagleComponent_: 'button', id: 'button' }
  const externalUrl = 'http://google.com'
  const initialStack = [{ url: '/home' }]
  const lifecycles: LifecycleHookMap = {
    afterViewSnapshot: { components: {} },
    beforeRender: { components: {} },
    beforeStart: { components: {} },
    beforeViewSnapshot: { components: {} }
  }
  const url = 'http://my-app/my-view'

  const localStorageMock = mockLocalStorage({
    [`${namespace}/${url}/get`]: JSON.stringify(treeA),
    [`${namespace}/${url}/post`]: JSON.stringify(treeA),
  })

  const pushStack = () => {
    NavigationActions['beagle:pushStack']({
      action: {
        _beagleAction_: 'beagle:pushStack',
        route: {
          url: '/profile',
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

  const httpResponse = { status: 200, ok: true, json: () => ({}) }
  // @ts-ignore
  BeagleHttpClient.setFetchFunction(jest.fn(() => httpResponse))
  const originalWindow = window
  // @ts-ignore
  window = { open: jest.fn(() => {}), location: { origin: 'origin', href: '' } }
  const originalConsoleError = console.error
  console.error = jest.fn()

  beforeEach(() => {
    (console.error as jest.Mock).mockClear()
    localStorageMock.clear()
    UrlBuilder.setBaseUrl(baseUrl)
    beagleView = createBeagleView('/home', {}, lifecycles, {})
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
  })

  afterAll(() => {
    BeagleHttpClient.setFetchFunction(undefined)
    window = originalWindow
    localStorageMock.unmock()
    console.error = originalConsoleError
  })

  it('should init beagle navigator correctly', () => {
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should open external url', () => {
    NavigationActions['beagle:openExternalURL']({ action: { _beagleAction_: 'beagle:openExternalURL', url: externalUrl }, ...params })
    expect(window.open).toBeCalledWith(externalUrl)
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should open native route', () => {
    NavigationActions['beagle:openNativeRoute']({ action: { _beagleAction_: 'beagle:openNativeRoute', route: 'teste', data: { param: '1' } }, ...params })
    expect(window.location.href).toBe('origin/teste?param=1')
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should pushStack on beagle navigator', () => {
    pushStack()
    const newStack = [{ url: '/profile' }]
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack, newStack])
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should popStack on beagle navigator', () => {
    pushStack()
    NavigationActions['beagle:popStack']({ action: { _beagleAction_: 'beagle:popStack' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should pushView on beagle navigator', () => {
    pushView()
    const newView = { url: '/profile' }
    expect(beagleView.getBeagleNavigator().get()).toEqual([[{ url: '/home' }, newView]])
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should popView on beagle navigator', () => {
    pushView()
    NavigationActions['beagle:popView']({ action: { _beagleAction_: 'beagle:popView' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should popToView on beagle navigator', () => {
    pushView()
    NavigationActions['beagle:popToView']({ action: { _beagleAction_: 'beagle:popToView', route: '/home' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should resetStack', () => {
    pushStack()
    NavigationActions['beagle:resetStack']({ action: { _beagleAction_: 'beagle:resetStack', route: { url: '/resetStack' }}, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack, [{ url: '/resetStack' }]])
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should resetApplication', () => {
    pushView()
    NavigationActions['beagle:resetApplication']({ action: { _beagleAction_: 'beagle:resetApplication', route: { url: '/resetApplication' }}, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([[{ url: '/resetApplication' }]])
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should do nothing when popView on a single route stack', () => {
    NavigationActions['beagle:popView']({ action: { _beagleAction_: 'beagle:popView' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(console.error).toHaveBeenCalled()
  })

  it('should do nothing when popStack on a single stack', () => {
    NavigationActions['beagle:popStack']({ action: { _beagleAction_: 'beagle:popStack' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(console.error).toHaveBeenCalled()
  })

  it('should do nothing when popToView for a not valid view', () => {
    NavigationActions['beagle:popToView']({ action: { _beagleAction_: 'beagle:popToView', route: '/non-existent-route' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
    expect(console.error).toHaveBeenCalled()
  })

})
