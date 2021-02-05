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
import BeagleNetworkError from 'error/BeagleNetworkError'
import RemoteCache from 'service/network/remote-cache'
import DefaultHeaders from 'service/network/default-headers'
import { createLocalStorageMock } from '../utils/test-utils'
import { treeA } from '../mocks'
import { BeagleStorage } from 'service/beagle-service/types'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (server)', () => {
  const httpClient = { fetch }
  let storage: BeagleStorage
  let viewClient: ViewClientType

  beforeEach(() => {
    nock.cleanAll()
    storage = createLocalStorageMock()
    const remoteCache = RemoteCache.create(storage)
    const defaultHeadersService = DefaultHeaders.create(remoteCache)
    viewClient = ViewClient.create(storage, defaultHeadersService, remoteCache, httpClient)
  })

  it('should load from server (get)', async () => {
    nock(basePath).get(path).reply(200, JSON.stringify(treeA))
    const result = await viewClient.loadFromServer(url)
    expect(result).toEqual(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it('should load from server (post)', async () => {
    nock(basePath).post(path).reply(200, JSON.stringify(treeA))
    const result = await viewClient.loadFromServer(url, 'post')
    expect(result).toEqual(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it('should load from server with headers', async () => {
    nock(basePath, { reqheaders: { test: 'test' } }).get(path).reply(200, JSON.stringify(treeA))
    const result = await viewClient.loadFromServer(url, 'get', { test: 'test' }, true, true)
    expect(result).toEqual(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it('should save cache after loading from server', async () => {
    const treeAString = JSON.stringify(treeA)
    nock(basePath).get(path).reply(200, treeAString)
    await viewClient.loadFromServer(url)
    expect(storage.setItem).toHaveBeenCalledWith(`${namespace}/${url}/get`, treeAString)
    expect(nock.isDone()).toBe(true)
  })

  it('should not save cache after loading from server', async () => {
    const treeAString = JSON.stringify(treeA)
    nock(basePath).get(path).reply(200, treeAString)
    await viewClient.loadFromServer(url, 'get', {}, false, false)
    expect(storage.setItem).not.toHaveBeenCalled()
    expect(nock.isDone()).toBe(true)
  })

  it('should throw error', async () => {
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    try {
      await viewClient.loadFromServer(url)
      expect(true).toBe(false) // should never reach this line
    } catch (error) {
      expect(error instanceof BeagleNetworkError).toBe(true)
      expect(error.response.status).toBe(500)
      expect(await error.response.json()).toEqual({ error: 'unexpected error' })
    }
    expect(nock.isDone()).toBe(true)
  })
})
