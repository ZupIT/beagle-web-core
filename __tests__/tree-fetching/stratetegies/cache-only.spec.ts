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

import { load } from '../../../src/utils/tree-fetching'
import { treeA } from '../../mocks'
import { mockLocalStorage } from '../../test-utils'
import { namespace } from '../../../src/utils/tree-fetching'
import { BeagleCacheError } from '../../../src/errors'

const basePath = 'http://teste.com'
const path = '/myview'
const url = `${basePath}${path}`

describe('Utils: tree fetching (load: cache-only)', () => {
  const localStorageMock = mockLocalStorage()

  afterAll(() => localStorageMock.unmock())

  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should render cached view', async () => {
    localStorage.setItem(`${namespace}/${url}/get`, JSON.stringify(treeA))
    const onChangeTree = jest.fn()
    await load({ url, onChangeTree, strategy: 'cache-only' })
    expect(onChangeTree).toHaveBeenCalledWith(treeA)
  })

  it('should throw error', async () => {
    await expect(load({ url, onChangeTree: jest.fn(), strategy: 'cache-only' })).rejects.toEqual([
      new BeagleCacheError(url),
    ])
  })
})
