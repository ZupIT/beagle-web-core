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
import { mockLocalStorage } from '../../test-utils'
import { namespace } from '../../../src/utils/tree-fetching'
import { BeagleNetworkError, BeagleCacheError, BeagleExpiredCacheError } from '../../../src/errors'
import beagleHttpClient from '../../../src/BeagleHttpClient'
import handleBeagleHeaders from '../../../src/utils/beagle-headers'
import beagleMetadata from '../../../src/utils/beagle-metadata'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (load: beagle-with-fallback-to-cache)', () => {
  const localStorageMock = mockLocalStorage()
  beagleHttpClient.setFetchFunction(fetch)
  const beagleHeaders = handleBeagleHeaders(true)
  Date.now = jest.fn(() => 2020)
  
  afterAll(() => localStorageMock.unmock())

  beforeEach(() => {
    nock.cleanAll()
    localStorageMock.clear()
  })

  it('should render view, save cache, save beagle-hash and not call loadCache when no metadata defined', async () => {
    const metadata =  {
      beagleHash: 'testing',
      requestTime: 2020,
      ttl: '5'
    }
    beagleMetadata.updateMetadata = jest.fn(),
    nock(basePath).get(path).reply(200, JSON.stringify(treeA), { 'beagle-hash': 'testing', 'cache-control': 'max-age=5' })
    const onChangeTree = jest.fn()

    await load({ url, beagleHeaders, onChangeTree })
    
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(beagleMetadata.updateMetadata).toHaveBeenCalledWith(metadata, url, 'get')
    expect(localStorage.getItem).not.toHaveBeenCalled()
    expect(localStorage.setItem).toHaveBeenCalled()
    expect(nock.isDone()).toBe(true)
  })

  it('should get view from cache when receiving status 304 and render view', async () => {
    localStorage.setItem(`${namespace}/${url}/get`, JSON.stringify(treeA))
    nock(basePath).get(path).reply(304, JSON.stringify(treeA))
    const onChangeTree = jest.fn()
    await load({ url, beagleHeaders, onChangeTree })
    expect(localStorage.getItem).toHaveBeenCalled()
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it('should get view from cache when ', async () => {
    localStorage.setItem(`${namespace}/${url}/get`, JSON.stringify(treeA))
    nock(basePath).get(path).reply(304, JSON.stringify(treeA))
    const onChangeTree = jest.fn()
    await load({ url, beagleHeaders, onChangeTree })
    expect(localStorage.getItem).toHaveBeenCalled()
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it('should fallback to cache', async () => {
    localStorage.setItem(`${namespace}/${url}/get`, JSON.stringify(treeA))
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const onChangeTree = jest.fn()
    await load({ url, beagleHeaders, onChangeTree })
    expect(localStorage.getItem).toHaveBeenCalled()
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it('should throw errors', async () => {
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    await expect(load({ url, beagleHeaders, onChangeTree: jest.fn() })).rejects.toEqual([
      new BeagleExpiredCacheError(url),
      new BeagleNetworkError(url, {} as Response),
      new BeagleCacheError(url),
    ])
    expect(nock.isDone()).toBe(true)
  })
})
