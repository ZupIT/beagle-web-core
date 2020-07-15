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
import BeagleContext, { views } from '../src/BeagleContext'
import { clone } from '../src/utils/tree-manipulation'
import { treeA, treeC, treeD } from './mocks'
import { mockLocalStorage } from './test-utils'
import UrlBuilder from '../src/UrlBuilder'
import { LifecycleHookMap } from '../src/types'

const baseUrl = 'http://teste.com'
const path = '/myview'

describe('BeagleContext', () => {
  const localStorageMock = mockLocalStorage()
  const viewId = 'beagleId'
  const lifecycles: LifecycleHookMap = {
    beforeStart: { components: {} },
    beforeViewSnapshot: { components: {} },
    afterViewSnapshot: { components: {} },
    beforeRender: { components: {} },
  }

  UrlBuilder.setBaseUrl(baseUrl)

  beforeEach(() => {
    BeagleContext.unregisterView(viewId)
    const view = createBeagleView('/home', {}, lifecycles, {})
    view.getRenderer().doFullRender(treeA)
    BeagleContext.registerView(viewId, view)
    nock.cleanAll()
    localStorageMock.clear()
  })

  it('should register a view', () => {
    expect(views[viewId]).toBeDefined()
  })

  it('should create a context for a view', async () => {
    const context = BeagleContext.getContext(viewId, 'A.1')

    expect(context.getView).toBeDefined()
    expect(context.getElement).toBeDefined()
    expect(context.getElementId).toBeDefined()
    expect(context.append).toBeDefined()
    expect(context.prepend).toBeDefined()
    expect(context.replace).toBeDefined()
  })

  it('should get view, element and elementId from context', () => {
    const context = BeagleContext.getContext(viewId, 'A.1')

    expect(context.getView).toBeDefined()
    const getView = context.getView()
    expect(getView).toEqual(views[viewId])

    expect(context.getElement).toBeDefined()
    const element = context.getElement()
    expect(element).toStrictEqual(treeA.children[1])

    expect(context.getElementId).toBeDefined()
    const elementId = context.getElementId()
    expect(elementId).toBe('A.1')
  })

  it('should replace current view from context', async () => {
    const context = BeagleContext.getContext(viewId, 'A.1')
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeC))
    const currentTree = context.getView().getTree()
    
    await context.replaceComponent({ path })
    const replacedTree = clone(currentTree)
    replacedTree.children[1] = treeC
    expect(context.getView().getTree()).toStrictEqual(replacedTree)
    expect(nock.isDone()).toBe(true)
  })

  it('should append from context', async () => {
    const context = BeagleContext.getContext(viewId, 'A')
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeD))
    const currentTree = context.getView().getTree()
    
    await context.append({ path })
    const appendedTree = clone(currentTree)
    appendedTree.children.push(treeD)
    expect(context.getView().getTree()).toStrictEqual(appendedTree)
    expect(nock.isDone()).toBe(true)
  })

  it('should prepend from context', async () => {
    const context = BeagleContext.getContext(viewId, 'A')
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeD))
    const currentTree = context.getView().getTree()
    
    await context.prepend({ path })
    const prependedTree = clone(currentTree)
    prependedTree.children.unshift(treeD)
    expect(context.getView().getTree()).toStrictEqual(prependedTree)
    expect(nock.isDone()).toBe(true)
  })

  it('should throw an error trying to create a context for an unregistered view', () => {
    try {
      BeagleContext.getContext('viewNotRegistered', '1')
    } catch {
      expect(BeagleContext.getContext).toThrowError()
    }
  })

  it('should replace even if root element', async () => {
    const context = BeagleContext.getContext(viewId, 'A')
    context.getView().getRenderer().doFullRender(treeA)
    nock(baseUrl).get(path).reply(200, JSON.stringify(treeC))
  
    await context.replaceComponent({ path })
    expect(context.getView().getTree()).toStrictEqual(treeC)
    expect(nock.isDone()).toBe(true)
  })

  it('should unregister a view', () => {
    BeagleContext.unregisterView('beagleId')
    expect(views['beagleId']).toBeUndefined()
  })

})
