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
import BeagleError from 'error/BeagleError'

describe('Beagle Service: configuration', () => {
  describe('Beagle Service: configuration: validate', () => {
    it('should throw error if overriding default operations', () => {
      const mockConfig: BeagleConfig<any> = {
        baseUrl: 'url.com',
        components: {},
        customOperations: { 'sum': ((variable: string) => variable) }
      }

      Configuration.validate(mockConfig)
      expect(globalMocks.log).toHaveBeenLastCalledWith('warn', "You are overriding a default operation \"sum\"")
    })

    it('should throw error when invalid operation names', () => {
      const mockConfig: BeagleConfig<any> = {
        baseUrl: 'url.com',
        components: {},
        customOperations: { 'sum': ((variable: string) => variable), 'myFunc*-': ((variable: number) => variable) }
      }

      expect(() => Configuration.validate(mockConfig)).toThrow(expect.any(BeagleError))
    })

    it('should keep two operations with the same name (case-insensitive)', () => {
      const mockConfig: BeagleConfig<any> = {
        baseUrl: 'url.com',
        components: {},
        customOperations: { 'function': ((variable: string) => variable), 'FUNCTION': ((variable: number) => variable) }
      }

      Configuration.validate(mockConfig)

      expect(Object.keys({ ...mockConfig.customOperations })).toEqual(['function', 'FUNCTION'])
      expect(Object.keys({ ...mockConfig.customOperations }).length).toEqual(2)

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
