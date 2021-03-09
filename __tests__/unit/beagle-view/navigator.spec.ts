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

import cloneDeep from 'lodash/cloneDeep'
import Navigator from 'beagle-view/navigator'
import { BeagleNavigator, NavigationType, NavigationController } from 'beagle-view/navigator/types'
import { BeagleUIElement } from 'index'

describe('Beagle View: Navigator', () => {
  const history = [
    { routes: [{ url: 'stack1-view1' }] },
    { routes: [{ url: 'stack2-view1' }, { url: 'stack2-view2' }] },
  ]

  beforeEach(() => {
    globalMocks.log.mockClear()
  })

  describe('general behavior', () => {
    it('should create navigator', () => {
      const navigator = Navigator.create()
      expect(navigator).toEqual(expect.any(Object))
    })

    it('should navigate', async () => {
      const navigator = Navigator.create()
      await navigator.navigate('pushStack', { url: '/test' })
      expect(navigator.get()).toEqual([{ routes: [{ url: '/test' }] }])
    })

    it(
      'should throw error if a navigation attempts to start while another is in progress',
      async () => {
        const navigator = Navigator.create()
        let error: Error | undefined
        const promise = navigator.navigate('pushStack', { url: '/test1' })

        try {
          await navigator.navigate('pushView', { url: '/test2' })
        } catch (e) {
          error = e
        }

        expect(error).toBeDefined()
        expect(error!.message).toMatch('navigation error')
        await promise
      },
    )

    it('should be able to navigate again after another navigation has succeeded', async () => {
      const navigator = Navigator.create()
      await navigator.navigate('pushStack', { url: '/test1' })
      await navigator.navigate('pushView', { url: '/test2' })
      expect(navigator.get()).toEqual([{ routes: [{ url: '/test1' }, { url: '/test2' }] }])
    })

    it('should be able to navigate again after another navigation has been aborted', async () => {
      const navigator = Navigator.create()
      const firstNavigation = navigator.navigate('pushStack', { url: '/test1' })

      try {
        await navigator.navigate('pushView', { url: '/test2' })
      } catch { }

      await firstNavigation
      await navigator.navigate('pushView', { url: '/test3' })

      expect(navigator.get()).toEqual([{ routes: [{ url: '/test1' }, { url: '/test3' }] }])
    })

    it('should not navigate on a destroyed navigator', async () => {
      const navigator = Navigator.create()
      let error: Error | undefined
      navigator.destroy()

      try {
        await navigator.navigate('pushStack', { url: '/test1' })
      } catch (e) {
        error = e
      }

      expect(error).toBeDefined()
      expect(error!.message).toMatch('navigation error')
    })
  })

  describe('initialization', () => {
    it('should start with empty navigation history', () => {
      const navigator = Navigator.create()
      expect(navigator.get()).toEqual([])
    })

    it('should start with given navigation history', () => {
      const navigator = Navigator.create(undefined, history)
      expect(navigator.get()).toEqual(history)
    })

    it('should throw error when trying to popView on empty navigation history', async () => {
      const navigator = Navigator.create()
      let error: Error | undefined

      try {
        await navigator.popView()
      } catch (e) {
        error = e
      }

      expect(error).toBeDefined()
      expect(error!.message).toMatch('navigation error')
    })

    it('should throw error when trying to popStack on empty navigation history', async () => {
      const navigator = Navigator.create()
      let error: Error | undefined

      try {
        await navigator.popStack()
      } catch (e) {
        error = e
      }

      expect(error).toBeDefined()
      expect(error!.message).toMatch('navigation error')
    })

    it('should create both view and stack on first pushView', async () => {
      const navigator = Navigator.create()
      await navigator.pushView({ url: '/test' })
      expect(navigator.get()).toEqual([{ routes: [{ url: '/test' }] }])
    })
  })

  describe('isEmpty', () => {
    it('should be empty when there are no stacks', () => {
      const navigator = Navigator.create()
      expect(navigator.isEmpty()).toBe(true)
    })

    it('should be empty when there are no routes', () => {
      const navigator = Navigator.create(undefined, [{ routes: [] }])
      expect(navigator.isEmpty()).toBe(true)
    })

    it('should not be empty', () => {
      const navigator = Navigator.create(undefined, history)
      expect(navigator.isEmpty()).toBe(false)
    })
  })

  describe('listeners', () => {
    it('should run listener before changing the navigation history', async () => {
      const navigator = Navigator.create()
      const listener = jest.fn(() => {
        expect(navigator.get()).toEqual([])
      })
      navigator.subscribe(listener)
      await navigator.navigate('pushStack', { url: '/test' })
      expect(listener).toHaveBeenCalledWith({ url: '/test' }, {}, undefined)
    })

    it('should wait for listener and complete the navigation', async () => {
      const navigator = Navigator.create()
      const listener = () => new Promise<void>(resolve => setTimeout(resolve, 100))
      navigator.subscribe(listener)
      const promise = navigator.navigate('pushStack', { url: '/test' })
      expect(navigator.get()).toEqual([])
      await promise
      expect(navigator.get()).toEqual([{ routes: [{ url: '/test' }] }])
    })

    it('should run multiple listeners', async () => {
      const navigator = Navigator.create()
      const listeners = [jest.fn(), jest.fn(), jest.fn()]
      navigator.subscribe(listeners[0])
      navigator.subscribe(listeners[1])
      navigator.subscribe(listeners[2])
      await navigator.navigate('pushStack', { url: '/test' })

      expect(listeners[0]).toHaveBeenCalledTimes(1)
      expect(listeners[1]).toHaveBeenCalledTimes(1)
      expect(listeners[2]).toHaveBeenCalledTimes(1)
      expect(listeners[0]).toHaveBeenCalledWith({ url: '/test' }, {}, undefined)
      expect(listeners[1]).toHaveBeenCalledWith({ url: '/test' }, {}, undefined)
      expect(listeners[2]).toHaveBeenCalledWith({ url: '/test' }, {}, undefined)
    })

    it('should run multiple listeners at once and wait for all of them', async () => {
      const navigator = Navigator.create()
      let finishCounter = 0

      const listener = async () => {
        expect(finishCounter).toBe(0)
        await new Promise<void>(resolve => setTimeout(resolve, 50))
        finishCounter++
      }

      navigator.subscribe(listener)
      navigator.subscribe(listener)
      navigator.subscribe(listener)

      await navigator.navigate('pushStack', { url: '/test' })
      expect(finishCounter).toBe(3)
    })

    it('should unsubscribe listener', async () => {
      const navigator = Navigator.create()
      const listener = jest.fn()
      const unsubscribe = navigator.subscribe(listener)
      unsubscribe()
      await navigator.navigate('pushStack', { url: '/test' })
      expect(listener).not.toHaveBeenCalled()
    })

    it('should abort navigation if a listener throws an error', async () => {
      const navigator = Navigator.create()
      let hasError = false

      navigator.subscribe(() => {
        throw new Error()
      })

      try {
        await navigator.navigate('pushStack', { url: '/test' })
      } catch {
        hasError = true
      }

      expect(navigator.get()).toEqual([])
      expect(hasError).toBe(true)
    })

    it('should abort navigation if a listener rejects its promise', async () => {
      const navigator = Navigator.create()
      let hasError = false

      navigator.subscribe(() => new Promise((resolve, reject) => setTimeout(reject, 50)))

      try {
        await navigator.navigate('pushStack', { url: '/test' })
      } catch {
        hasError = true
      }

      expect(navigator.get()).toEqual([])
      expect(hasError).toBe(true)
    })
  })

  describe('navigations', () => {
    it('should pushStack', async () => {
      const navigator = Navigator.create(undefined, history)
      await navigator.pushStack({ url: 'stack3-view1' })
      expect(navigator.get()).toEqual([
        ...history,
        { routes: [{ url: 'stack3-view1' }] },
      ])
    })

    it('should resetStack', async () => {
      const navigator = Navigator.create(undefined, history)
      await navigator.resetStack({ url: 'stack3-view1' })
      expect(navigator.get()).toEqual([
        history[0],
        { routes: [{ url: 'stack3-view1' }] },
      ])
    })

    it('should resetApplication', async () => {
      const navigator = Navigator.create(undefined, history)
      await navigator.resetApplication({ url: 'stack3-view1' })
      expect(navigator.get()).toEqual([{ routes: [{ url: 'stack3-view1' }] }])
    })

    it('should pushView to top-most stack', async () => {
      const navigator = Navigator.create(undefined, history)
      await navigator.pushView({ url: 'stack2-view3' })
      expect(navigator.get()).toEqual([
        history[0],
        { routes: [...history[1].routes, { url: 'stack2-view3' }] },
      ])
    })

    it('should popView and not change stack', async () => {
      const navigator = Navigator.create(undefined, history)
      await navigator.popView()
      expect(navigator.get()).toEqual([
        history[0],
        { routes: [{ url: 'stack2-view1' }] },
      ])
    })

    it('should popView and also pop the stack', async () => {
      const anotherHistory = cloneDeep(history)
      anotherHistory[1].routes.pop()
      const navigator = Navigator.create(undefined, anotherHistory)

      await navigator.popView()
      expect(navigator.get()).toEqual([history[0]])
    })

    it('should not popView if only a single navigation entry exists', async () => {
      const anotherHistory = [history[0]]
      const navigator = Navigator.create(undefined, anotherHistory)
      let error: Error | undefined

      try {
        await navigator.popView()
      } catch (e) {
        error = e
      }

      expect(error).toBeDefined()
      expect(error!.message).toMatch('navigation error')
      expect(navigator.get()).toEqual(anotherHistory)
    })

    it('should popToView', async () => {
      const anotherHistory = cloneDeep(history)
      anotherHistory[1].routes.push({ url: 'stack2-view3' })
      anotherHistory[1].routes.push({ url: 'stack2-view4' })
      const navigator = Navigator.create(undefined, anotherHistory)

      await navigator.popToView('stack2-view2')
      expect(navigator.get()).toEqual(history)
    })

    it('should not popToView that doesn\'t exist in the current stack', async () => {
      const navigator = Navigator.create(undefined, history)
      let error: Error | undefined

      try {
        await navigator.popToView('stack1-view1')
      } catch (e) {
        error = e
      }

      expect(error).toBeDefined()
      expect(error!.message).toMatch('navigation error')
      expect(navigator.get()).toEqual(history)
    })

    it('should popStack', async () => {
      const navigator = Navigator.create(undefined, history)
      await navigator.popStack()

      expect(navigator.get()).toEqual([history[0]])
    })

    it('should not popStack if only a single stack exists', async () => {
      const anotherHistory = [history[0]]
      const navigator = Navigator.create(undefined, anotherHistory)
      let error: Error | undefined

      try {
        await navigator.popStack()
      } catch (e) {
        error = e
      }

      expect(error).toBeDefined()
      expect(error!.message).toMatch('navigation error')
      expect(navigator.get()).toEqual(anotherHistory)
    })

    it('should pop to a local view', async () => {
      const mockStack = [
        {
          routes: [
            { url: 'stack-A' },
            { screen: { _beagleComponent_: 'beagle:screencomponent', id: 'stack-B' } },
            { url: 'stack-C' }
          ]
        }
      ]

      const expectedStack = [
        {
          routes: [
            { url: 'stack-A' },
            { screen: { _beagleComponent_: 'beagle:screencomponent', id: 'stack-B' } },
          ]
        }
      ]

      const navigator = Navigator.create(undefined, mockStack)
      await navigator.popToView('stack-B')
      expect(navigator.get()).toEqual(expectedStack)
    })

    it('should pop to first view matching the route (URL)', async () => {
      const mockStack = [
        {
          routes: [
            { url: 'stack-A' },
            { url: 'stack-B' },
            { screen: { _beagleComponent_: 'beagle:screencomponent', id: 'stack-C' } },
            { url: 'stack-C' },
            { url: 'stack-D' }
          ]
        }
      ]

      const expectedStack = [
        {
          routes: [
            { url: 'stack-A' },
            { url: 'stack-B' },
            { screen: { _beagleComponent_: 'beagle:screencomponent', id: 'stack-C' } },
            { url: 'stack-C' }
          ]
        }
      ]

      const navigator = Navigator.create(undefined, mockStack)
      await navigator.popToView('stack-C')
      expect(navigator.get()).toEqual(expectedStack)
    })

    it('should pop to first view matching the route (ScreenComponent)', async () => {
      const mockStack = [
        {
          routes: [
            { url: 'stack-A' },
            { url: 'stack-B' },
            { url: 'stack-C' },
            { screen: { _beagleComponent_: 'beagle:screencomponent', id: 'stack-C' } },
            { url: 'stack-D' }
          ]
        }
      ]

      const expectedStack = [
        {
          routes: [
            { url: 'stack-A' },
            { url: 'stack-B' },
            { url: 'stack-C' },
            { screen: { _beagleComponent_: 'beagle:screencomponent', id: 'stack-C' } }
          ]
        }
      ]

      const navigator = Navigator.create(undefined, mockStack)
      await navigator.popToView('stack-C')
      expect(navigator.get()).toEqual(expectedStack)
    })

  })

  describe('generic navigation function', () => {
    async function expectNavigationError(
      type: NavigationType,
      route: any,
      navigator?: BeagleNavigator,
    ) {
      navigator = navigator || Navigator.create()
      const expectedHistory = navigator.get()
      let error: Error | undefined

      try {
        await navigator.navigate(type, route)
      } catch (e) {
        error = e
      }

      expect(error).toBeDefined()
      expect(error!.message).toMatch('navigation error')
      expect(navigator.get()).toEqual(expectedHistory)
    }

    it('should not pushStack if route is a string', () => {
      return expectNavigationError('pushStack', 'test')
    })

    it('should not resetStack if route is a string', () => {
      return expectNavigationError('resetStack', 'test')
    })

    it('should not resetApplication if route is a string', () => {
      return expectNavigationError('resetApplication', 'test')
    })

    it('should not pushView if route is a string', () => {
      return expectNavigationError('pushView', 'test')
    })

    it('should not popToView if route is an object', async () => {
      const navigator = Navigator.create(undefined, history)
      await expectNavigationError('popToView', { url: 'stack2-view1' }, navigator)
    })
  })

  describe('navigation controllers', () => {
    const controllers: Record<string, NavigationController> = {
      public: {
        default: true,
        loadingComponent: 'custom:public-loading',
        errorComponent: 'custom:public-error',
      },
      secured: {
        loadingComponent: 'custom:secured-loading',
        shouldShowError: false,
      },
    }

    async function shouldPushController(type: NavigationType) {
      const navigator = Navigator.create(controllers)
      const listener = jest.fn()
      navigator.subscribe(listener)
      await navigator.pushStack({ url: '/login' })
      await navigator.navigate(type, { url: '/account' }, 'secured')
      await navigator.pushView({ url: '/profile' })
      expect(listener).toHaveBeenCalledTimes(3)
      expect(listener.mock.calls[0]).toEqual([expect.anything(), controllers.public, undefined])
      expect(listener.mock.calls[1]).toEqual([expect.anything(), controllers.public, undefined])
      expect(listener.mock.calls[2]).toEqual([expect.anything(), controllers.secured, undefined])
    }

    async function shouldPopController(type: NavigationType) {
      const navigator = Navigator.create(controllers)
      const listener = jest.fn()
      navigator.subscribe(listener)
      await navigator.pushStack({ url: '/login' })
      await navigator.pushStack({ url: '/account' }, 'secured')
      await navigator.navigate(type)
      await navigator.pushView({ url: '/sign-up' })
      expect(listener).toHaveBeenCalledTimes(4)
      expect(listener.mock.calls[0]).toEqual([expect.anything(), controllers.public, undefined])
      expect(listener.mock.calls[1]).toEqual([expect.anything(), controllers.public, undefined])
      expect(listener.mock.calls[2]).toEqual([expect.anything(), controllers.secured, undefined])
      expect(listener.mock.calls[3]).toEqual([expect.anything(), controllers.public, undefined])
    }

    it('should use default controller', async () => {
      const navigator = Navigator.create(controllers)
      const listener = jest.fn()
      navigator.subscribe(listener)
      await navigator.pushStack({ url: '/sign-up' })
      expect(listener).toHaveBeenCalledWith(expect.anything(), controllers.public, undefined)
    })

    it('should use the controller given in the initial value', async () => {
      const navigator = Navigator.create(controllers, [{ routes: [], controllerId: 'secured' }])
      const listener = jest.fn()
      navigator.subscribe(listener)
      await navigator.pushView({ url: '/account' })
      expect(listener).toHaveBeenCalledWith(expect.anything(), controllers.secured, undefined)
    })

    it('should change the controller after a pushStack', () => {
      return shouldPushController('pushStack')
    })

    it('should change the controller after a resetStack', () => {
      return shouldPushController('resetStack')
    })

    it('should change the controller after a resetApplication', async () => {
      return shouldPushController('resetApplication')
    })

    it('should go back to the previous controller after a popStack', async () => {
      return shouldPopController('popStack')
    })

    it(
      'should go back to the previous controller after a popView that also pops the stack',
      () => shouldPopController('popView'),
    )

    it(
      'should not go back to the previous controller if the popView doesn\'t pop the stack',
      async () => {
        const navigator = Navigator.create(controllers)
        const listener = jest.fn()
        navigator.subscribe(listener)

        await navigator.pushStack({ url: '/login' })
        await navigator.pushStack({ url: '/account' }, 'secured')
        await navigator.pushView({ url: '/profile' })
        await navigator.popView()
        await navigator.pushView({ url: '/order' })

        expect(listener).toHaveBeenCalledTimes(5)
        expect(listener.mock.calls[0]).toEqual([expect.anything(), controllers.public, undefined])
        expect(listener.mock.calls[1]).toEqual([expect.anything(), controllers.public, undefined])
        expect(listener.mock.calls[2]).toEqual([expect.anything(), controllers.secured, undefined])
        expect(listener.mock.calls[3]).toEqual([expect.anything(), controllers.secured, undefined])
        expect(listener.mock.calls[4]).toEqual([expect.anything(), controllers.secured, undefined])
      },
    )

    it('should not change the controller on popToView or pushView', async () => {
      const navigator = Navigator.create(controllers)
      const listener = jest.fn()
      navigator.subscribe(listener)

      await navigator.navigate('pushStack', { url: '/account' }, 'secured')
      await navigator.navigate('pushView', { url: '/profile' }, 'public')
      await navigator.navigate('pushView', { url: '/order' }, 'public')
      await navigator.navigate('pushView', { url: '/payment' }, 'public')
      await navigator.navigate('popToView', '/account', 'public')
      await navigator.navigate('pushView', { url: '/products' }, 'public')

      expect(listener).toHaveBeenCalledTimes(6)
      expect(listener.mock.calls[0]).toEqual([expect.anything(), controllers.public, undefined])
      expect(listener.mock.calls[1]).toEqual([expect.anything(), controllers.secured, undefined])
      expect(listener.mock.calls[2]).toEqual([expect.anything(), controllers.secured, undefined])
      expect(listener.mock.calls[3]).toEqual([expect.anything(), controllers.secured, undefined])
      expect(listener.mock.calls[4]).toEqual([expect.anything(), controllers.secured, undefined])
      expect(listener.mock.calls[5]).toEqual([expect.anything(), controllers.secured, undefined])
    })

    it('should log warning and use default controller if the controller is not found', async () => {
      const navigator = Navigator.create(controllers)
      const listener = jest.fn()
      navigator.subscribe(listener)

      await navigator.pushStack({ url: '/account' }, 'blah')
      await navigator.pushView({ url: '/profile' })

      expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(String))
      expect(listener).toHaveBeenLastCalledWith(expect.anything(), controllers.public, undefined)
    })

    it('should use empty object as default controller if no default is specified', async () => {
      const navigator = Navigator.create({
        public: { ...controllers.public, default: false },
        secured: controllers.secured,
      })

      const listener = jest.fn()
      navigator.subscribe(listener)
      navigator.pushStack({ url: '/account' })

      expect(listener).toHaveBeenCalledWith(expect.anything(), {}, undefined)
    })

    it('should log warning and use empty object if no controller exists', async () => {
      const navigator = Navigator.create()
      const listener = jest.fn()
      navigator.subscribe(listener)

      await navigator.pushStack({ url: '/account' }, 'blah')
      await navigator.pushView({ url: '/profile' })

      expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(String))
      expect(listener).toHaveBeenLastCalledWith(expect.anything(), {}, undefined)
    })
  })

  describe('Navigation State', () => {

    it('should call listener with saved element when popView', async () => {
      const mockElement: BeagleUIElement = { _beagleComponent_: "beagle:test" }
      const navigator = Navigator.create(undefined, [{ routes: [{ url: "/home" }] }], () => mockElement)
      const listener = jest.fn()
      navigator.subscribe(listener)

      await navigator.pushStack({ url: '/account' }, 'blah')
      await navigator.pushView({ url: '/profile' })
      await navigator.popView()

      expect(listener).toHaveBeenLastCalledWith(expect.anything(), {}, mockElement)
    })

    it('should call listener with saved element when popStack', async () => {
      const mockElement: BeagleUIElement = { _beagleComponent_: "beagle:test" }
      const navigator = Navigator.create(undefined, [{ routes: [{ url: "/home" }] }], () => mockElement)
      const listener = jest.fn()
      navigator.subscribe(listener)

      await navigator.pushStack({ url: '/account' }, 'blah')
      await navigator.pushStack({ url: '/configuration' }, 'blah')
      await navigator.pushView({ url: '/profile' })
      await navigator.popStack()

      expect(listener).toHaveBeenLastCalledWith(expect.anything(), {}, mockElement)
    })

    it('should call listener with saved element when popToView', async () => {
      const mockElement: BeagleUIElement = { _beagleComponent_: "beagle:test" }
      const navigator = Navigator.create(undefined, [{ routes: [{ url: "/home" }] }], () => mockElement)
      const listener = jest.fn()
      navigator.subscribe(listener)

      await navigator.pushView({ screen: {_beagleComponent_:""} })
      await navigator.pushView({ screen: {_beagleComponent_:"", id:"myId"} })
      await navigator.pushView({ screen: {_beagleComponent_:""} })
      await navigator.pushView({ screen: {_beagleComponent_:""} })
      await navigator.popToView('myId')


      expect(listener).toHaveBeenCalledWith(expect.anything(), {}, mockElement)
    })

    it('should NOT call listener with saved element when pushStack', async () => {
      const mockElement: BeagleUIElement = { _beagleComponent_: "beagle:test" }
      const navigator = Navigator.create(undefined, [{ routes: [{ url: "/home" }] }], () => mockElement)
      const listener = jest.fn()
      navigator.subscribe(listener)

      await navigator.pushStack({ url: '/account' }, 'blah')

      expect(listener).toHaveBeenCalledWith(expect.anything(), {}, undefined)
    })

    it('should NOT call listener with saved element when pushStack', async () => {
      const mockElement: BeagleUIElement = { _beagleComponent_: "beagle:test" }
      const navigator = Navigator.create(undefined, [{ routes: [{ url: "/home" }] }], () => mockElement)
      const listener = jest.fn()
      navigator.subscribe(listener)

      await navigator.pushView({ url: '/account' })

      expect(listener).toHaveBeenCalledWith(expect.anything(), {}, undefined)
    })

    
  })

})
