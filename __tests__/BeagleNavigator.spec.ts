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

import * as nock from 'nock'
import createBeagleNavigator from '../src/BeagleNavigator'
import { BeagleNavigator } from '../src/types'

describe('BeagleNavigator', () => {
  const initialRoute = 'home'
  const initialStack = [initialRoute]
  const navigator: BeagleNavigator = createBeagleNavigator(initialRoute)

  it('should get initial beagle navigator', () => {
    expect(navigator.get()).toEqual([initialStack])
  })

  it('should pushStack', () => {
    navigator.pushStack('first')
    expect(navigator.get()).toEqual([initialStack, ['first']])
  })

  it('should pushView', () => {
    navigator.pushView('second')
    expect(navigator.get()).toEqual([initialStack, ['first', 'second']])
  })

  it('should popStack', () => {
    const route = navigator.popView()
    expect(navigator.get()).toEqual([initialStack, ['first']])
    expect(route).toBe('first')
  })

  it('should popView', () => {
    const route = navigator.popView()
    expect(navigator.get()).toEqual([initialStack])
    expect(route).toBe(initialRoute)
  })

  it('should ensure pop actions wont empty navigation', () => {
    navigator.popView()
    expect(navigator.get()).toEqual([initialStack])
    navigator.popStack()
    expect(navigator.get()).toEqual([initialStack])
  })

  it('should reset beagle navigator', () => {
    navigator.resetStackNavigator('resetingStack')
    expect(navigator.get()).toEqual([['resetingStack']])
  })
})
