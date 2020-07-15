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
import { GlobalContextAPI, GlobalDataContext } from './types'
import beagleTreeHelper from './BeagleTree'

function deleteItemTree(tree: Record<string, any>, pathKeys: string[]): boolean {
  if (!pathKeys.length) {
    console.warn('Invalid path')
    return false
  }

  if (pathKeys.length === 1) {
    delete tree[pathKeys[0]]
    return true
  }
  const subTree = tree[pathKeys[0]]
  if (!subTree) {
    console.warn('Invalid path')
    return false
  }
  pathKeys.splice(0, 1)
  return deleteItemTree(subTree, pathKeys)
}

function cloneObject(object: any) {
  return object && JSON.parse(JSON.stringify(object))
}

function callUpdateTree() {
  const tree = beagleTreeHelper.getBeagleTree()
  const view = beagleTreeHelper.getBeagleView()
  if (view && tree) {
    view.updateWithTree({ sourceTree: tree })
  }
}

function globalContextService(): GlobalContextAPI {
  const globalContext: GlobalDataContext = {
    id: 'global',
  }

  function getEntireGlobalContext() {
    return cloneObject(globalContext)
  }

  function get(path?: string) {
    if (!path)
      return cloneObject(globalContext.value)
    else
      return getLodash(globalContext.value, path)
  }

  function set(value: any, path?: string) {
    if (!path)
      globalContext.value = value
    else{
      globalContext.value = globalContext.value || {}
      setLodash(globalContext.value, path, value)
    }
    //TODO: update the view
    callUpdateTree()
  }


  function clear(path?: string) {
    if (!path)
      globalContext.value = null
    else {
      const data = getLodash(globalContext.value, path)
      if (Array.isArray(data)) {
        setLodash(globalContext.value, path, null)
        //TODO: update the view
        callUpdateTree()
      }
      else if (typeof data === 'object') {
        const splittedPath = path.split('.')
        const deletedItem = deleteItemTree(globalContext.value, splittedPath)
        if (deletedItem) {
          //TODO: update the view
          callUpdateTree()
        }

      } else {
        console.warn('Invalid path')
      }
    }
  }

  return {
    get,
    set,
    clear,
    getEntireGlobalContext,
  }
}

const globalContextApi = globalContextService()

export default globalContextApi
