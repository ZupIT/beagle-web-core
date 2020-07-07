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
import { mockLocalStorage } from '../test-utils'
import { BeagleExpiredCacheError } from '../../src/errors'
import beagleMetadata from '../../src/utils/beagle-metadata'

const url = 'http://my-app/my-view'

describe('Utils: tree fetching (cacheCheckingTTL)', () => {
    const localStorageMock = mockLocalStorage({
        [`${namespace}/${url}/get`]: JSON.stringify(treeA),
        [`${namespace}/${url}/post`]: JSON.stringify(treeA),
    })
    Date.now = jest.fn(() => 2022)

    afterAll(() => localStorageMock.unmock())

    beforeEach(() => {
        localStorageMock.clear()
    })

    it('should load from cache when valid ttl', async () => {
        const metadata = {
            beagleHash: 'testing',
            requestTime: 2020,
            ttl: '5'
        }
        beagleMetadata.getMetadata = jest.fn((url, method) => metadata)

        const result = await loadFromCacheCheckingTTL(url)
        expect(localStorage.getItem).toHaveBeenCalledWith(`${namespace}/${url}/get`)
        expect(result).toEqual(treeA)
    })

    it('should load from cache when valid ttl and method different from default', async () => {
        const metadata = {
            beagleHash: 'testing',
            requestTime: 2025,
            ttl: '5'
        }
        beagleMetadata.getMetadata = jest.fn((url, method) => metadata)

        const result = await loadFromCacheCheckingTTL(url, 'post')
        expect(localStorage.getItem).toHaveBeenCalledWith(`${namespace}/${url}/post`)
        expect(result).toEqual(treeA)
    })
    
    it('should throw an error when no metadata available', async () => {
        //@ts-ignore
        beagleMetadata.getMetadata = jest.fn((url, method) => {})
        await expect(loadFromCacheCheckingTTL(url)).rejects.toEqual(new BeagleExpiredCacheError(url))
        expect(localStorage.getItem).not.toHaveBeenCalled()
    })

    it('should throw an error when invalid ttl and not load from cache ', async () => {
        const metadata = {
            beagleHash: 'testing',
            requestTime: 2010,
            ttl: '5'
        }
        beagleMetadata.getMetadata = jest.fn((url, method) => metadata)

        await expect(loadFromCacheCheckingTTL(url)).rejects.toEqual(new BeagleExpiredCacheError(url))
        expect(localStorage.getItem).not.toHaveBeenCalled()
        
    })
})
