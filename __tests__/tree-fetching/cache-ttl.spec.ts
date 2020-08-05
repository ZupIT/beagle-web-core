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

import ViewClient, { namespace, ViewClient as ViewClientType } from 'service/network/view-client'
import BeagleExpiredCacheError from 'service/network/error/BeagleExpiredCacheError'
import RemoteCache, { beagleCacheNamespace } from 'service/network/remote-cache'
import DefaultHeaders from 'service/network/default-headers'
import { treeA } from '../mocks'
import { createLocalStorageMock } from '../utils/test-utils'

const url = 'http://my-app/my-view'

describe('Utils: tree fetching (cacheCheckingTTL)', () => {
  const httpClient = { fetch }
  let storage: Storage
  let viewClient: ViewClientType
  Date.now = jest.fn(() => 20203030)

  beforeEach(() => {
    storage = createLocalStorageMock()
    const remoteCache = RemoteCache.create(storage)
    const defaultHeadersService = DefaultHeaders.create(remoteCache)
    viewClient = ViewClient.create(storage, defaultHeadersService, remoteCache, httpClient)
  })

  it('should load from cache when valid ttl', async () => {
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20202020,
      ttl: '5'
    }
    const treeKey = `${namespace}/${url}/get`
    const cacheKey = `${beagleCacheNamespace}/${url}/get`

    storage.setItem(cacheKey, JSON.stringify(metadata))
    storage.setItem(treeKey, JSON.stringify(treeA))

    const result = await viewClient.loadFromCacheCheckingTTL(url)
    expect(storage.getItem).toHaveBeenCalledWith(treeKey)
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

      storage.setItem(cacheKey, JSON.stringify(metadata))
      storage.setItem(treeKey, JSON.stringify(treeA))
      
      const result = await viewClient.loadFromCacheCheckingTTL(url, 'post')
      expect(storage.getItem).toHaveBeenCalledWith(treeKey)
      expect(result).toEqual(treeA)
  })

  it('should throw an error when no metadata available', async () => {
      await expect(viewClient.loadFromCacheCheckingTTL(url)).rejects.toEqual(
        new BeagleExpiredCacheError(url)
      )
      expect(storage.getItem).toHaveBeenCalledTimes(1)
  })

  it('should throw an error when invalid ttl and not load from cache ', async () => {
      const metadata = {
          beagleHash: 'testing',
          requestTime: 20101010,
          ttl: '5'
      }
      
      storage.setItem(`${beagleCacheNamespace}/${url}/get`, JSON.stringify(metadata))

      await expect(viewClient.loadFromCacheCheckingTTL(url)).rejects.toEqual(
        new BeagleExpiredCacheError(url)
      )
      expect(storage.getItem).toHaveBeenCalledTimes(1)
  })
})
