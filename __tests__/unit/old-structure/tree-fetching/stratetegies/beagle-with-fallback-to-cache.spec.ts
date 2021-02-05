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

import nock from 'nock'
import ViewClient, { namespace } from 'service/network/view-client'
import { ViewClient as ViewClientType } from 'service/network/view-client/types'
import BeagleCacheError from 'error/BeagleCacheError'
import BeagleExpiredCacheError from 'error/BeagleExpiredCacheError'
import BeagleNetworkError from 'error/BeagleNetworkError'
import RemoteCache, { beagleCacheNamespace } from 'service/network/remote-cache'
import DefaultHeaders from 'service/network/default-headers'
import { treeA, treeB } from '../../mocks'
import { createLocalStorageMock } from '../../utils/test-utils'
import { BeagleStorage } from 'service/beagle-service/types'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (load: beagle-with-fallback-to-cache)', () => {
  const httpClient = { fetch }
  Date.now = jest.fn(() => 20203030)
  const cacheKey = `${beagleCacheNamespace}/${url}/get`
  const treeKey = `${namespace}/${url}/get`
  const retry = jest.fn()
  let storage: BeagleStorage
  let viewClient: ViewClientType

  beforeEach(() => {
    nock.cleanAll()
    storage = createLocalStorageMock()
    const remoteCache = RemoteCache.create(storage)
    const defaultHeadersService = DefaultHeaders.create(remoteCache)
    viewClient = ViewClient.create(storage, defaultHeadersService, remoteCache, httpClient)
  })

  it(
    'should render view, save cache, save beagle-hash and don\'t get item from storage when no metadata defined',
    async () => {
      const headers = { 'beagle-hash': 'testing', 'cache-control': 'max-age=5' }
      nock(basePath).get(path).reply(200, JSON.stringify(treeA), headers)
      const onChangeTree = jest.fn()

      await viewClient.load({ url, onChangeTree, retry })

      expect(onChangeTree).toHaveBeenCalledWith(treeA)
      expect(storage.getItem).toHaveBeenCalledWith(cacheKey)
      expect(storage.getItem).not.toHaveBeenCalledWith(treeKey)
      expect(storage.setItem).toHaveBeenCalledTimes(2)
      expect(nock.isDone()).toBe(true)
    },
  )

  it(
    'should get view from cache when receiving status 304, update metadata and render view',
    async () => {
      const metadataCache = {
        beagleHash: 'testing',
        requestTime: 20201010,
        ttl: ''
      }
      storage.setItem(cacheKey, JSON.stringify(metadataCache))
      storage.setItem(treeKey, JSON.stringify(treeA))

      const headers = { 'beagle-hash': 'testing', 'cache-control': 'max-age=5' }
      nock(basePath).get(path).reply(304, undefined, headers)

      const onChangeTree = jest.fn()
      await viewClient.load({ url, onChangeTree, retry })
      expect(storage.getItem).toHaveBeenCalledWith(cacheKey)
      expect(storage.getItem).toHaveBeenCalledWith(treeKey)
      expect(onChangeTree).toHaveBeenCalledWith(treeA)
      const metadataCacheResult = {
        beagleHash: 'testing',
        requestTime: 20203030,
        ttl: '5'
      }
      expect(storage.setItem).toHaveBeenCalledWith(cacheKey, JSON.stringify(metadataCacheResult))
      expect(nock.isDone()).toBe(true)
    },
  )

  it(
    'should not get tree from storage when max age exceeded and should render view, save cache and save beagle-hash',
    async () => {
      const metadata = {
        beagleHash: 'testing',
        requestTime: 20101010,
        ttl: '5'
      }
      storage.setItem(treeKey, JSON.stringify(treeA))
      storage.setItem(cacheKey, JSON.stringify(metadata))
      const headers = { 'beagle-hash': 'testing-new-tree', 'cache-control': 'max-age=10' }
      nock(basePath).get(path).reply(200, JSON.stringify(treeB), headers)
      const onChangeTree = jest.fn()
      const metadataCacheResult = {
        beagleHash: 'testing-new-tree',
        requestTime: 20203030,
        ttl: '10'
      }

      await viewClient.load({ url, onChangeTree, retry })

      expect(onChangeTree).toHaveBeenCalledWith(treeB)
      expect(storage.getItem).toHaveBeenCalledWith(cacheKey)
      expect(storage.getItem).not.toHaveBeenCalledWith(treeKey)
      expect(storage.setItem).toHaveBeenCalledWith(cacheKey, JSON.stringify(metadataCacheResult))
      expect(storage.setItem).toHaveBeenCalledWith(treeKey, JSON.stringify(treeB))
      expect(nock.isDone()).toBe(true)
    },
  )
  

  it('should fallback to cache', async () => {
    storage.setItem(treeKey, JSON.stringify(treeA))
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const onChangeTree = jest.fn()
    await viewClient.load({ url, onChangeTree, retry })
    expect(storage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(storage.getItem).toHaveBeenCalledWith(treeKey)
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it(
    'should throw error if received 304 from bff and doesn\'t find item in the storage',
    async () => {
      const metadata = {
        beagleHash: 'testing',
        requestTime: 20203030,
        ttl: '5'
      }
      
      const headers = { 'beagle-hash': 'testing', 'cache-control': 'max-age=5' }
      nock(basePath).get(path).reply(304, undefined, headers)
      const onChangeTree = jest.fn()
      await expect(viewClient.load({ url, onChangeTree, retry })).rejects.toEqual([
        new BeagleExpiredCacheError(url),
        new BeagleCacheError(url),
        new BeagleCacheError(url)
      ])
      expect(storage.getItem).toHaveBeenCalledWith(cacheKey)
      expect(storage.getItem).toHaveBeenCalledWith(treeKey)
      expect(nock.isDone()).toBe(true)
    },
  )

  it('should throw errors', async () => {
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    await expect(viewClient.load({ url, onChangeTree: jest.fn(), retry })).rejects.toEqual([
      new BeagleExpiredCacheError(url),
      new BeagleNetworkError(url, {} as Response),
      new BeagleCacheError(url),
    ])
    expect(nock.isDone()).toBe(true)
  })
})
