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
import createBeagleView from '../src/BeagleUIView'
import { BeagleView } from '../src/types'
import { BeagleCacheError, BeagleNetworkError } from '../src/errors'
import { clone } from '../src/utils/tree-manipulation'
import { treeA, treeB } from './mocks'
import { mockLocalStorage, stripTreeIds } from './test-utils'

const baseUrl = 'http://teste.com'
const path = '/myview'
const url = `${baseUrl}${path}`

describe('BeagleUIView', () => {
  const localStorageMock = mockLocalStorage()
  let view: BeagleView
  const middleware = jest.fn(tree => tree)

  beforeEach(() => {
    view = createBeagleView({
      baseUrl,
      components: {},
      middlewares: [middleware],
    }, '/home')
    nock.cleanAll()
    localStorageMock.clear()
    middleware.mockClear()
  })

  it('should get current ui tree', async () => {
    expect(view.getTree()).toBeUndefined()
    view.updateWithTree({ sourceTree: { _beagleComponent_: 'test 1', id: '1' } })
    expect(view.getTree()).toEqual({ _beagleComponent_: 'test 1', id: '1' })
    view.updateWithTree({ sourceTree: { _beagleComponent_: 'test 2', id: '2' } })
    expect(view.getTree()).toEqual({ _beagleComponent_: 'test 2', id: '2' })
  })

  it('should subscribe to view changes', async () => {
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    view.subscribe(listener1)
    view.subscribe(listener2)
    view.updateWithTree({ sourceTree: { _beagleComponent_: 'test 1', id: '1' } })
    expect(listener1).toHaveBeenCalledWith({ _beagleComponent_: 'test 1', id: '1' })
    expect(listener2).toHaveBeenCalledWith({ _beagleComponent_: 'test 1', id: '1' })
  })

  it('should unsubscribe from view changes', async () => {
    const listener = jest.fn()
    const unsubscribe = view.subscribe(listener)
    view.updateWithTree({ sourceTree: { _beagleComponent_: 'test 1' }, shouldRunMiddlewares: false })
    expect(listener).toHaveBeenCalled()
    listener.mockClear()
    unsubscribe()
    view.updateWithTree({ sourceTree: { _beagleComponent_: 'test 2' }, shouldRunMiddlewares: false })
    expect(listener).not.toHaveBeenCalled()
  })

  it('should not run view change listeners', async () => {
    const listener = jest.fn()
    view.updateWithTree({ sourceTree: { _beagleComponent_: 'test 1' }, shouldRunListeners: false })
    expect(listener).not.toHaveBeenCalled()
  })

  it('should subscribe to errors', async () => {
    nock(baseUrl).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    view.addErrorListener(listener1)
    view.addErrorListener(listener2)
    await view.updateWithFetch({ path })
    // @ts-ignore
    const expectedErrors = [new BeagleNetworkError(url), new BeagleCacheError(url)]
    expect(listener1).toHaveBeenCalledWith(expectedErrors)
    expect(listener2).toHaveBeenCalledWith(expectedErrors)
    expect(nock.isDone()).toBe(true)
  })

  it('should unsubscribe from errors', async () => {
    nock(baseUrl).get(path).reply(500, JSON.stringify({ error: 'unexpected error' }))
    const listener = jest.fn()
    const unsubscribe = view.addErrorListener(listener)
    await view.updateWithFetch({ path })
    // @ts-ignore
    expect(listener).toHaveBeenCalled()
    listener.mockClear()
    unsubscribe()
    await view.updateWithFetch({ path })
    expect(listener).not.toHaveBeenCalled()
    expect(nock.isDone()).toBe(true)
  })

  it('should run only global middlewares', async () => {
    const tree = { _beagleComponent_: 'test' }
    view.updateWithTree({ sourceTree: tree })
    expect(middleware).toHaveBeenCalledWith(tree)
    // expect beagleIdMiddleware to have been run
    expect(view.getTree().id).not.toBeUndefined()
  })

  it('should run global and local middlewares', async () => {
    const tree = { _beagleComponent_: 'test' }
    const localMiddleware = jest.fn(resultingTree => resultingTree)
    view.updateWithTree({ sourceTree: tree, middlewares: [localMiddleware] })
    expect(middleware).toHaveBeenCalledWith(tree)
    expect(localMiddleware).toHaveBeenCalledWith(tree)
    // expect beagleIdMiddleware to have been run
    expect(view.getTree().id).not.toBeUndefined()
  })

  it('should replace entire content with network response', async () => {
    view.updateWithTree({ sourceTree: treeA })
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeB))
    await view.updateWithFetch({ path })
    expect(view.getTree()).toEqual(treeB)
  })

  it('should replace part of the tree with loading and network response', async () => {
    const mockFunc = jest.fn()
    view.subscribe(mockFunc);
    view.updateWithTree({ sourceTree: treeA })
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeB))
    const promise = view.updateWithFetch({ path }, 'A.1')
    const expectedLoading = clone(treeA)
    
    await promise

    expectedLoading.children[1] = { _beagleComponent_: 'loading', id: 'loading' }
    expect(mockFunc.mock.calls[0][0]).toEqual(treeA)
    expect(stripTreeIds(mockFunc.mock.calls[1][0])).toEqual(stripTreeIds(expectedLoading))
  
    const expectedResult = clone(treeA)
    expectedResult.children[1] = treeB

    expect(mockFunc.mock.calls[2][0]).toEqual(expectedResult)
    expect(view.getTree()).toEqual(expectedResult)
  })

  it('should append loading and network response to specific part of the tree', async () => {
    const mockFunc = jest.fn()
    view.subscribe(mockFunc);
    view.updateWithTree({ sourceTree: treeA })
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeB))
    const promise = view.updateWithFetch({ path }, 'A.1', 'append')

    await promise

    const expectedLoading = clone(treeA)
    expectedLoading.children[1].children.push({ _beagleComponent_: 'loading', id: 'loading' })
    expect(mockFunc.mock.calls[0][0]).toEqual(treeA)
    expect(stripTreeIds(mockFunc.mock.calls[1][0])).toEqual(stripTreeIds(expectedLoading))


    const expectedResult = clone(treeA)
    expectedResult.children[1].children.push(treeB)
    expect(mockFunc.mock.calls[2][0]).toEqual(expectedResult)
    expect(view.getTree()).toEqual(expectedResult)
  })

  it('should prepend network response to specific part of the tree', async () => {
    const mockFunc = jest.fn()
    view.subscribe(mockFunc);
    view.updateWithTree({ sourceTree: treeA })
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeB))
    const promise = view.updateWithFetch({ path }, 'A.1', 'prepend')

    await promise

    const expectedLoading = clone(treeA)
    expectedLoading.children[1].children.unshift({ _beagleComponent_: 'loading', id: 'loading' })
    expect(mockFunc.mock.calls[0][0]).toEqual(treeA)
    expect(stripTreeIds(mockFunc.mock.calls[1][0])).toEqual(stripTreeIds(expectedLoading))


    const expectedResult = clone(treeA)
    expectedResult.children[1].children.unshift(treeB)
    expect(mockFunc.mock.calls[2][0]).toEqual(expectedResult)
    expect(view.getTree()).toEqual(expectedResult)
  })

  it('should encapsulate ui tree: getTree', () => {
    const tree = { _beagleComponent_: 'test 1' }
    view.updateWithTree({ sourceTree: tree, shouldRunMiddlewares: false })
    expect(view.getTree()).not.toBe(tree)
  })

  it('should encapsulate ui tree: updateTree', async () => {
    const tree = { _beagleComponent_: 'test 1' }
    const listener = jest.fn()
    view.subscribe(listener)
    view.updateWithTree({ sourceTree: tree, shouldRunMiddlewares: false })
    expect(listener.mock.calls[0][0]).not.toBe(tree)
  })

  it('should apply fetchData configuration to HttpClient', async () => {
    const path = '/example'
    const fetchData = jest.fn()
    view = createBeagleView({
      baseUrl,
      components: {},
      middlewares: [middleware],
      fetchData
    }, '')
    await view.updateWithFetch({ path })
 
    const expectedResult = clone(treeA)
    expect(fetchData).toHaveBeenCalledWith(baseUrl + path, { "method": "get" })
  })
})
