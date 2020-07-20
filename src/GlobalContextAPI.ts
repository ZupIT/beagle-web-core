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

import setLodash from 'lodash/set'
import getLodash from 'lodash/get'
import { GlobalContextAPI, DataContext, ListenerView } from './types'

export function deleteItemTree(tree: Record<string, any>, pathKeys: string[]): boolean {
  if (!pathKeys.length || !tree) {
    console.warn('Invalid path')
    return false
  }

  const hasArrayIndex = pathKeys[0].match(/[\d]/)
  const index = hasArrayIndex ? +hasArrayIndex[0] : null

  if (pathKeys.length === 1) {
    if (index !== null && hasArrayIndex && hasArrayIndex['index']) {
      const objectRef = pathKeys[0].substr(0, hasArrayIndex['index'] - 1)
      if (tree[objectRef] && tree[objectRef][index]) {
        tree[objectRef][index] = null
        return true
      } else {
        return false
      }
    }
    else
      delete tree[pathKeys[0]]
    return true
  }

  let subTree
  if (index !== null && hasArrayIndex && hasArrayIndex['index']) {
    const objectRef = pathKeys[0].substr(0, hasArrayIndex['index'] - 1)
    subTree = tree[objectRef][index]
  } else
    subTree = tree[pathKeys[0]]

  if (!subTree) {
    console.warn('Invalid path')
    return false
  }
  pathKeys.splice(0, 1)
  return deleteItemTree(subTree, pathKeys)
}

export function cloneObject(object: any) {
  return object && JSON.parse(JSON.stringify(object))
}

function globalContextService(): GlobalContextAPI {
  const listeners: Array<ListenerView> = []
  const globalContext: DataContext = {
    id: 'global',
  }

  function subscribe(listener: ListenerView) {
    listeners.push(listener)

    return () => {
      const index = listeners.indexOf(listener)
      if (index !== -1) listeners.splice(index, 1)
    }
  }

  function callUpdateListeners() {
    listeners.forEach(listener => listener())
  }

  function getEntireGlobalContext() {
    return cloneObject(globalContext)
  }

  function get(path?: string) {
    if (!path)
      return cloneObject(globalContext.value)

    return getLodash(globalContext.value, path)

  }

  function set(value: any, path?: string) {
    if (!path)
      globalContext.value = value
    else {
      globalContext.value = globalContext.value || {}
      setLodash(globalContext.value, path, value)
    }
    callUpdateListeners()
  }

  function clear(path?: string) {
    if (!path) {
      globalContext.value = null
      callUpdateListeners()
    }
    else {
      const splittedPath = path.split('.')
      const deletedItem = deleteItemTree(globalContext.value, splittedPath)
      if (deletedItem) 
        callUpdateListeners()
      
    }
  }


  return {
    get,
    set,
    clear,
    getEntireGlobalContext,
    subscribe,
  }
}

const globalContextApi = globalContextService()

export default globalContextApi
