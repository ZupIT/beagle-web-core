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

import BeagleNavigator from 'beagle-view/navigator'

describe('BeagleNavigator', () => {
  const initialRoute = { url: 'home' }
  const initialStack = [initialRoute]
  const navigator = BeagleNavigator.create(initialRoute)

  it('should get initial beagle navigator', () => {
    expect(navigator.get()).toEqual([initialStack])
  })

  it('should pushStack', () => {
    navigator.pushStack({ url: 'first' })
    expect(navigator.get()).toEqual([initialStack, [{ url: 'first' }]])
  })

  it('should pushView', () => {
    navigator.pushView({ url: 'second' })
    expect(navigator.get()).toEqual([initialStack, [{ url: 'first' }, { url: 'second' }]])
  })

  it('should popStack', () => {
    const route = navigator.popStack()
    expect(navigator.get()).toEqual([initialStack])
    expect(route).toBe(initialRoute)
  })

  it('should popView', () => {
    navigator.pushView({ url: 'first' })
    navigator.pushView({ url: 'second' })
    const route = navigator.popView()
    expect(navigator.get()).toEqual([[initialRoute, { url: 'first' }]])
    expect(route).toStrictEqual({ url: 'first' })
  })

  it('should popToView', () => {
    navigator.pushView({ url: 'second' })
    const route = navigator.popToView(initialRoute.url)
    expect(navigator.get()).toEqual([initialStack])
    expect(route).toBe(initialRoute)
  })

  it('should reset current stack', () => {
    navigator.pushStack({ url: 'newStack' })
    navigator.resetStack({ url: 'resetingStack' })
    expect(navigator.get()).toEqual([initialStack, [{ url : 'resetingStack' }]])
  })

  it('should reset beagle navigator', () => {
    navigator.resetApplication({ url: 'resetingApplication' })
    expect(navigator.get()).toEqual([[{ url : 'resetingApplication' }]])
  })

  it('should throw an error when popView on a single stack', () => {
    const route = () => navigator.popView()
    expect(route).toThrowError()
  })

  it('should throw an error when popToView with a non-existent route', () => {
    const route = () => navigator.popToView('non-existent-route')
    expect(route).toThrowError()
  })

  it('should throw an error when popStack on a single stack', () => {
    const route = () => navigator.popStack()
    expect(route).toThrowError()
  })
})
