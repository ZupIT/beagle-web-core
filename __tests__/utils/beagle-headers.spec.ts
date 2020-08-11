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

import RemoteCache from 'service/network/remote-cache'
import DefaultHeaders from 'service/network/default-headers'
import { beagleCacheNamespace } from 'service/network/remote-cache'
import { createLocalStorageMock } from './test-utils'

describe.only('beagle-headers', () => {
  const url = 'http://test.com'

  function createDefaultHeadersService(
    useBeagleHeaders: boolean,
    initialStorage?: Record<string, string>,
  ) {
    const storage = createLocalStorageMock(initialStorage)
    const remoteCache = RemoteCache.create(storage)
    return DefaultHeaders.create(remoteCache, useBeagleHeaders)
  }

  it('should return default headers by default even if no beagle-hash defined', async () => {
    const beagleHeaders = createDefaultHeadersService(true)
    const headers = await beagleHeaders.get(url, 'get')
    expect(headers).toEqual({ 'beagle-platform': 'WEB', })
  })

  it('should not return default headers when useBeagleHeaders is set to false', async () => {
    const beagleHeaders = createDefaultHeadersService(false)
    const headers = await beagleHeaders.get(url, 'get')
    expect(headers).toEqual({})
  })

  it('should return headers with beagle-hash when the storage has it', async () => {
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20202020,
      ttl: '5',
    }
    const initialStorage = { [`${beagleCacheNamespace}/${url}/get`]: JSON.stringify(metadata) }
    const beagleHeaders = createDefaultHeadersService(true, initialStorage)

    const headers = await beagleHeaders.get(url, 'get')
    expect(headers).toEqual({ 'beagle-platform': 'WEB', 'beagle-hash': 'testing' })
  })
})
