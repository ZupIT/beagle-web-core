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
import { createLocalStorageMock } from './test-utils'
import RemoteCache, {
  beagleCacheNamespace,
  RemoteCache as RemoteCacheType,
} from 'service/network/remote-cache'

describe.only('cache-metadata', () => {
  const url = 'http://test.com'
  let storage: Storage
  let remoteCache: RemoteCacheType

  beforeEach(() => {
    nock.cleanAll()
    storage = createLocalStorageMock()
    remoteCache = RemoteCache.create(storage)
  })

  it('should return headers with beagle-hash when the storage has it', async () => {
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20202020,
      ttl: '5'
    }

    storage.setItem(`${beagleCacheNamespace}/${url}/get`, JSON.stringify(metadata))
    const returnedMetadata = await remoteCache.getMetadata(url, 'get')
    expect(returnedMetadata).toEqual(metadata)
  })

  it('should handle storage without metadata', async () => {
    const returnedMetadata = await remoteCache.getMetadata(url, 'get')
    expect(returnedMetadata).toEqual(null)
  })

  it('should return beagle-hash when the storage has it', async () => {
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20202020,
      ttl: '5'
    }

    storage.setItem(`${beagleCacheNamespace}/${url}/get`, JSON.stringify(metadata))
    const returnedHash = await remoteCache.getHash(url, 'get')
    expect(returnedHash).toEqual('testing')
  })

  it('should handle storage without metadata on getCacheHash', async () => {
    const returnedMetadata = await remoteCache.getHash(url, 'get')
    expect(returnedMetadata).toEqual('')
  })

  it('should add to storage the metadata info', async () => {
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20202020,
      ttl: '5'
    }

    remoteCache.updateMetadata(metadata, url, 'get')
    const storageData = await storage.getItem(`${beagleCacheNamespace}/${url}/get`)
    expect(storageData).toEqual(JSON.stringify(metadata))
    expect(storage.setItem).toHaveBeenCalled()
  })


  it('should add to storage the metadata info', async () => {
    const metadata = {
      beagleHash: 'testing',
      requestTime: 20202020,
      ttl: '5'
    }
    storage.setItem(`${beagleCacheNamespace}/${url}/get`, JSON.stringify(metadata))

    const newMetadata = {
      beagleHash: 'testing-new',
      requestTime: 30303030,
      ttl: '10'
    }
    remoteCache.updateMetadata(newMetadata, url, 'get')
    const storageData = await storage.getItem(`${beagleCacheNamespace}/${url}/get`)
    expect(storageData).toEqual(JSON.stringify(newMetadata))
    expect(storage.setItem).toHaveBeenCalledTimes(2)
  })
})
