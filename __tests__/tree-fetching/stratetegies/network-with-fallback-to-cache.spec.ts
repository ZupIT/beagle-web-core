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

import * as nock from 'nock'
import { load } from '../../../src/utils/tree-fetching'
import { treeA } from '../../mocks'
import { mockLocalStorage } from '../../test-utils'
import { namespace } from '../../../src/utils/tree-fetching'
import { BeagleNetworkError, BeagleCacheError } from '../../../src/errors'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (load: network-with-fallback-to-cache)', () => {
  const localStorageMock = mockLocalStorage()

  afterAll(() => localStorageMock.unmock())

  beforeEach(() => {
    nock.cleanAll()
    localStorageMock.clear()
  })

  it('should render view and save cache', async () => {
    nock(basePath).get(path).reply(200, JSON.stringify(treeA))
    const onChangeTree = jest.fn()
    await load({ url, onChangeTree })
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(localStorage.setItem).toHaveBeenCalled()
    expect(nock.isDone()).toBe(true)
  })

  it('should fallback to cache', async () => {
    localStorage.setItem(`${namespace}/${url}/get`, JSON.stringify(treeA))
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const onChangeTree = jest.fn()
    await load({ url, onChangeTree })
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it('should throw errors', async () => {
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    await expect(load({ url, onChangeTree: jest.fn() })).rejects.toEqual([
      // @ts-ignore
      new BeagleNetworkError(url),
      new BeagleCacheError(url),
    ])
    expect(nock.isDone()).toBe(true)
  })
})
