/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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
import has from 'lodash/has'
import unset from 'lodash/unset'
import getLodash from 'lodash/get'
import setLodash from 'lodash/set'
import { cloneDeep } from 'lodash'
import { DataContext } from 'beagle-tree/types'
import { LocalContext, LocalContextListener } from './types'

function createLocalContext(id: string): LocalContext {
  const listeners: Array<LocalContextListener> = []
  const localContext: DataContext = { id, value: null }

  function subscribe(listener: LocalContextListener) {
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index !== -1) listeners.splice(index, 1)
    }
  }

  function callUpdateListeners(listeners: Array<LocalContextListener>) {
    listeners.forEach(listener => listener())
  }

  function getAsDataContext() {
    return cloneDeep(localContext)
  }

  function get(path?: string) {
    if (!path) return cloneDeep(localContext.value)
    return getLodash(localContext.value, path)
  }

  function set(value: any, path?: string) {
    if (!path) localContext.value = value
    else {
      localContext.value = localContext.value || {}
      setLodash(localContext, `value.${path}`, value)
    }
    callUpdateListeners(listeners)
  }

  function clear(path?: string) {
    if (!path) {
      localContext.value = null
    } else {
      if (has(localContext.value, path)) {
        unset(localContext.value, path)
      } else logger.warn(`Invalid path: The path you are trying to clean ${path} doesn't exist in the global context`)
    }

    if (!path || has(localContext.value, path)) callUpdateListeners(listeners)
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
  create: createLocalContext,
}
