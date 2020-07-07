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
import { treeA, treeB } from '../../mocks'
import { mockLocalStorage } from '../../test-utils'
import { namespace } from '../../../src/utils/tree-fetching'
import { BeagleCacheError, BeagleNetworkError } from '../../../src/errors'
import beagleHttpClient from '../../../src/BeagleHttpClient'
import handleBeagleHeaders from '../../../src/utils/beagle-headers'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (load: cache-first)', () => {
  const localStorageMock = mockLocalStorage()
  beagleHttpClient.setFetchFunction(fetch)
  const beagleHeaders = handleBeagleHeaders(true)

  afterAll(() => localStorageMock.unmock())

  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should render cached view and, when ready, render view from network', async () => {
    nock(basePath).get(path).reply(200, JSON.stringify(treeA))
    localStorage.setItem(`${namespace}/${url}/get`, JSON.stringify(treeB))
    const onChangeTree = jest.fn()
    await load({ url, beagleHeaders, onChangeTree, strategy: 'cache-first' })
    expect(onChangeTree.mock.calls).toEqual([[treeB], [treeA]])
    expect(nock.isDone()).toBe(true)
  })

  it('should render loading and view from network when cache is not available', async () => {
    nock(basePath).get(path).reply(200, JSON.stringify(treeA))
    const onChangeTree = jest.fn()
    await load({ url, beagleHeaders, onChangeTree, strategy: 'cache-first' })
    expect(onChangeTree.mock.calls).toEqual([[{_beagleComponent_: 'custom:loading' }], [treeA]])
    expect(nock.isDone()).toBe(true)
  })

  it('should ignore network error', async () => {
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    localStorage.setItem(`${namespace}/${url}/get`, JSON.stringify(treeB))
    const onChangeTree = jest.fn()
    await load({ url, beagleHeaders, onChangeTree, strategy: 'cache-first' })
    expect(onChangeTree.mock.calls).toEqual([[treeB]])
    expect(nock.isDone()).toBe(true)
  })

  it('should throw errors', async () => {
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const onChangeTree = jest.fn()
    await expect(load({ url, beagleHeaders, onChangeTree, strategy: 'cache-first' })).rejects.toEqual([
      new BeagleCacheError(url),
      // @ts-ignore
      new BeagleNetworkError(url),
    ])
    expect(nock.isDone()).toBe(true)
  })
})
