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
import { BeagleView as BeagleViewType } from 'beagle-view/types'
import BeagleService from 'service/beagle-service'
import BeagleCacheError from 'error/BeagleCacheError'
import BeagleExpiredCacheError from 'error/BeagleExpiredCacheError'
import BeagleNetworkError from 'error/BeagleNetworkError'
import Tree from 'beagle-tree'
import { treeA, treeB } from './mocks'
import { mockLocalStorage, stripTreeIds } from './utils/test-utils'

const baseUrl = 'http://teste.com'
const path = '/myview'
const url = `${baseUrl}${path}`

describe('BeagleUIView', () => {
  const localStorageMock = mockLocalStorage()
  let view: BeagleViewType
  const fetchData = jest.fn(fetch)
  const middleware = jest.fn(tree => tree)
  const { createView, globalContext } = BeagleService.create({
    baseUrl,
    components: {},
    lifecycles: { beforeRender: middleware },
    fetchData,
  })
  globalContext.subscribe = jest.fn()
  const originalConsoleError = console.error
  console.error = jest.fn()

  beforeEach(() => {
    nock.cleanAll()
    view = createView()
    localStorageMock.clear()
    middleware.mockClear()
    const consoleError = console.error as jest.Mock
    consoleError.mockClear()
    fetchData.mockClear()
  })

  afterAll(() => {
    console.error = originalConsoleError
    localStorageMock.unmock()
  })

  it('should get current ui tree', async () => {
    expect(view.getTree()).toBeUndefined()
    view.getRenderer().doFullRender({ _beagleComponent_: 'test 1', id: '1'})
    expect(view.getTree()).toEqual({ _beagleComponent_: 'test 1', id: '1' })
    view.getRenderer().doFullRender({ _beagleComponent_: 'test 2', id: '2'})
    expect(view.getTree()).toEqual({ _beagleComponent_: 'test 2', id: '2' })
    expect(globalContext.subscribe).toHaveBeenCalled()
  })

  it('should subscribe to view changes', async () => {
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    view.subscribe(listener1)
    view.subscribe(listener2)
    view.getRenderer().doFullRender({ _beagleComponent_: 'test 1', id: '1'})
    expect(listener1).toHaveBeenCalledWith({ _beagleComponent_: 'test 1', id: '1' })
    expect(listener2).toHaveBeenCalledWith({ _beagleComponent_: 'test 1', id: '1' })
  })

  it('should unsubscribe from view changes', async () => {
    const listener = jest.fn()
    const unsubscribe = view.subscribe(listener)
    view.getRenderer().doFullRender({ _beagleComponent_: 'test 1' })
    expect(listener).toHaveBeenCalled()
    listener.mockClear()
    unsubscribe()
    view.getRenderer().doFullRender({ _beagleComponent_: 'test 2' })
    expect(listener).not.toHaveBeenCalled()
  })

  it('should subscribe to errors', async () => {
    nock(baseUrl).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    view.addErrorListener(listener1)
    view.addErrorListener(listener2)
    await view.fetch({ path })
    // @ts-ignore
    const expectedErrors = [
      new BeagleExpiredCacheError(url),
      // @ts-ignore
      new BeagleNetworkError(url),
      new BeagleCacheError(url),
    ]
    expect(listener1).toHaveBeenCalledWith(expectedErrors)
    expect(listener2).toHaveBeenCalledWith(expectedErrors)
    expect(nock.isDone()).toBe(true)
  })

  it('should unsubscribe from errors', async () => {
    const originalConsoleError = console.error
    console.error = jest.fn()

    nock(baseUrl).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const listener = jest.fn()
    const unsubscribe = view.addErrorListener(listener)
    await view.fetch({ path })
    // @ts-ignore
    expect(listener).toHaveBeenCalled()
    listener.mockClear()
    unsubscribe()
    await view.fetch({ path })
    expect(listener).not.toHaveBeenCalled()
    expect(nock.isDone()).toBe(true)

    console.error = originalConsoleError
  })

  it('should run middlewares', async () => {
    const tree = { _beagleComponent_: 'test' }
    view.getRenderer().doFullRender(tree)
    expect(middleware).toHaveBeenCalledWith(tree)
    // expect beagleIdMiddleware to have been run
    expect(view.getTree().id).not.toBeUndefined()
  })

  // fixme: the id part of this test should be tested in the file that tests the id assignment
  it('should not run middlewares for empty trees', async () => {
    const tree = {}
    //@ts-ignore
    view.getRenderer().doFullRender(tree)
    expect(middleware).not.toHaveBeenCalled()
    // empty tree should not have id
    expect(view.getTree().id).toBeUndefined()
  })

  it('should replace entire content with network response', async () => {
    view.getRenderer().doFullRender(treeA)
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeB))
    await view.fetch({ path })
    expect(view.getTree()).toEqual(treeB)
    expect(nock.isDone()).toBe(true)
    nock.cleanAll()
  })

  it('should replace part of the tree with loading and network response', async () => {
    const mockFunc = jest.fn()
    view.subscribe(mockFunc)

    // we don't want to test the styling
    const treeAWithoutStyles = Tree.clone(treeA)
    Tree.forEach(treeAWithoutStyles, component => delete component.style)
  
    view.getRenderer().doFullRender(treeAWithoutStyles)
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeB))
    const promise = view.fetch({ path }, 'A.1')
    const expectedLoading = Tree.clone(treeAWithoutStyles)
    
    await promise

    expectedLoading.children![1] = { _beagleComponent_: 'custom:loading', id: 'loading' }
    expect(mockFunc.mock.calls[0][0]).toEqual(treeAWithoutStyles)
    expect(stripTreeIds(mockFunc.mock.calls[1][0])).toEqual(stripTreeIds(expectedLoading))
  
    const expectedResult = Tree.clone(treeAWithoutStyles)
    expectedResult.children![1] = treeB

    expect(mockFunc.mock.calls[2][0]).toEqual(expectedResult)
    expect(view.getTree()).toEqual(expectedResult)
    expect(nock.isDone()).toBe(true)
  })

  it('should append loading and network response to specific part of the tree', async () => {
    const mockFunc = jest.fn()
    view.subscribe(mockFunc)

    // we don't want to test the styling
    const treeAWithoutStyles = Tree.clone(treeA)
    Tree.forEach(treeAWithoutStyles, component => delete component.style)
  
    view.getRenderer().doFullRender(treeAWithoutStyles)
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeB))
    const promise = view.fetch({ path }, 'A.1', 'append')

    await promise

    const expectedLoading = Tree.clone(treeAWithoutStyles)
    expectedLoading.children![1].children!.push({
      _beagleComponent_: 'custom:loading',
      id: 'loading',
    })
    expect(mockFunc.mock.calls[0][0]).toEqual(treeAWithoutStyles)
    expect(stripTreeIds(mockFunc.mock.calls[1][0])).toEqual(stripTreeIds(expectedLoading))


    const expectedResult = Tree.clone(treeAWithoutStyles)
    expectedResult.children![1].children!.push(treeB)
    expect(mockFunc.mock.calls[2][0]).toEqual(expectedResult)
    expect(view.getTree()).toEqual(expectedResult)
    expect(nock.isDone()).toBe(true)
  })

  it('should prepend network response to specific part of the tree', async () => {
    const mockFunc = jest.fn()
    view.subscribe(mockFunc)
    
    // we don't want to test the styling
    const treeAWithoutStyles = Tree.clone(treeA)
    Tree.forEach(treeAWithoutStyles, component => delete component.style)
  
    view.getRenderer().doFullRender(treeAWithoutStyles)
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeB))
    const promise = view.fetch({ path }, 'A.1', 'prepend')

    await promise

    const expectedLoading = Tree.clone(treeAWithoutStyles)
    expectedLoading.children![1].children!.unshift({ _beagleComponent_: 'custom:loading', id: 'loading' })
    expect(mockFunc.mock.calls[0][0]).toEqual(treeAWithoutStyles)
    expect(stripTreeIds(mockFunc.mock.calls[1][0])).toEqual(stripTreeIds(expectedLoading))


    const expectedResult = Tree.clone(treeAWithoutStyles)
    expectedResult.children![1].children!.unshift(treeB)
    expect(mockFunc.mock.calls[2][0]).toEqual(expectedResult)
    expect(view.getTree()).toEqual(expectedResult)
    expect(nock.isDone()).toBe(true)
  })

  it('should encapsulate ui tree: getTree', () => {
    const tree = { _beagleComponent_: 'test 1' }
    view.getRenderer().doFullRender(tree)
    expect(view.getTree()).not.toBe(tree)
  })

  it('should encapsulate ui tree: updateTree', async () => {
    const tree = { _beagleComponent_: 'test 1' }
    const listener = jest.fn()
    view.subscribe(listener)
    view.getRenderer().doFullRender(tree)
    expect(listener.mock.calls[0][0]).not.toBe(tree)
  })

  it('should use custom HttpClient to fetch', async () => {
    const path = '/example'
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeB))

    await view.fetch({ path })
 
    expect(fetchData).toHaveBeenCalledWith(
      baseUrl + path,
      { 'method': 'get', 'headers': { 'beagle-platform': 'WEB'} },
    )
  })

  it('should fallback to UIElement when fetch fails', async () => {
    const fallbackTree = { _beagleComponent_: 'test 1' }
    nock(baseUrl).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    await view.fetch({ path, fallback: fallbackTree })
    expect(view.getTree()).toEqual(fallbackTree)
    expect(nock.isDone()).toBe(true)
  })

  it('should not fallback to UIElement when fetch succeed', async () => {
    const fallbackTree = { _beagleComponent_: 'test 1' }
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeA))
    await view.fetch({ path, fallback: fallbackTree })
    expect(view.getTree()).toEqual(treeA)
    expect(nock.isDone()).toBe(true)
  })

  it('should handle path as relative without starting with /', async () => {
    const mockFunc = jest.fn()
    view.subscribe(mockFunc)
    const path = 'example'
    nock(baseUrl).get(`/${path}`).reply(200, JSON.stringify(treeB))
    await view.fetch({ path })
    expect(nock.isDone()).toBe(true)
  })

  it('should make request for root baseUrl path', async () => {
    const mockFunc = jest.fn()
    view.subscribe(mockFunc)
    const path = ''
    nock(baseUrl).get(`/${path}`).reply(200, JSON.stringify(treeB))
    await view.fetch({ path })
    expect(nock.isDone()).toBe(true)
  })

  it('should log errors when no error listener is registered', async () => {
    nock(baseUrl).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    await view.fetch({ path })
    expect(console.error).toHaveBeenCalled()
    expect(nock.isDone()).toBe(true)
  })

  it('should not log errors when ai least one listener is registered', async () => {
    nock(baseUrl).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    view.addErrorListener(jest.fn())
    await view.fetch({ path })
    // @ts-ignore
    expect(console.error).not.toHaveBeenCalled()
    expect(nock.isDone()).toBe(true)
  })
})
