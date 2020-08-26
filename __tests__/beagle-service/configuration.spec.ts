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
import { mockMetadataParsing } from './configuration.mock'

describe('Beagle Service: configuration', () => {
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
