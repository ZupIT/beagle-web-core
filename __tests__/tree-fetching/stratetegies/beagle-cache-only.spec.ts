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
import { treeA } from '../../mocks'
import { mockLocalStorage } from '../../utils/test-utils'
import { namespace } from '../../../src/utils/tree-fetching'
import { BeagleNetworkError, BeagleExpiredCacheError, BeagleCacheError } from '../../../src/errors'
import beagleHttpClient from '../../../src/BeagleHttpClient'
import beagleStorage from '../../../src/BeagleStorage'
import { beagleCacheNamespace } from '../../../src/utils/cache-metadata'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (load: beagle-cache-only)', () => {
  const localStorageMock = mockLocalStorage()
  beagleStorage.setStorage(localStorage)
  beagleHttpClient.setFetchFunction(fetch)
  const cacheKey = `${beagleCacheNamespace}/${url}/get`
  const treeKey = `${namespace}/${url}/get`

  Date.now = jest.fn(() => 20203030)

  afterAll(() => localStorageMock.unmock())

  beforeEach(() => {
    nock.cleanAll()
    localStorageMock.clear()
  })

  it('should render view, save cache, save beagle-hash and not call loadCache when no metadata defined', async () => {
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20203030,
      ttl: '5'
    }
    
    nock(basePath).get(path).reply(200, JSON.stringify(treeA), { 'beagle-hash': 'testing', 'cache-control': 'max-age=5' })
    const onChangeTree = jest.fn()

    await load({ url, onChangeTree, strategy: 'beagle-cache-only' })

    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(localStorage.getItem).not.toHaveBeenCalledWith(treeKey)
    expect(localStorage.setItem).toHaveBeenCalledWith(cacheKey, JSON.stringify(metadata))
    expect(localStorage.setItem).toHaveBeenCalledWith(treeKey, JSON.stringify(treeA))
    expect(nock.isDone()).toBe(true)
  })

  it('should get view from cache when receiving status 304 and render view', async () => {
    localStorage.setItem(treeKey, JSON.stringify(treeA))
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20203030,
      ttl: '5'
    }
    
    nock(basePath).get(path).reply(304, null,  { 'beagle-hash': 'testing', 'cache-control': 'max-age=5' })
    const onChangeTree = jest.fn()
    await load({ url, onChangeTree, strategy: 'beagle-cache-only' })
    expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(localStorage.getItem).toHaveBeenCalledWith(treeKey)
    expect(localStorage.setItem).toHaveBeenCalledWith(cacheKey, JSON.stringify(metadata))
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
    await expect(load({ url, onChangeTree, strategy: 'beagle-cache-only' })).rejects.toEqual([
      new BeagleExpiredCacheError(url),
      new BeagleCacheError(url)
    ])
    expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(localStorage.getItem).toHaveBeenCalledWith(treeKey)
    expect(nock.isDone()).toBe(true)
  })

  it('should not fallback to cache and throw errors', async () => {
    localStorage.setItem(treeKey, JSON.stringify(treeA))
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    await expect(load({ url, onChangeTree: jest.fn(), strategy: 'beagle-cache-only' })).rejects.toEqual([
      new BeagleExpiredCacheError(url),
      new BeagleNetworkError(url, {} as Response)
    ])
    expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(localStorage.getItem).not.toHaveBeenCalledWith(treeKey)
    expect(nock.isDone()).toBe(true)
  })

  it('should render view from cache if ttl is still valid', async () => {
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20202020,
      ttl: '5'
    }

    localStorage.setItem(cacheKey, JSON.stringify(metadata))
    localStorage.setItem(treeKey, JSON.stringify(treeA))
    const onChangeTree = jest.fn()

    const test = await load({ url, onChangeTree, strategy: 'beagle-cache-only' })
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(localStorage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(localStorage.getItem).toHaveBeenCalledWith(treeKey)
  })
 
})
