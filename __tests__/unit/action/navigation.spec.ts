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
  async function callAction(
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

    await navigationActions[navigationType || action._beagleAction_](params)
    return beagleView.getNavigator()
  }

  beforeEach(() => {
    globalMocks.log.mockClear()
  })

  describe('native navigation', () => {
    const originalWindow = window

    beforeEach(() => {
      // @ts-ignore
      window = { open: jest.fn(() => {}), location: { origin: 'origin', href: '' } }
    })

    afterEach(() => {
      window = originalWindow
    })

    it('should open external url', async () => {
      const url = 'https://www.google.com'
      await callAction({
        _beagleAction_: 'beagle:openExternalURL',
        url,
      })

      expect(window.open).toHaveBeenCalledWith(url)
    })

    it('should open native route', async () => {
      await callAction({
        _beagleAction_: 'beagle:openNativeRoute',
        route: 'test',
        data: { param: '1' },
      })

      expect(window.location.href).toBe('origin/test?param=1')
    })
  })

  describe('beagle navigation', () => {
    it('should pushStack', async () => {
      const navigator = await callAction({
        _beagleAction_: 'beagle:pushStack',
        route: { url: '/test' },
        controllerId: 'myController',
      })

      expect(navigator).toBeDefined()
      expect(navigator!.navigate).toHaveBeenCalledWith('pushStack', { url: '/test' }, 'myController')
    })

    it('should resetStack', async () => {
      const navigator = await callAction({
        _beagleAction_: 'beagle:resetStack',
        route: { url: '/test' },
        controllerId: 'myController',
      })

      expect(navigator).toBeDefined()
      expect(navigator!.navigate)
        .toHaveBeenCalledWith('resetStack', { url: '/test' }, 'myController')
    })

    it('should resetApplication', async () => {
      const navigator = await callAction({
        _beagleAction_: 'beagle:resetApplication',
        route: { url: '/test' },
        controllerId: 'myController',
      })

      expect(navigator).toBeDefined()
      expect(navigator!.navigate)
        .toHaveBeenCalledWith('resetApplication', { url: '/test' }, 'myController')
    })

    it('should pushView', async () => {
      const navigator = await callAction({
        _beagleAction_: 'beagle:pushView',
        route: { url: '/test' },
      })

      expect(navigator).toBeDefined()
      expect(navigator!.navigate).toHaveBeenCalledWith('pushView', { url: '/test' }, undefined)
    })

    it('should popStack', async () => {
      const navigator = await callAction({ _beagleAction_: 'beagle:popStack' })
      expect(navigator).toBeDefined()
      expect(navigator!.navigate).toHaveBeenCalledWith('popStack', undefined, undefined)
    })

    it('should popView', async () => {
      const navigator = await callAction({ _beagleAction_: 'beagle:popView' })
      expect(navigator).toBeDefined()
      expect(navigator!.navigate).toHaveBeenCalledWith('popView', undefined, undefined)
    })

    it('should popToView', async () => {
      const navigator = await callAction({ _beagleAction_: 'beagle:popToView', route: '/home' })
      expect(navigator).toBeDefined()
      expect(navigator!.navigate).toHaveBeenCalledWith('popToView', '/home', undefined)
    })

    it('should be case-insensitive regarding the action name', async () => {
      const beagleView = createBeagleViewMock()
      const navigator = beagleView.getNavigator()

      await callAction({ _beagleAction_: 'beagle:pushstack' }, beagleView, 'beagle:pushStack')
      await callAction({ _beagleAction_: 'beagle:resetstack' }, beagleView, 'beagle:resetStack')
      await callAction(
        { _beagleAction_: 'beagle:resetapplication' },
        beagleView, 'beagle:resetApplication',
      )
      await callAction({ _beagleAction_: 'beagle:pushview' }, beagleView, 'beagle:pushView')
      await callAction({ _beagleAction_: 'beagle:popview' }, beagleView, 'beagle:popView')
      await callAction({ _beagleAction_: 'beagle:popstack' }, beagleView, 'beagle:popStack')
      await callAction({ _beagleAction_: 'beagle:poptoview' }, beagleView, 'beagle:popToView')

      expect(navigator).toBeDefined()
      expect(navigator!.navigate).toHaveBeenCalledWith('pushStack', undefined, undefined)
      expect(navigator!.navigate).toHaveBeenCalledWith('resetStack', undefined, undefined)
      expect(navigator!.navigate).toHaveBeenCalledWith('resetApplication', undefined, undefined)
      expect(navigator!.navigate).toHaveBeenCalledWith('pushView', undefined, undefined)
      expect(navigator!.navigate).toHaveBeenCalledWith('popView', undefined, undefined)
      expect(navigator!.navigate).toHaveBeenCalledWith('popStack', undefined, undefined)
      expect(navigator!.navigate).toHaveBeenCalledWith('popToView', undefined, undefined)
    })

    it('should log error', async () => {
      const beagleView = createBeagleViewMock()
      const navigator = beagleView.getNavigator()
      expect(navigator).toBeDefined()
      navigator!.navigate = async () => {
        throw new Error('test error')
      }
      await callAction({ _beagleAction_: 'beagle:popView' }, beagleView)
      expect(globalMocks.log).toHaveBeenCalledWith('error', 'test error')
    })
  })
})
