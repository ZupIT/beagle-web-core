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
import ViewClient, { ViewClient as ViewClientType } from 'service/network/view-client'
import RemoteCache from 'service/network/remote-cache'
import DefaultHeaders from 'service/network/default-headers'
import { Strategy } from 'service/network/types'
import { treeA } from '../mocks'
import { createLocalStorageMock } from '../utils/test-utils'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (load: general)', () => {
  const strategy: Strategy = 'network-with-fallback-to-cache'
  const httpClient = { fetch }
  const retry = jest.fn()
  let viewClient: ViewClientType
  
  beforeEach(() => {
    nock.cleanAll()
    const storage = createLocalStorageMock()
    const remoteCache = RemoteCache.create(storage)
    const defaultHeadersService = DefaultHeaders.create(remoteCache)
    viewClient = ViewClient.create(storage, defaultHeadersService, remoteCache, httpClient)
  })

  it('should render loading before resulting view', async () => {
    nock(basePath).get(path).reply(200, JSON.stringify(treeA))
    const onChangeTree = jest.fn()
    const promise = viewClient.load({ url, strategy, onChangeTree, retry })
    expect(onChangeTree).toHaveBeenCalledWith({ _beagleComponent_: 'custom:loading' })
    onChangeTree.mockClear()
    await promise
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it('should render loading before error', async () => {
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const onChangeTree = jest.fn()
    const retry = jest.fn()
    const promise = viewClient.load({ url, strategy, onChangeTree, retry })
    expect(onChangeTree).toHaveBeenCalledWith({ _beagleComponent_: 'custom:loading' })
    onChangeTree.mockClear()
    try {
      await promise
    } catch { }
    expect(onChangeTree).toHaveBeenCalledWith({
      _beagleComponent_: 'custom:error',
      errors: [expect.stringMatching('network'), expect.stringMatching('cache')],
      retry,
    })
    expect(nock.isDone()).toBe(true)
  })

  it('should not render loading', async () => {
    nock(basePath).get(path).reply(200, JSON.stringify(treeA))
    const onChangeTree = jest.fn()
    const promise = viewClient.load({
      url,
      strategy,
      onChangeTree,
      retry,
      shouldShowLoading: false,
    })
    expect(onChangeTree).not.toHaveBeenCalled()
    await promise
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it('should do nothing when showLoading and showError are false and an error occurs', async () => {
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const onChangeTree = jest.fn()
    try {
      await viewClient.load({
        url,
        strategy,
        onChangeTree,
        shouldShowLoading: false,
        shouldShowError: false,
        retry,
      })
    } catch { }
    expect(onChangeTree).not.toHaveBeenCalledWith()
    expect(nock.isDone()).toBe(true)
  })

  it('should render custom loading component', async () => {
    nock(basePath).get(path).reply(200, JSON.stringify(treeA))
    const onChangeTree = jest.fn()
    const promise = viewClient.load({
      url,
      strategy, 
      onChangeTree,
      loadingComponent: 'custom-loading',
      retry,
    })
    expect(onChangeTree).toHaveBeenCalledWith({ _beagleComponent_: 'custom-loading' })
    await promise
    expect(nock.isDone()).toBe(true)
  })

  it('should render custom error component', async () => {
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const onChangeTree = jest.fn()
    const retry = jest.fn()
    try {
      await viewClient.load({
        url,
        strategy,
        onChangeTree,
        errorComponent: 'custom-error',
        retry,
      })
    } catch { }
    expect(onChangeTree).toHaveBeenCalledWith({
      _beagleComponent_: 'custom-error',
      errors: [expect.stringMatching('network'), expect.stringMatching('cache')],
      retry,
    })
    expect(nock.isDone()).toBe(true)
  })

  it('should use post and send headers', async () => {
    nock(basePath, { reqheaders: { test: 'test' } }).post(path).reply(200, JSON.stringify(treeA))
    const onChangeTree = jest.fn()
    await viewClient.load({
      url, method: 'post',
      headers: { test: 'test' },
      strategy,
      onChangeTree,
      retry,
    })
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(nock.isDone()).toBe(true)
  })
})
