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
import BeagleCacheError from 'service/network/error/BeagleCacheError'
import RemoteCache from 'service/network/remote-cache'
import DefaultHeaders from 'service/network/default-headers'
import { Strategy } from 'service/network/types'
import { treeA } from '../../mocks'
import { createLocalStorageMock } from '../../utils/test-utils'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (load: cache-only)', () => {
  const strategy: Strategy = 'cache-only'
  const httpClient = { fetch }
  const retry = jest.fn()
  let storage: Storage
  let viewClient: ViewClientType

  beforeEach(() => {
    storage = createLocalStorageMock()
    const remoteCache = RemoteCache.create(storage)
    const defaultHeadersService = DefaultHeaders.create(remoteCache)
    viewClient = ViewClient.create(storage, defaultHeadersService, remoteCache, httpClient)
  })

  it('should render cached view', async () => {
    storage.setItem(`${namespace}/${url}/get`, JSON.stringify(treeA))
    const onChangeTree = jest.fn()
    await viewClient.load({ url, onChangeTree, strategy, retry })
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
  })

  it('should throw error', async () => {
    const params = { url, onChangeTree: jest.fn(), strategy, retry }
    await expect(viewClient.load(params)).rejects.toEqual([
      new BeagleCacheError(url),
    ])
  })
})
