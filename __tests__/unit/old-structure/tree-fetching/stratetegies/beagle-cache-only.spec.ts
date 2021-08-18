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
import { ViewClient as ViewClientType, Strategy } from 'service/network/view-client/types'
import BeagleNetworkError from 'error/BeagleNetworkError'
import RemoteCache, { beagleCacheNamespace } from 'service/network/remote-cache'
import DefaultHeaders from 'service/network/default-headers'
import { treeA } from '../../mocks'
import { createLocalStorageMock } from '../../utils/test-utils'
import { BeagleStorage } from 'service/beagle-service/types'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (load: beagle-cache-only)', () => {
  const strategy: Strategy = 'beagle-cache-only'
  const httpClient = { fetch }
  const cacheKey = `${beagleCacheNamespace}/${url}/get`
  const treeKey = `${namespace}/${url}/get`
  const retry = jest.fn()
  let storage: BeagleStorage
  let viewClient: ViewClientType

  Date.now = jest.fn(() => 20203030)

  beforeEach(() => {
    nock.cleanAll()
    storage = createLocalStorageMock()
    const remoteCache = RemoteCache.create(storage)
    const defaultHeadersService = DefaultHeaders.create(remoteCache)
    viewClient = ViewClient.create(storage, defaultHeadersService, remoteCache, httpClient)
  })

  it(
    'should render view, save cache, save beagle-hash and not call loadCache when no metadata defined',
    async () => {
      const metadata = {
        beagleHash: 'testing',
        requestTime: 20203030,
        ttl: '5'
      }

      const headers = { 'beagle-hash': 'testing', 'cache-control': 'max-age=5' }
      nock(basePath).get(path).reply(200, JSON.stringify(treeA), headers)

      const onChangeTree = jest.fn()
      await viewClient.load({ url, onChangeTree, strategy, retry })

      expect(onChangeTree).toHaveBeenCalledWith(treeA)
      expect(storage.getItem).toHaveBeenCalledWith(cacheKey)
      expect(storage.getItem).not.toHaveBeenCalledWith(treeKey)
      expect(storage.setItem).toHaveBeenCalledWith(cacheKey, JSON.stringify(metadata))
      expect(storage.setItem).toHaveBeenCalledWith(treeKey, JSON.stringify(treeA))
      expect(nock.isDone()).toBe(true)
    },
  )

  it('should get view from cache when receiving status 304 and render view', async () => {
    storage.setItem(treeKey, JSON.stringify(treeA))
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20203030,
      ttl: '5'
    }

    nock(basePath).get(path).reply(304, undefined, { 'beagle-hash': 'testing', 'cache-control': 'max-age=5' })
    const onChangeTree = jest.fn()
    await viewClient.load({ url, onChangeTree, strategy, retry })
    expect(storage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(storage.getItem).toHaveBeenCalledWith(treeKey)
    expect(storage.setItem).toHaveBeenCalledWith(cacheKey, JSON.stringify(metadata))
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it('should not fallback to cache and throw errors', async () => {
    storage.setItem(treeKey, JSON.stringify(treeA))
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const loadParams = { url, onChangeTree: jest.fn(), strategy, retry }
    await expect(viewClient.load(loadParams)).rejects.toEqual([
      new BeagleNetworkError(url, {} as Response,500,'GET')
    ])
    expect(storage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(storage.getItem).not.toHaveBeenCalledWith(treeKey)
    expect(nock.isDone()).toBe(true)
  })

  it('should render view from cache if ttl is still valid', async () => {
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20202020,
      ttl: '5'
    }

    storage.setItem(cacheKey, JSON.stringify(metadata))
    storage.setItem(treeKey, JSON.stringify(treeA))
    const onChangeTree = jest.fn()

    const test = await viewClient.load({ url, onChangeTree, strategy, retry })
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(storage.getItem).toHaveBeenCalledWith(cacheKey)
    expect(storage.getItem).toHaveBeenCalledWith(treeKey)
  })

})
