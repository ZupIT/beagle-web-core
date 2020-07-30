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

import BeagleStorage from '../../src/BeagleStorage'
import { BeagleUIElement, BeagleView, Renderer } from '../../src/types'

export function mockLocalStorage(storage: Record<string, string> = {}) {
  const initialStorage = { ...storage }
  const globalScope = global as any
  const original = globalScope.localStorage

  const localStorageObject = {
    getItem: jest.fn(key => storage[key] || null),
    setItem: jest.fn((key, value) => storage[key] = value),
  }
  
  globalScope.localStorage = localStorageObject
  // @ts-ignore
  BeagleStorage.setStorage(localStorageObject)

  return {
    unmock: () => globalScope.localStorage = original,
    clear: () => {
      storage = { ...initialStorage }
      localStorageObject.getItem.mockClear()
      localStorageObject.setItem.mockClear()
    },
  }
}

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

export function hasDifferentPointers(data1, data2) {
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
  }
}

export function createBeagleViewMock(custom: Partial<BeagleView> = {}): BeagleView {
  const renderer = createRenderer()

  return {
    addErrorListener: jest.fn(custom.addErrorListener),
    getTree: jest.fn(custom.getTree),
    subscribe: jest.fn(custom.subscribe),
    fetch: jest.fn(custom.fetch),
    getBeagleNavigator: jest.fn(),
    getRenderer: jest.fn(custom.getRenderer || (() => renderer)),
    destroy: jest.fn(),
  }
}
