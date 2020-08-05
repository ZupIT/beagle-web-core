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

/**
 * fixme: should follow the new organization and test Renderer/Navigation.ts. Maybe it would be
 * better not to couple this with the utils "Tree".
 */

import nock from 'nock'
import Navigation from 'beagle-view/render/navigation'
import { BeagleUIElement } from 'beagle-tree/types'
import { namespace } from 'service/network/view-client'
import Tree from 'beagle-tree'
import ViewClient, { ViewClient as ViewClientType } from 'service/network/view-client'
import {
  createLocalStorageMock,
  createDefaultHeadersMock,
  createRemoteCacheMock,
} from '../utils/test-utils'
import { treeA } from '../mocks'

describe('ShouldPrefetch Middleware', () => {
  const baseUrl = 'http://teste.com'
  const path = '/mypath'
  const url = `${baseUrl}${path}`
  const urlBuilder = { build: (value: string) => `${baseUrl}${value}` }
  const defaultHeadersService = createDefaultHeadersMock()
  const remoteCache = createRemoteCacheMock()
  const httpClient = { fetch }
  let storage: Storage
  let viewClient: ViewClientType

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
    storage = createLocalStorageMock()
    viewClient = ViewClient.create(storage, defaultHeadersService, remoteCache, httpClient)
  })

  it('should load uiTree and store it in cache when shouldPrefetch flag is true', async () => {
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeA))
    const uiTree = createUiTree(true)
    const newUiTree = Tree.clone(uiTree)
    Tree.forEach(
      newUiTree,
      component => Navigation.preFetchViews(component, urlBuilder, viewClient),
    )
    await new Promise(res => setTimeout(async () => {
      const cachedTree = storage.getItem(`${namespace}/${url}/get`)
      expect(cachedTree).toStrictEqual(JSON.stringify(treeA))
      expect(newUiTree).toEqual(uiTree)
      expect(nock.isDone()).toBe(true)
      res()
    }, 200))
    expect(nock.isDone()).toBe(true)
  })

  it('should not load uiTree and store it in cache when shouldPrefetch flag is false', async () => {
    const uiTree = createUiTree(false)
    const newUiTree = Tree.clone(uiTree)
    Tree.forEach(
      newUiTree,
      component => Navigation.preFetchViews(component, urlBuilder, viewClient),
    )
    await new Promise(res => setTimeout(async () => {
      const cachedTree = storage.getItem(`${namespace}/${url}/get`)
      expect(cachedTree).toBeNull()
      expect(newUiTree).toEqual(uiTree)
      expect(nock.isDone()).toBe(true)
      res()
    }, 200))
  })
})
