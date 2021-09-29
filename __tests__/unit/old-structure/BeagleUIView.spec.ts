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
import BeagleView from 'beagle-view'
import BeagleService from 'service/beagle-service'
import BeagleNetworkError from 'error/BeagleNetworkError'
import { treeA, treeB } from './mocks'
import { createHttpResponse } from './utils/test-utils'

const baseUrl = 'http://teste.com'
const path = '/myview'
const url = `${baseUrl}${path}`

describe('BeagleUIView', () => {
  let view: BeagleViewType
  const fetchData = jest.fn(fetch)
  const middleware = jest.fn(tree => tree)
  const unsubscribeFromGlobalContext = jest.fn()
  const service = BeagleService.create({
    baseUrl,
    components: {},
    lifecycles: { beforeRender: middleware },
    fetchData,
  })
  const { globalContext } = service
  globalContext.subscribe = jest.fn(() => unsubscribeFromGlobalContext)

  beforeEach(() => {
    nock.cleanAll()
    view = BeagleView.create(service)
    middleware.mockClear()
    fetchData.mockClear()
    globalMocks.log.mockClear()
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
    view.onChange(listener1)
    view.onChange(listener2)
    view.getRenderer().doFullRender({ _beagleComponent_: 'test 1', id: '1'})
    expect(listener1).toHaveBeenCalledWith({ _beagleComponent_: 'test 1', id: '1' })
    expect(listener2).toHaveBeenCalledWith({ _beagleComponent_: 'test 1', id: '1' })
  })

  it('should unsubscribe from view changes', async () => {
    const listener = jest.fn()
    const unsubscribe = view.onChange(listener)
    view.getRenderer().doFullRender({ _beagleComponent_: 'test 1' })
    expect(listener).toHaveBeenCalled()
    listener.mockClear()
    unsubscribe()
    view.getRenderer().doFullRender({ _beagleComponent_: 'test 2' })
    expect(listener).not.toHaveBeenCalled()
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

  it('should encapsulate ui tree: getTree', () => {
    const tree = { _beagleComponent_: 'test 1' }
    view.getRenderer().doFullRender(tree)
    expect(view.getTree()).not.toBe(tree)
  })

  it('should encapsulate ui tree: updateTree', async () => {
    const tree = { _beagleComponent_: 'test 1' }
    const listener = jest.fn()
    view.onChange(listener)
    view.getRenderer().doFullRender(tree)
    expect(listener.mock.calls[0][0]).not.toBe(tree)
  })

  it('should call global context unsubscribe when calling destroy', () => {
    view.destroy()
    expect(unsubscribeFromGlobalContext).toHaveBeenCalled()
  })
})
