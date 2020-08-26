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

import Configuration from 'service/beagle-service/configuration'

describe('Beagle Service', () => {
  it('should create global lifecycles', () => {
    const beforeStart = jest.fn()
    const beforeViewSnapshot = jest.fn()
    const afterViewSnapshot = jest.fn()
    const beforeRender = jest.fn()

    const { lifecycleHooks } = Configuration.process({
      baseUrl: '',
      components: {},
      lifecycles: { beforeStart, beforeViewSnapshot, afterViewSnapshot, beforeRender },
    })

    expect(lifecycleHooks.beforeStart.global).toBe(beforeStart)
    expect(lifecycleHooks.beforeViewSnapshot.global).toBe(beforeViewSnapshot)
    expect(lifecycleHooks.afterViewSnapshot.global).toBe(afterViewSnapshot)
    expect(lifecycleHooks.beforeRender.global).toBe(beforeRender)
  })

  it('should create components lifecycles', () => {
    const Container = () => null
    const Button = () => null
    const Text = () => null
    const Image = () => null

    const containerBeforeStart = jest.fn()
    const containerBeforeRender = jest.fn()
    const buttonAfterViewSnapshot = jest.fn()
    const textBeforeStart = jest.fn()
    const textBeforeViewSnapshot = jest.fn()
    const textAfterViewSnapshot = jest.fn()
    const textBeforeRender = jest.fn()

    Container.beagleMetadata = {
      lifecycles: {
        beforeStart: containerBeforeStart,
        beforeRender: containerBeforeRender,
      },
    }

    Button.beagleMetadata = {
      lifecycles: {
        afterViewSnapshot: buttonAfterViewSnapshot,
      },
    }

    Text.beagleMetadata = {
      lifecycles: {
        beforeStart: textBeforeStart,
        beforeViewSnapshot: textBeforeViewSnapshot,
        afterViewSnapshot: textAfterViewSnapshot,
        beforeRender: textBeforeRender,
      },
    }

    const { lifecycleHooks } = Configuration.process({
      baseUrl: '',
      components: {
        'beagle:container': Container,
        'beagle:button': Button,
        'beagle:text': Text,
        'beagle:image': Image,
      },
    })

    expect(lifecycleHooks.beforeStart.global).toBeUndefined()
    expect(lifecycleHooks.beforeViewSnapshot.global).toBeUndefined()
    expect(lifecycleHooks.afterViewSnapshot.global).toBeUndefined()
    expect(lifecycleHooks.beforeRender.global).toBeUndefined()

    expect(lifecycleHooks.beforeStart.components['beagle:container']).toBe(containerBeforeStart)
    expect(lifecycleHooks.beforeViewSnapshot.components['beagle:container']).toBeUndefined()
    expect(lifecycleHooks.afterViewSnapshot.components['beagle:container']).toBeUndefined()
    expect(lifecycleHooks.beforeRender.components['beagle:container']).toBe(containerBeforeRender)

    expect(lifecycleHooks.beforeStart.components['beagle:button']).toBeUndefined()
    expect(lifecycleHooks.beforeViewSnapshot.components['beagle:button']).toBeUndefined()
    expect(lifecycleHooks.afterViewSnapshot.components['beagle:button']).toBe(buttonAfterViewSnapshot)
    expect(lifecycleHooks.beforeRender.components['beagle:button']).toBeUndefined()

    expect(lifecycleHooks.beforeStart.components['beagle:text']).toBe(textBeforeStart)
    expect(lifecycleHooks.beforeViewSnapshot.components['beagle:text']).toBe(textBeforeViewSnapshot)
    expect(lifecycleHooks.afterViewSnapshot.components['beagle:text']).toBe(textAfterViewSnapshot)
    expect(lifecycleHooks.beforeRender.components['beagle:text']).toBe(textBeforeRender)

    expect(lifecycleHooks.beforeStart.components['beagle:image']).toBeUndefined()
    expect(lifecycleHooks.beforeViewSnapshot.components['beagle:image']).toBeUndefined()
    expect(lifecycleHooks.afterViewSnapshot.components['beagle:image']).toBeUndefined()
    expect(lifecycleHooks.beforeRender.components['beagle:image']).toBeUndefined()
  })

  it('should create lifecycle hooks considering case insensitivity for components', () => {
    const Container = () => null
    const containerBeforeStart = jest.fn()

    Container.beagleMetadata = {
      lifecycles: {
        beforeStart: containerBeforeStart,
      },
    }

    const { lifecycleHooks } = Configuration.process({
      baseUrl: '',
      components: {
        'bEAgle:coNTAiner': Container,
      },
    })

    expect(lifecycleHooks.beforeStart.components['beagle:container']).toBe(containerBeforeStart)
  })
})
