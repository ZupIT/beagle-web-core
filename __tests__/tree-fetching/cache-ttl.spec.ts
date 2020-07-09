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
import { loadFromCacheCheckingTTL, namespace } from '../../src/utils/tree-fetching'
import { treeA } from '../mocks'
import { mockLocalStorage } from '../utils/test-utils'
import { BeagleExpiredCacheError } from '../../src/errors'
import { getMetadata } from '../../src/utils/beagle-metadata'
import { beagleCacheNamespace } from '../../src/types'

const url = 'http://my-app/my-view'

describe('Utils: tree fetching (cacheCheckingTTL)', () => {
    const localStorageMock = mockLocalStorage()
    Date.now = jest.fn(() => 20203030)
    
    afterAll(() => localStorageMock.unmock())

    beforeEach(() => {
        localStorageMock.clear()
    })

    it('should load from cache when valid ttl', async () => {
        const metadata = {
            beagleHash: 'testing',
            requestTime: 20202020,
            ttl: '5'
        }
        const treeKey = `${namespace}/${url}/get`
        const cacheKey = `${beagleCacheNamespace}/${url}/get`

        localStorage.setItem(cacheKey, JSON.stringify(metadata))
        localStorage.setItem(treeKey, JSON.stringify(treeA))
    
        const result = await loadFromCacheCheckingTTL(url)
        expect(localStorage.getItem).toHaveBeenCalledWith(treeKey)
        expect(result).toEqual(treeA)
    })

    it('should load from cache when valid ttl and method different from default', async () => {
        const metadata = {
            beagleHash: 'testing',
            requestTime: 20202020,
            ttl: '5'
        }
        const treeKey = `${namespace}/${url}/post`
        const cacheKey = `${beagleCacheNamespace}/${url}/post`

        localStorage.setItem(cacheKey, JSON.stringify(metadata))
        localStorage.setItem(treeKey, JSON.stringify(treeA))
        
        const result = await loadFromCacheCheckingTTL(url, 'post')
        expect(localStorage.getItem).toHaveBeenCalledWith(treeKey)
        expect(result).toEqual(treeA)
    })
    
    it('should throw an error when no metadata available', async () => {
        await expect(loadFromCacheCheckingTTL(url)).rejects.toEqual(new BeagleExpiredCacheError(url))
        expect(localStorage.getItem).toHaveBeenCalledTimes(1)
    })

    it('should throw an error when invalid ttl and not load from cache ', async () => {
        const metadata = {
            beagleHash: 'testing',
            requestTime: 20101010,
            ttl: '5'
        }
       
        localStorage.setItem(`${beagleCacheNamespace}/${url}/get`, JSON.stringify(metadata))
    
        await expect(loadFromCacheCheckingTTL(url)).rejects.toEqual(new BeagleExpiredCacheError(url))
        expect(localStorage.getItem).toHaveBeenCalledTimes(1)
    })
})
