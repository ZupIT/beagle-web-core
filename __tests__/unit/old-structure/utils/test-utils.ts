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

import { BeagleUIElement } from 'beagle-tree/types'
import { BeagleView } from 'beagle-view/types'
import { Renderer } from 'beagle-view/render/types'
import { BeagleNavigator, DoubleStack } from 'beagle-navigator/types'
import { BeagleService } from 'service/beagle-service/types'
import { GlobalContext } from 'service/global-context/types'
import { URLBuilder } from 'service/network/url-builder/types'
import { ViewClient } from 'service/network/view-client/types'
import { HttpClient } from 'service/network/types'
import defaultOperations from 'operation'

export function mockSystemDialogs(result = false) {
  const globalScope = global as any
  const original = globalScope.window

  globalScope.window = {
    alert: jest.fn(() => result),
    confirm: jest.fn(() => result),
  }

  return () => {
    globalScope.window = original
  }
}

export function hasDifferentPointers(data1: any, data2: any) {
  if (typeof data1 !== 'object') return true
  if (data1 === data2) return false

  if (data1 instanceof Array) {
    for (let i = 0; i < data1.length; i++) {
      if (!hasDifferentPointers(data1[i], data2[i])) return false
    }
    return true
  }

  const keys = Object.keys(data1)
  for (let i = 0; i < keys.length; i++) {
    if (!hasDifferentPointers(data1[keys[i]], data2[keys[i]])) return false
  }
  return true
}

export function last(array: Array<any>) {
  return array[array.length - 1]
}

export function stripTreeIds(tree: BeagleUIElement<any>): BeagleUIElement<any> {
  const newTree = { ...tree }
  delete newTree.id
  if (newTree.children) newTree.children = newTree.children.map(stripTreeIds)
  return newTree
}

export function createRenderer(): Renderer {
  return {
    doFullRender: jest.fn(),
    doPartialRender: jest.fn(),
    doTemplateRender: jest.fn(),
  }
}

export function createGlobalContextMock(): GlobalContext {
  return {
    clear: jest.fn(),
    get: jest.fn(() => null),
    getAsDataContext: jest.fn(() => ({ id: 'global', value: null })),
    set: jest.fn(),
    subscribe: jest.fn(),
  }
}

export function createUrlBuilderMock(custom: Partial<URLBuilder> = {}): URLBuilder {
  return {
    build: jest.fn(url => url),
    ...custom,
  }
}

export function createViewClientMock(custom: Partial<ViewClient> = {}): ViewClient {
  return {
    fetch: jest.fn(),
    prefetch: jest.fn(),
    ...custom,
  }
}

export function createHttpResponse(custom?: Partial<Response>): Response {
  const response: Response = {
    body: null,
    bodyUsed: false,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    // @ts-ignore
    headers: {},
    ok: true,
    redirected: false,
    status: 200,
    statusText: 'OK',
    // @ts-ignore
    trailer: Promise.resolve({}),
    type: 'default',
    url: '',
    clone: () => response,
    ...custom,
  }

  return response
}

export function createHttpClientMock(): HttpClient {
  const response = createHttpResponse()
  return {
    fetch: jest.fn(() => Promise.resolve(response))
  }
}

export function createBeagleServiceMock(custom: Partial<BeagleService> = {}): BeagleService {
  return {
    actionHandlers: custom.actionHandlers || {},
    operationHandlers: custom.operationHandlers || defaultOperations,
    analyticsService: { createActionRecord: jest.fn(), createScreenRecord: jest.fn() },
    childrenMetadata: custom.childrenMetadata || {},
    // @ts-ignore
    createView: custom.createView || (() => null),
    getConfig: custom.getConfig || (() => ({ baseUrl: '', components: {}, platform: 'Test' })),
    globalContext: custom.globalContext || createGlobalContextMock(),
    httpClient: custom.httpClient || createHttpClientMock(),
    lifecycleHooks: custom.lifecycleHooks || {
      afterViewSnapshot: { components: {} },
      beforeRender: { components: {} },
      beforeStart: { components: {} },
      beforeViewSnapshot: { components: {} },
    },
    viewContentManagerMap: custom.viewContentManagerMap || {
      get: jest.fn(),
      register: jest.fn(),
      unregister: jest.fn(),
      isRegistered: jest.fn(),
    },
    urlBuilder: custom.urlBuilder || {
      build: jest.fn(url => url),
    },
    viewClient: custom.viewClient || {
      fetch: jest.fn(),
      prefetch: jest.fn(),
    },
  }
}

type PartialBeagleView = (
  Partial<Omit<BeagleView, 'getBeagleService'>>
  & { getBeagleService?: () => Partial<BeagleService> }
)

export function createNavigatorMock(): BeagleNavigator<any> {
  return {
    navigate: jest.fn(),
    popStack: jest.fn(),
    popToView: jest.fn(),
    popView: jest.fn(),
    pushStack: jest.fn(),
    pushView: jest.fn(),
    resetApplication: jest.fn(),
    resetStack: jest.fn(),
    onChange: jest.fn(),
    isEmpty: jest.fn(),
    getCurrentRoute: jest.fn()
  }
}

export function createBeagleViewMock(custom: PartialBeagleView = {}): BeagleView {
  const renderer = createRenderer()
  const navigator = createNavigatorMock()
  const beagleService = createBeagleServiceMock()

  return {
    getTree: jest.fn(custom.getTree),
    onChange: jest.fn(custom.onChange),
    getNavigator: jest.fn(custom.getNavigator || (() => navigator)),
    getRenderer: jest.fn(custom.getRenderer || (() => renderer)),
    // @ts-ignore
    getBeagleService: custom.getBeagleService || jest.fn(() => beagleService),
    destroy: jest.fn(),
  }
}

export function createDoubleStackMock<T>(custom?: Partial<DoubleStack<any>>): DoubleStack<T> {
  let topItem: T

  return {
    pushItem: jest.fn(i => topItem = i),
    popItem: jest.fn(),
    popUntil: jest.fn(),
    pushStack: jest.fn(i => topItem = i),
    popStack: jest.fn(),
    resetStack: jest.fn(i => topItem = i),
    reset: jest.fn(i => topItem = i),
    getTopItem: jest.fn(() => topItem),
    isEmpty: jest.fn(),
    hasSingleStack: jest.fn(),
    hasSingleItem: jest.fn(),
    asMatrix: jest.fn(),
    ...custom,
  }
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
