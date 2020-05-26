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

import createBeagleNavigator from '../src/BeagleNavigator'
import { BeagleNavigator } from '../src/types'

describe('BeagleNavigator', () => {
  const initialRoute = { url: 'home' }
  const initialStack = [initialRoute]
  const navigator: BeagleNavigator = createBeagleNavigator(initialRoute)

  it('should get initial beagle navigator', () => {
    expect(navigator.get()).toEqual([initialStack])
  })

  it('should pushStack', () => {
    navigator['beagle:pushStack']({ url: 'first' })
    expect(navigator.get()).toEqual([initialStack, [{ url: 'first' }]])
  })

  it('should pushView', () => {
    navigator['beagle:pushView']({ url: 'second' })
    expect(navigator.get()).toEqual([initialStack, [{ url: 'first' }, { url: 'second' }]])
  })

  it('should popStack', () => {
    const route = navigator['beagle:popStack']()
    expect(navigator.get()).toEqual([initialStack])
    expect(route).toBe(initialRoute)
  })

  it('should popView', () => {
    navigator['beagle:pushView']({ url: 'first' })
    navigator['beagle:pushView']({ url: 'second' })
    const route = navigator['beagle:popView']()
    expect(navigator.get()).toEqual([[initialRoute, { url: 'first' }]])
    expect(route).toStrictEqual({ url: 'first' })
  })

  it('should popToView', () => {
    navigator['beagle:pushView']({ url: 'second' })
    const route = navigator['beagle:popToView'](initialRoute)
    expect(navigator.get()).toEqual([initialStack])
    expect(route).toBe(initialRoute)
  })

  it('should reset current stack', () => {
    navigator['beagle:pushStack']({ url: 'newStack' })
    navigator['beagle:resetStack']({ url: 'resetingStack' })
    expect(navigator.get()).toEqual([initialStack, [{ url : 'resetingStack' }]])
  })

  it('should reset beagle navigator', () => {
    navigator['beagle:resetApplication']({ url: 'resetingApplication' })
    expect(navigator.get()).toEqual([[{ url : 'resetingApplication' }]])
  })

  it('should throw an error when popView on a single stack', () => {
    const route = () => navigator['beagle:popView']()
    expect(route).toThrowError()
  })

  it('should throw an error when popToView with a non-existent route', () => {
    const route = () => navigator['beagle:popToView']({ url: 'non-existent-route' })
    expect(route).toThrowError()
  })

  it('should throw an error when popStack on a single stack', () => {
    const route = () => navigator['beagle:popStack']()
    expect(route).toThrowError()
  })
})
