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
import { mockLocalStorage } from '../../utils/test-utils'
import { BeagleNetworkError } from '../../../src/errors'
import beagleHttpClient from '../../../src/BeagleHttpClient'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (load: network only)', () => {
  const localStorageMock = mockLocalStorage()
  beagleHttpClient.setFetchFunction(fetch)

  afterAll(() => localStorageMock.unmock())

  beforeEach(() => {
    nock.cleanAll()
    localStorageMock.clear()
  })

  it('should render view and not save cache', async () => {
    nock(basePath).get(path).reply(200, JSON.stringify(treeA))
    const onChangeTree = jest.fn()
    await load({ url, onChangeTree, strategy: 'network-only' })
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
    expect(localStorage.setItem).not.toHaveBeenCalled()
    expect(nock.isDone()).toBe(true)
  })

  it('should throw error', async () => {
    nock(basePath).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    await expect(load({ url, onChangeTree: jest.fn(), strategy: 'network-only' })).rejects.toEqual([
      // @ts-ignore
      new BeagleNetworkError(url),
    ])
    expect(nock.isDone()).toBe(true)
  })
})
