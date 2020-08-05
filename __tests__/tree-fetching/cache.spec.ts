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
import { treeA } from '../mocks'
import { createLocalStorageMock } from '../utils/test-utils'

const url = 'http://my-app/my-view'

describe('Utils: tree fetching (cache)', () => {
  const httpClient = { fetch }
  let storage: Storage
  let viewClient: ViewClientType
  const initialStorageValues = {
    [`${namespace}/${url}/get`]: JSON.stringify(treeA),
    [`${namespace}/${url}/post`]: JSON.stringify(treeA),
  }

  beforeEach(() => {
    storage = createLocalStorageMock(initialStorageValues)
    const remoteCache = RemoteCache.create(storage)
    const defaultHeadersService = DefaultHeaders.create(remoteCache)
    viewClient = ViewClient.create(storage, defaultHeadersService, remoteCache, httpClient)
  })

  it('should load from cache (get)', async () => {
    const result = await viewClient.loadFromCache(url)
    expect(storage.getItem).toHaveBeenCalledWith(`${namespace}/${url}/get`)
    expect(result).toEqual(treeA)
  })

  it('should load from cache (post)', async () => {
    const result = await viewClient.loadFromCache(url, 'post')
    expect(storage.getItem).toHaveBeenCalledWith(`${namespace}/${url}/post`)
    expect(result).toEqual(treeA)
  })

  it('should throw error when cache is not available', async () => {
    await expect(viewClient.loadFromCache('blah')).rejects.toEqual(new BeagleCacheError('blah'))
  })
})
