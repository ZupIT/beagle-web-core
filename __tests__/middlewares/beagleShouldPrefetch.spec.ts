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

/**
 * fixme: should follow the new organization and test Renderer/Navigation.ts. Maybe it would be
 * better not to couple this with the utils "Tree".
 */

import Navigation from '../../src/Renderer/Navigation'
import { BeagleUIElement, URLBuilder } from '../../src/types'
import UrlBuilder from '../../src/UrlBuilder'
import { mockLocalStorage } from '../test-utils'
import { namespace } from '../../src/utils/tree-fetching'
import { clone } from '../../src/utils/tree-manipulation'
import Tree from '../../src/utils/Tree'
import { treeA } from '../mocks'
import nock from 'nock'
import beagleHttpClient from '../../src/BeagleHttpClient'

describe('ShouldPrefetch Middleware', () => {
  const baseUrl = 'http://teste.com'
  const path = '/mypath'
  const url = `${baseUrl}${path}`
  beagleHttpClient.setFetchFunction(fetch)

  const localStorageMock = mockLocalStorage()

  const createUiTree = (shouldPrefetch: boolean): BeagleUIElement => ({
    _beagleComponent_: 'container',
    children: [
      {
        _beagleComponent_: 'button',
        onPress: {
          _beagleAction_: 'beagle:pushStack',
          route: { url: path, shouldPrefetch }
        }
      }
    ]
  })

  beforeEach(() => {
    nock.cleanAll()
    localStorageMock.clear()
  })

  beforeAll(() => {
    UrlBuilder.setBaseUrl(baseUrl)
  })

  afterAll(() => localStorageMock.unmock())

  it('should load uiTree and store it in cache when shouldprefetch flag is true', async () => {
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeA))
    const uiTree = createUiTree(true)
    const newUiTree = clone(uiTree)
    Tree.forEach(newUiTree, Navigation.preFetchViews)
    await new Promise(res => setTimeout(async () => {
      const cachedTree = await localStorage.getItem(`${namespace}/${url}/get`)
      expect(cachedTree).toStrictEqual(JSON.stringify(treeA))
      expect(newUiTree).toEqual(uiTree)
      expect(nock.isDone()).toBe(true)
      res()
    }, 200))
    expect(nock.isDone()).toBe(true)
  })

  it('should not load uiTree and store it in cache when shouldprefetch flag is false', async () => {
    const uiTree = createUiTree(false)
    const newUiTree = clone(uiTree)
    Tree.forEach(newUiTree, Navigation.preFetchViews)
    await new Promise(res => setTimeout(async () => {
      const cachedTree = await localStorage.getItem(`${namespace}/${url}/get`)
      expect(cachedTree).toBeNull()
      expect(newUiTree).toEqual(uiTree)
      expect(nock.isDone()).toBe(true)
      res()
    }, 200))
  })
})
