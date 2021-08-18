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
import RemoteCache from 'service/network/remote-cache'
import DefaultHeaders from 'service/network/default-headers'
import { treeA } from '../../mocks'
import { createLocalStorageMock } from '../../utils/test-utils'
import { BeagleStorage } from 'service/beagle-service/types'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (load: network only)', () => {
  const strategy: Strategy = 'network-only'
  const httpClient = { fetch }
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

  it('should render view and not save cache', async () => {
    nock(basePath).get(path).reply(200, JSON.stringify(treeA))
    const onChangeTree = jest.fn()
    await viewClient.load({ url, onChangeTree, strategy, retry })
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(storage.setItem).not.toHaveBeenCalled()
    expect(nock.isDone()).toBe(true)
  })

  it('should throw error', async () => {
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const params = { url, onChangeTree: jest.fn(), strategy, retry }
    await expect(viewClient.load(params)).rejects.toEqual([
      // @ts-ignore
      new BeagleNetworkError(url,{} as Response,500 , 'GET'),
    ])
    expect(nock.isDone()).toBe(true)
  })
})
