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

import nock from 'nock'
import { load } from '../../../src/utils/tree-fetching'
import { treeA, treeB } from '../../mocks'
import { mockLocalStorage } from '../../utils/test-utils'
import { namespace } from '../../../src/utils/tree-fetching'
import { BeagleNetworkError, BeagleCacheError, BeagleExpiredCacheError } from '../../../src/errors'
import beagleHttpClient from '../../../src/BeagleHttpClient'
import beagleStorage from '../../../src/BeagleStorage'
import { beagleCacheNamespace } from '../../../src/utils/cache-metadata'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (load: beagle-with-fallback-to-cache)', () => {
  const localStorageMock = mockLocalStorage()
  beagleStorage.setStorage(localStorage)
  beagleHttpClient.setFetchFunction(fetch)
  Date.now = jest.fn(() => 20203030)
  const cacheKey = `${beagleCacheNamespace}/${url}/get`
  const treeKey = `${namespace}/${url}/get`

  afterAll(() => localStorageMock.unmock())

  beforeEach(() => {
    nock.cleanAll()
    localStorageMock.clear()
  })

  it('should render view, save cache, save beagle-hash and dont get item from storage when no metadata defined', async () => {
    nock(basePath).get(path).reply(200, JSON.stringify(treeA), { 'beagle-hash': 'testing', 'cache-control': 'max-age=5' })
    const onChangeTree = jest.fn()

    await load({ url, onChangeTree })

    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(localStorage.getItem).not.toHaveBeenCalledWith(treeKey)
    expect(localStorage.setItem).toHaveBeenCalledTimes(2)
    expect(nock.isDone()).toBe(true)
  })

  it('should get view from cache when receiving status 304, update metadata and render view', async () => {
    const metadataCache = {
      beagleHash: 'testing',
      requestTime: 20201010,
      ttl: ''
    }
    localStorage.setItem(cacheKey, JSON.stringify(metadataCache))
    localStorage.setItem(treeKey, JSON.stringify(treeA))
    nock(basePath).get(path).reply(304, null, { 'beagle-hash': 'testing', 'cache-control': 'max-age=5' })

    const onChangeTree = jest.fn()
    await load({ url, onChangeTree })
    expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(localStorage.getItem).toHaveBeenCalledWith(treeKey)
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    const metadataCacheResult = {
      beagleHash: 'testing',
      requestTime: 20203030,
      ttl: '5'
    }
    expect(localStorage.setItem).toHaveBeenCalledWith(cacheKey, JSON.stringify(metadataCacheResult))
    expect(nock.isDone()).toBe(true)
  })

  it('should not get tree from storage when max age exceeded and should render view, save cache and save beagle-hash ', async () => {
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20101010,
      ttl: '5'
    }
    localStorage.setItem(treeKey, JSON.stringify(treeA))
    localStorage.setItem(cacheKey, JSON.stringify(metadata))
    nock(basePath).get(path).reply(200, JSON.stringify(treeB), { 'beagle-hash': 'testing-new-tree', 'cache-control': 'max-age=10' })
    const onChangeTree = jest.fn()
    const metadataCacheResult = {
      beagleHash: 'testing-new-tree',
      requestTime: 20203030,
      ttl: '10'
    }

    await load({ url, onChangeTree, })

    expect(onChangeTree).toHaveBeenCalledWith(treeB)
    expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(localStorage.getItem).not.toHaveBeenCalledWith(treeKey)
    expect(localStorage.setItem).toHaveBeenCalledWith(cacheKey, JSON.stringify(metadataCacheResult))
    expect(localStorage.setItem).toHaveBeenCalledWith(treeKey, JSON.stringify(treeB))
    expect(nock.isDone()).toBe(true)
  })
  

  it('should fallback to cache', async () => {
    localStorage.setItem(treeKey, JSON.stringify(treeA))
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const onChangeTree = jest.fn()
    await load({ url, onChangeTree })
    expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(localStorage.getItem).toHaveBeenCalledWith(treeKey)
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it('should throw error if received 304 from bff and doesnt find item in the storage', async () => {
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20203030,
      ttl: '5'
    }
    
    nock(basePath).get(path).reply(304, null,  { 'beagle-hash': 'testing', 'cache-control': 'max-age=5' })
    const onChangeTree = jest.fn()
    await expect(load({ url, onChangeTree})).rejects.toEqual([
      new BeagleExpiredCacheError(url),
      new BeagleCacheError(url),
      new BeagleCacheError(url)
    ])
    expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(localStorage.getItem).toHaveBeenCalledWith(treeKey)
    expect(nock.isDone()).toBe(true)
  })

  it('should throw errors', async () => {
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    await expect(load({ url, onChangeTree: jest.fn() })).rejects.toEqual([
      new BeagleExpiredCacheError(url),
      new BeagleNetworkError(url, {} as Response),
      new BeagleCacheError(url),
    ])
    expect(nock.isDone()).toBe(true)
  })
})
