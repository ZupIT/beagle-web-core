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
import BeagleService from 'service/beagle-service'
import { BeagleView } from 'beagle-view/types'
import Tree from 'beagle-tree'
import {
  createBeagleContextFromViewContentManager,
  BeagleContext,
} from '../../src/legacy/beagle-context'
import { treeA, treeC, treeD } from './mocks'
import { mockLocalStorage } from './utils/test-utils'

const baseUrl = 'http://teste.com'
const path = '/myview'

describe('ViewContentManager', () => {
  const localStorageMock = mockLocalStorage()
  const viewId = 'beagleId'
  /* fixme: this is a terrible sign, if this test suit needs the entire beagle service to pass, its
  tests are clearly not unitary. */
  const { viewContentManagerMap, createView } = BeagleService.create({
    baseUrl,
    components: {},
  })
  let view: BeagleView

  beforeEach(() => {
    viewContentManagerMap.unregister(viewId)
    view = createView()
    view.getRenderer().doFullRender(treeA)
    viewContentManagerMap.register(viewId, view)
    nock.cleanAll()
    localStorageMock.clear()
  })

  afterAll(() => {
    localStorageMock.unmock()
  })

  it('should register a view', () => {
    expect(viewContentManagerMap.isRegistered(viewId)).toBe(true)
  })

  it('should create a context for a view', async () => {
    const context = viewContentManagerMap.get(viewId, 'A.1')

    expect(context.getView).toBeDefined()
    expect(context.getElement).toBeDefined()
    expect(context.getElementId).toBeDefined()
  })

  it('should get view, element and elementId from context', () => {
    const context = viewContentManagerMap.get(viewId, 'A.1')

    expect(context.getView).toBeDefined()
    const getView = context.getView()
    expect(getView).toEqual(view)

    expect(context.getElement).toBeDefined()
    const element = context.getElement()
    expect(element).toStrictEqual(treeA.children![1])

    expect(context.getElementId).toBeDefined()
    const elementId = context.getElementId()
    expect(elementId).toBe('A.1')
  })

  it('should throw an error trying to create a context for an unregistered view', () => {
    try {
      viewContentManagerMap.get('viewNotRegistered', '1')
    } catch {
      expect(viewContentManagerMap.get).toThrowError()
    }
  })

  it('should unregister a view', () => {
    viewContentManagerMap.unregister('beagleId')
    expect(viewContentManagerMap.isRegistered('beagleId')).toBe(false)
  })

})

describe('BeagleContext (Legacy)', () => {
  const localStorageMock = mockLocalStorage()
  const viewId = 'beagleId'
  /* fixme: this is a terrible sign, if this test suit needs the entire beagle service to pass, its
  tests are clearly not unitary. */
  const { viewContentManagerMap, createView } = BeagleService.create({
    baseUrl,
    components: {},
  })
  let view: BeagleView

  beforeEach(() => {
    viewContentManagerMap.unregister(viewId)
    view = createView()
    view.getRenderer().doFullRender(treeA)
    viewContentManagerMap.register(viewId, view)
    nock.cleanAll()
    localStorageMock.clear()
  })

  afterAll(() => {
    localStorageMock.unmock()
  })

  it('should create a context for a view', async () => {
    const context = createBeagleContextFromViewContentManager(
      viewContentManagerMap.get(viewId, 'A.1'),
    )

    expect(context.getView).toBeDefined()
    expect(context.getElement).toBeDefined()
    expect(context.getElementId).toBeDefined()
    expect(context.append).toBeDefined()
    expect(context.prepend).toBeDefined()
    expect(context.replace).toBeDefined()
    expect(context.updateWithTree).toBeDefined()
  })

  it('should get view, element and elementId from context', () => {
    const context = createBeagleContextFromViewContentManager(
      viewContentManagerMap.get(viewId, 'A.1'),
    )

    expect(context.getView).toBeDefined()
    const getView = context.getView()
    expect(getView).toEqual(view)

    expect(context.getElement).toBeDefined()
    const element = context.getElement()
    expect(element).toStrictEqual(treeA.children![1])

    expect(context.getElementId).toBeDefined()
    const elementId = context.getElementId()
    expect(elementId).toBe('A.1')
  })

  it('should replace current view from context', async () => {
    const context = createBeagleContextFromViewContentManager(
      viewContentManagerMap.get(viewId, 'A.1'),
    )
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeC))
    const currentTree = context.getView().getTree()
    
    await context.replace({ path })
    const replacedTree = Tree.clone(currentTree)
    replacedTree.children![1] = treeC
    expect(context.getView().getTree()).toStrictEqual(replacedTree)
    expect(nock.isDone()).toBe(true)
  })

  it('should append from context', async () => {
    const context = createBeagleContextFromViewContentManager(
      viewContentManagerMap.get(viewId, 'A'),
    )
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeD))
    const currentTree = context.getView().getTree()
    
    await context.append({ path })
    const appendedTree = Tree.clone(currentTree)
    appendedTree.children!.push(treeD)
    expect(context.getView().getTree()).toStrictEqual(appendedTree)
    expect(nock.isDone()).toBe(true)
  })

  it('should prepend from context', async () => {
    const context = createBeagleContextFromViewContentManager(
      viewContentManagerMap.get(viewId, 'A'),
    )
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeD))
    const currentTree = context.getView().getTree()
    
    await context.prepend({ path })
    const prependedTree = Tree.clone(currentTree)
    prependedTree.children!.unshift(treeD)
    expect(context.getView().getTree()).toStrictEqual(prependedTree)
    expect(nock.isDone()).toBe(true)
  })

  it('should replace even if root element', async () => {
    const context = createBeagleContextFromViewContentManager(
      viewContentManagerMap.get(viewId, 'A'),
    )
    context.updateWithTree({ sourceTree: treeA })
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeC))
  
    await context.replace({ path })
    expect(context.getView().getTree()).toStrictEqual(treeC)
    expect(nock.isDone()).toBe(true)
  })
})
