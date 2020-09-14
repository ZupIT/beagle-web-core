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

import navigationActions from 'action/navigation'
import { GenericNavigationAction } from 'action/navigation/types'
import { createBeagleViewMock } from '../old-structure/utils/test-utils' 

describe('Action: navigation', () => {
  function callAction(
    action: GenericNavigationAction,
    beagleView = createBeagleViewMock(),
    navigationType?: string,
  ) {
    const params: any = {
      action,
      beagleView,
      element: { _beagleComponent_: 'beagle:button' },
      eventContextHierarchy: [],
      handleAction: jest.fn(),
    }

    navigationActions[navigationType || action._beagleAction_](params)
    return beagleView.getNavigator()
  }

  describe('native navigation', () => {
    const originalWindow = window

    beforeEach(() => {
      // @ts-ignore
      window = { open: jest.fn(() => {}), location: { origin: 'origin', href: '' } }
    })

    afterEach(() => {
      window = originalWindow
    })

    it('should open external url', () => {
      const url = 'https://www.google.com'
      callAction({
        _beagleAction_: 'beagle:openExternalURL',
        url,
      })

      expect(window.open).toHaveBeenCalledWith(url)
    })
  
    it('should open native route', () => {
      callAction({
        _beagleAction_: 'beagle:openNativeRoute',
        route: 'test',
        data: { param: '1' },
      })

      expect(window.location.href).toBe('origin/test?param=1')
    })
  })

  describe('beagle navigation', () => {
    it('should pushStack', () => {
      const navigator = callAction({
        _beagleAction_: 'beagle:pushStack',
        route: { url: '/test' },
        controllerId: 'myController',
      })

      expect(navigator.navigate).toHaveBeenCalledWith('pushStack', { url: '/test' }, 'myController')
    })

    it('should resetStack', () => {
      const navigator = callAction({
        _beagleAction_: 'beagle:resetStack',
        route: { url: '/test' },
        controllerId: 'myController',
      })

      expect(navigator.navigate)
        .toHaveBeenCalledWith('resetStack', { url: '/test' }, 'myController')
    })

    it('should resetApplication', () => {
      const navigator = callAction({
        _beagleAction_: 'beagle:resetApplication',
        route: { url: '/test' },
        controllerId: 'myController',
      })

      expect(navigator.navigate)
        .toHaveBeenCalledWith('resetApplication', { url: '/test' }, 'myController')
    })

    it('should pushView', () => {
      const navigator = callAction({
        _beagleAction_: 'beagle:pushView',
        route: { url: '/test' },
      })

      expect(navigator.navigate).toHaveBeenCalledWith('pushView', { url: '/test' }, undefined)
    })

    it('should popStack', () => {
      const navigator = callAction({ _beagleAction_: 'beagle:popStack' })
      expect(navigator.navigate).toHaveBeenCalledWith('popStack', undefined, undefined)
    })

    it('should popView', () => {
      const navigator = callAction({ _beagleAction_: 'beagle:popView' })
      expect(navigator.navigate).toHaveBeenCalledWith('popView', undefined, undefined)
    })

    it('should popToView', () => {
      const navigator = callAction({ _beagleAction_: 'beagle:popToView', route: '/home' })
      expect(navigator.navigate).toHaveBeenCalledWith('popToView', '/home', undefined)
    })

    it('should be case-insensitive regarding the action name', () => {
      const beagleView = createBeagleViewMock()
      const navigator = beagleView.getNavigator()

      callAction({ _beagleAction_: 'beagle:pushstack' }, beagleView, 'beagle:pushStack')
      callAction({ _beagleAction_: 'beagle:resetstack' }, beagleView, 'beagle:resetStack')
      callAction(
        { _beagleAction_: 'beagle:resetapplication' },
        beagleView, 'beagle:resetApplication',
      )
      callAction({ _beagleAction_: 'beagle:pushview' }, beagleView, 'beagle:pushView')
      callAction({ _beagleAction_: 'beagle:popview' }, beagleView, 'beagle:popView')
      callAction({ _beagleAction_: 'beagle:popstack' }, beagleView, 'beagle:popStack')
      callAction({ _beagleAction_: 'beagle:poptoview' }, beagleView, 'beagle:popToView')

      expect(navigator.navigate).toHaveBeenCalledWith('pushStack', undefined, undefined)
      expect(navigator.navigate).toHaveBeenCalledWith('resetStack', undefined, undefined)
      expect(navigator.navigate).toHaveBeenCalledWith('resetApplication', undefined, undefined)
      expect(navigator.navigate).toHaveBeenCalledWith('pushView', undefined, undefined)
      expect(navigator.navigate).toHaveBeenCalledWith('popView', undefined, undefined)
      expect(navigator.navigate).toHaveBeenCalledWith('popStack', undefined, undefined)
      expect(navigator.navigate).toHaveBeenCalledWith('popToView', undefined, undefined)
    })
  })
})