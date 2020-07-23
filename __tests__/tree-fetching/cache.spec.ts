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
import { loadFromCache, namespace } from '../../src/utils/tree-fetching'
import { treeA } from '../mocks'
import { mockLocalStorage } from '../utils/test-utils'
import { BeagleCacheError } from '../../src/errors'
import beagleStorage from '../../src/BeagleStorage'

const url = 'http://my-app/my-view'

describe('Utils: tree fetching (cache)', () => {
  const localStorageMock = mockLocalStorage({
    [`${namespace}/${url}/get`]: JSON.stringify(treeA),
    [`${namespace}/${url}/post`]: JSON.stringify(treeA),
  })
  beagleStorage.setStorage(localStorage)

  afterAll(() => localStorageMock.unmock())

  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should load from cache (get)', async () => {
    const result = await loadFromCache(url)
    expect(localStorage.getItem).toHaveBeenCalledWith(`${namespace}/${url}/get`)
    expect(result).toEqual(treeA)
  })

  it('should load from cache (post)', async () => {
    const result = await loadFromCache(url, 'post')
    expect(localStorage.getItem).toHaveBeenCalledWith(`${namespace}/${url}/post`)
    expect(result).toEqual(treeA)
  })

  it('should throw error when cache is not available', async () => {
    await expect(loadFromCache('blah')).rejects.toEqual(new BeagleCacheError('blah'))
  })
})
