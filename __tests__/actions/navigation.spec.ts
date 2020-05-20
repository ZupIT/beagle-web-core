/*
  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *  http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

import { BeagleView } from "../../src/types"
import createBeagleView from "../../src/BeagleUIView"
import NavigationActions from '../../src/actions/navigation'

describe('Actions: Navigation', () => {

  let beagleView: BeagleView
  let params
  const baseUrl = 'http://teste.com'
  const element = { _beagleType_: 'button', id: 'button' }
  const externlUrl = 'http://google.com'
  const originalError = console.error
  const initialStack = [{ url: '/home' }]

  const pushStack = () => {
    NavigationActions.pushStack({
      action: {
        _actionType_: 'pushStack',
        route: {
          url: '/profile',
        },
      },
      ...params
    })
  }

  const pushView = () => {
    NavigationActions.pushView({
      action: {
        _actionType_: 'pushView',
        route: {
          url: '/profile',
        },
      },
      ...params,
    })
  }

  beforeEach(() => {
    beagleView = createBeagleView({ baseUrl, components: {} }, '/home')
    params = {
      beagleView,
      element,
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    }
    console.error = jest.fn()
    // @ts-ignore
    window = { open: jest.fn((url) => {}), location: { origin: 'origin', href: '' } }
  })

  afterEach(() => {
    console.error = originalError
  })

  it('should init beagle navigator correctly', () => {
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
  })

  it('should open exeternal url', () => {
    NavigationActions.openExternalURL({ action: { _actionType_: 'openExternalURL', url: externlUrl }, ...params })
    expect(window.open).toBeCalledWith(externlUrl)
  })

  it('should open native route', () => {
    NavigationActions.openNativeRoute({ action: { _actionType_: 'openNativeRoute', route: '/teste' }, ...params })
    expect(window.location.href).toBe('origin/teste')
  })

  it('should pushStack on beagle navigator', () => {
    pushStack()
    const newStack = [{ url: '/profile' }]
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack, newStack])
  })

  it('should popStack on beagle navigator', () => {
    pushStack()
    NavigationActions.popStack({ action: { _actionType_: 'popStack' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
  })

  it('should pushView on beagle navigator', () => {
    pushView()
    const newView = { url: '/profile' }
    expect(beagleView.getBeagleNavigator().get()).toEqual([[{ url: '/home' }, newView]])
  })

  it('should popView on beagle navigator', () => {
    pushView()
    NavigationActions.popView({ action: { _actionType_: 'popView' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
  })

  it('should popToView on beagle navigator', () => {
    pushView()
    NavigationActions.popToView({ action: { _actionType_: 'popToView', route: { url: '/home' } }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
  })

  it('should resetStack', () => {
    pushStack()
    NavigationActions.resetStack({ action: { _actionType_: 'resetStack', route: { url: '/resetStack' }}, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack, [{ url: '/resetStack' }]])
  })

  it('should resetApplication', () => {
    pushView()
    NavigationActions.resetApplication({ action: { _actionType_: 'resetApplication', route: { url: '/resetApplication' }}, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([[{ url: '/resetApplication' }]])
  })

  it('should do nothing when popView on a single route stack', () => {
    NavigationActions.popView({ action: { _actionType_: 'popView' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
  })

  it('should do nothing when popStack on a single stack', () => {
    NavigationActions.popStack({ action: { _actionType_: 'popStack' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
  })

  it('should do nothing when popToView for a not valid view', () => {
    NavigationActions.popToView({ action: { _actionType_: 'popToView', route: '/non-existent-route' }, ...params })
    expect(beagleView.getBeagleNavigator().get()).toEqual([initialStack])
  })

})