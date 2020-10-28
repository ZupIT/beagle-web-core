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
import BrowserNavigator from 'beagle-view/navigator/browser-navigator'
import { BeagleNavigator, NavigationType, NavigationController, HistoryState } from 'beagle-view/navigator/types'

/**
 * @jest-environment jsdom
 */

beforeEach(() => {

  //@ts-ignore
  window = { history: { state: {}, length: 0, back: jest.fn(), pushState: jest.fn() }, addEventListener: jest.fn(), removeEventListener: jest.fn() }
  globalMocks.log.mockClear()
})


describe('Browser Navigator', () => {

  it('should create navigator', () => {
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    expect(navigator).toEqual(expect.any(Object))
  })


  it('should navigate', async () => {
    const mockHistoryState: HistoryState = {
      controllerId: undefined,
      isBeagleState: true,
      route: { url: '/test' },
      stack: 0,
    }

    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    await navigator.navigate('pushStack', { url: '/test' })
    expect(window.history.pushState).toHaveBeenCalledWith(mockHistoryState, "")
  })

  it('should throw error if a navigation attempts to start while another is in progress',
    async () => {
      const navigator = BrowserNavigator.create({}, [{ routes: [] }])
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
    })

  it('should be able to navigate again after another navigation has succeeded', async () => {
    const mockHistoryStateA: HistoryState = {
      controllerId: undefined,
      isBeagleState: true,
      route: { url: '/test' },
      stack: 0,
    }
    const mockHistoryStateB: HistoryState = {
      controllerId: undefined,
      isBeagleState: true,
      route: { url: '/test-B' },
      stack: 0,
    }
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    await navigator.navigate('pushStack', { url: '/test' })
    await navigator.navigate('pushView', { url: '/test-B' })
    expect(window.history.pushState).toHaveBeenCalledWith(mockHistoryStateA, "")
    expect(window.history.pushState).toHaveBeenCalledWith(mockHistoryStateB, "")
  })

  it('should be able to navigate again after another navigation has been aborted', async () => {
    const mockHistoryStateA: HistoryState = {
      controllerId: undefined,
      isBeagleState: true,
      route: { url: '/test' },
      stack: 0,
    }
    const mockHistoryStateB: HistoryState = {
      controllerId: undefined,
      isBeagleState: true,
      route: { url: '/test-B' },
      stack: 0,
    }
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    const firstNavigation = navigator.navigate('pushStack', { url: '/test1' })

    try {
      await navigator.navigate('pushView', { url: '/test' })
    } catch { }

    await firstNavigation
    await navigator.navigate('pushView', { url: '/test-B' })

    expect(window.history.pushState).toHaveBeenCalledWith(mockHistoryStateB, "")
  })

  it('should not navigate on a destroyed navigator', async () => {
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
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


  it('should start with initial navigation state if state undefined', () => {
    const initialState: HistoryState = {
      isBeagleState: true,
      route: { url: '/test' },
      controllerId: undefined,
      stack: 0,
    }
    //@ts-ignore
    window.history.state = undefined
    const navigator = BrowserNavigator.create({}, [{ routes: [{ url: '/test' }] }])
    expect(window.history.pushState).toHaveBeenCalledWith(initialState, "")
  })



  it('should throw error when trying to popView on empty navigation history', async () => {
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    let error: Error | undefined

    //@ts-ignore
    window.history.length = 0

    try {
      await navigator.popView()
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
    expect(error!.message).toMatch('navigation error')
  })

  it('should throw error when trying to popStack on empty navigation history', async () => {
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    let error: Error | undefined

    //@ts-ignore
    window.history.state = { stack: 0 }

    try {
      await navigator.popStack()
    } catch (e) {
      error = e
    }

    expect(error).toBeDefined()
    expect(error!.message).toMatch('navigation error')
  })



  describe('isEmpty', () => {
    it('should be empty when there are no stacks', () => {
      const navigator = BrowserNavigator.create({}, [{ routes: [] }])
      //@ts-ignore
      window.history.state = { stack: 0 }
      expect(navigator.isEmpty()).toBe(true)
    })

    it('should be empty when there are no routes', () => {
      const navigator = BrowserNavigator.create({}, [{ routes: [] }])
      //@ts-ignore
      window.history.state = { route: undefined }
      expect(navigator.isEmpty()).toBe(true)
    })

  })
})




describe('listeners', () => {
  it('should run listener before changing the navigation history', async () => {
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    //@ts-ignore
    window.history.state = { route: [] }
    const listener = jest.fn(() => {
      expect(navigator.get()).toEqual([])
    })
    navigator.subscribe(listener)
    await navigator.navigate('pushStack', { url: '/test' })
    expect(listener).toHaveBeenCalledWith({ url: '/test' }, expect.anything())
  })


  it('should run multiple listeners', async () => {
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    const listeners = [jest.fn(), jest.fn(), jest.fn()]
    navigator.subscribe(listeners[0])
    navigator.subscribe(listeners[1])
    navigator.subscribe(listeners[2])
    await navigator.navigate('pushStack', { url: '/test' })

    expect(listeners[0]).toHaveBeenCalledTimes(1)
    expect(listeners[1]).toHaveBeenCalledTimes(1)
    expect(listeners[2]).toHaveBeenCalledTimes(1)
    expect(listeners[0]).toHaveBeenCalledWith({ url: '/test' }, expect.anything())
    expect(listeners[1]).toHaveBeenCalledWith({ url: '/test' }, expect.anything())
    expect(listeners[2]).toHaveBeenCalledWith({ url: '/test' }, expect.anything())
  })

  it('should run multiple listeners at once and wait for all of them', async () => {
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
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
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    const listener = jest.fn()
    const unsubscribe = navigator.subscribe(listener)
    unsubscribe()
    await navigator.navigate('pushStack', { url: '/test' })
    expect(listener).not.toHaveBeenCalled()
  })

  it('should abort navigation if a listener throws an error', async () => {
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    let hasError = false

    navigator.subscribe(() => {
      throw new Error()
    })

    try {
      await navigator.navigate('pushStack', { url: '/test' })
    } catch {
      hasError = true
    }

    expect(navigator.get()).toEqual(undefined)
    expect(hasError).toBe(true)
  })

  it('should abort navigation if a listener rejects its promise', async () => {
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    let hasError = false

    navigator.subscribe(() => new Promise((resolve, reject) => setTimeout(reject, 50)))

    try {
      await navigator.navigate('pushStack', { url: '/test' })
    } catch {
      hasError = true
    }

    expect(navigator.get()).toEqual(undefined)
    expect(hasError).toBe(true)
  })
})







describe('navigations', () => {
  it('should pushStack', async () => {
    const mockHistoryState: HistoryState = {
      controllerId: undefined,
      isBeagleState: true,
      route: { url: 'stack3-view1' },
      stack: 0,
    }
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    await navigator.pushStack({ url: 'stack3-view1' })
    expect(window.history.pushState).toHaveBeenCalledWith(mockHistoryState, "")
  })

  it('should pushView', async () => {
    const mockHistoryState: HistoryState = {
      controllerId: undefined,
      isBeagleState: true,
      route: { url: 'stack3-view1' },
      stack: 0,
    }
    const navigator = BrowserNavigator.create({}, [{ routes: [] }])
    await navigator.pushView({ url: 'stack3-view1' })
    expect(window.history.pushState).toHaveBeenCalledWith(mockHistoryState, "")
  })
})