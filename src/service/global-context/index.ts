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

import logger from 'logger'
import setLodash from 'lodash/set'
import getLodash from 'lodash/get'
import unset from 'lodash/unset'
import has from 'lodash/has'
import cloneDeep from 'lodash/cloneDeep'
import { DataContext } from 'beagle-tree/types'
import { GlobalContext, GlobalContextListener } from './types'

function createGlobalContext(): GlobalContext {
  const listeners: Array<GlobalContextListener> = []
  const globalContext: DataContext = {
    id: 'global',
    value: null,
  }

  function subscribe(listener: GlobalContextListener) {
    listeners.push(listener)

    return () => {
      const index = listeners.indexOf(listener)
      if (index !== -1) listeners.splice(index, 1)
    }
  }

  function callUpdateListeners() {
    listeners.forEach(listener => listener())
  }

  function getAsDataContext() {
    return cloneDeep(globalContext)
  }

  function get(path?: string) {
    if (!path)
      return cloneDeep(globalContext.value)

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
      if (has(globalContext.value, path)) {
        unset(globalContext.value, path)
        callUpdateListeners()
      }
      else logger.warn(`Invalid path: The path you are trying to clean ${path} doesn't exist in the global context`)
    }
  }

  return {
    get,
    set,
    clear,
    getAsDataContext,
    subscribe,
  }
}

export default {
  create: createGlobalContext,
}
