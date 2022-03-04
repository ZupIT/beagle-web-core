/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import {
  AfterViewSnapshot,
  BeagleChildren,
  BeforeRender,
  BeforeStart,
  BeforeViewSnapshot,
} from 'metadata/decorator'

describe('Metadata: decorators', () => {
  it('should attach beforeStart lifecycle hook to component', () => {
    const hook = jest.fn()

    @BeforeStart(hook)
    class Container {}

    expect((Container as any).beagleMetadata.lifecycles.beforeStart).toBe(hook)
  })

  it('should attach beforeViewSnapshot lifecycle hook to component', () => {
    const hook = jest.fn()

    @BeforeViewSnapshot(hook)
    class Container {}

    expect((Container as any).beagleMetadata.lifecycles.beforeViewSnapshot).toBe(hook)
  })

  it('should attach afterViewSnapshot lifecycle hook to component', () => {
    const hook = jest.fn()

    @AfterViewSnapshot(hook)
    class Container {}

    expect((Container as any).beagleMetadata.lifecycles.afterViewSnapshot).toBe(hook)
  })

  it('should attach beforeRender lifecycle hook to component', () => {
    const hook = jest.fn()

    @BeforeRender(hook)
    class Container {}

    expect((Container as any).beagleMetadata.lifecycles.beforeRender).toBe(hook)
  })

  it('should attach children metadata to component', () => {
    @BeagleChildren({ property: 'rows' })
    class Table {}

    expect((Table as any).beagleMetadata.children).toEqual({ property: 'rows' })
  })

  it('should attach multiple lifecycle hooks and children metadata to component', () => {
    const beforeStart = jest.fn()
    const beforeViewSnapshot = jest.fn()
    const afterViewSnapshot = jest.fn()
    const beforeRender = jest.fn()

    @BeforeStart(beforeStart)
    @BeforeViewSnapshot(beforeViewSnapshot)
    @AfterViewSnapshot(afterViewSnapshot)
    @BeforeRender(beforeRender)
    @BeagleChildren({ property: 'tabs', type: ['beagle:tab-item'] })
    class TabGroup {}

    expect((TabGroup as any).beagleMetadata).toEqual({
      lifecycles: {
        beforeStart,
        beforeViewSnapshot,
        afterViewSnapshot,
        beforeRender,
      },
      children: {
        property: 'tabs',
        type: ['beagle:tab-item'],
      },
    })
  })

  it('should attach multiple lifecycle hooks and children metadata to functional component', () => {
    const beforeStart = jest.fn()
    const beforeViewSnapshot = jest.fn()
    const afterViewSnapshot = jest.fn()
    const beforeRender = jest.fn()

    const TabGroup = () => null
    BeforeStart(beforeStart)(TabGroup)
    BeforeViewSnapshot(beforeViewSnapshot)(TabGroup)
    AfterViewSnapshot(afterViewSnapshot)(TabGroup)
    BeforeRender(beforeRender)(TabGroup)
    BeagleChildren({ property: 'tabs', type: ['beagle:tab-item'] })(TabGroup)

    expect((TabGroup as any).beagleMetadata).toEqual({
      lifecycles: {
        beforeStart,
        beforeViewSnapshot,
        afterViewSnapshot,
        beforeRender,
      },
      children: {
        property: 'tabs',
        type: ['beagle:tab-item'],
      },
    })
  })

  it('should be compatible with Angular', () => {
    // arrow functions are not compatible with Angular
    expect(BeforeStart.toString()).toMatch(/^function/)
    expect(BeforeStart(jest.fn()).toString()).toMatch(/^function/)

    expect(BeforeViewSnapshot.toString()).toMatch(/^function/)
    expect(BeforeViewSnapshot(jest.fn()).toString()).toMatch(/^function/)

    expect(AfterViewSnapshot.toString()).toMatch(/^function/)
    expect(AfterViewSnapshot(jest.fn()).toString()).toMatch(/^function/)

    expect(BeforeRender.toString()).toMatch(/^function/)
    expect(BeforeRender(jest.fn()).toString()).toMatch(/^function/)
  })
})
