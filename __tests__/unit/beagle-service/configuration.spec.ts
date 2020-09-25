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
import ComponentMetadata from 'metadata/parser'
import { BeagleConfig } from 'service/beagle-service/types'
import { mockMetadataParsing } from './configuration.mock'

describe('Beagle Service: configuration', () => {
  describe('Beagle Service: configuration: update legacy', () => {
    it('should interpret middlewares as the global lifecycle hook for beforeViewSnapshot', () => {
      const middleware1 = jest.fn(t => ({ ...t, m1: true }))
      const middleware2 = jest.fn(t => ({ ...t, m2: true }))
      const config: BeagleConfig<any> = {
        baseUrl: '',
        components: {},
        middlewares: [middleware1, middleware2],
      }

      Configuration.update(config)

      expect(config.lifecycles!.beforeViewSnapshot).toBeDefined()
      const tree = { _beagleComponent_ : 'beagle:container', id: '1' }
      const returnValue = config.lifecycles!.beforeViewSnapshot!(tree)
      expect(middleware1).toHaveBeenCalledWith(tree)
      expect(middleware2).toHaveBeenCalledWith({ ...tree, m1: true })
    })

    function shouldExecuteBothLifecycleAndMiddlewares(isLifecyclePure: boolean) {
      const beforeViewSnapshot = jest.fn(t => {
        if (isLifecyclePure) return { ...t, bfs: true }
        t.bfs = true
      })
      const middleware1 = jest.fn(t => ({ ...t, m1: true }))
      const middleware2 = jest.fn(t => ({ ...t, m2: true }))
      const config: BeagleConfig<any> = {
        baseUrl: '',
        components: {},
        middlewares: [middleware1, middleware2],
        lifecycles: { beforeViewSnapshot },
      }

      Configuration.update(config)

      const tree = { _beagleComponent_ : 'beagle:container', id: '1' }
      const returnValue = config.lifecycles!.beforeViewSnapshot!(tree)
      expect(beforeViewSnapshot).toHaveBeenCalledWith(tree)
      expect(middleware1).toHaveBeenCalledWith({ ...tree, bfs: true })
      expect(middleware2).toHaveBeenCalledWith({ ...tree, bfs: true, m1: true })
    }

    it('should execute both middlewares and the global beforeViewSnapshot (pure)', () => {
      shouldExecuteBothLifecycleAndMiddlewares(true)
    })

    it('should execute both middlewares and the global beforeViewSnapshot (impure)', () => {
      shouldExecuteBothLifecycleAndMiddlewares(false)
    })
  })

  describe('Beagle Service: configuration: component metadata', () => {
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
      const { unmockMetadataParsing, metadata } = mockMetadataParsing()
      const components = { 'beagle:container': () => null }

      const { lifecycleHooks } = Configuration.process({ baseUrl: '', components })

      expect(ComponentMetadata.extract).toHaveBeenCalledWith(components)
      expect(lifecycleHooks.beforeStart).toEqual({ components: metadata.lifecycles.beforeStart })
      expect(lifecycleHooks.beforeViewSnapshot)
        .toEqual({ components: metadata.lifecycles.beforeViewSnapshot })
      expect(lifecycleHooks.afterViewSnapshot)
        .toEqual({ components: metadata.lifecycles.afterViewSnapshot })
      expect(lifecycleHooks.beforeRender).toEqual({ components: metadata.lifecycles.beforeRender })

      unmockMetadataParsing()
    })
  })
})
