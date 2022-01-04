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

import { DataContext } from 'beagle-tree/types'
import LocalContext from 'beagle-view/local-contexts/context'
import { LocalContext as LocalContextType } from 'beagle-view/local-contexts/types'
import { LocalContextsManager } from './types'

function createLocalContextsManager(): LocalContextsManager {
  let localContexts: LocalContextType[] = []

  function getContext(id: string): LocalContextType | undefined {
    return localContexts.find(context => context.getAsDataContext().id === id)
  }

  function setContext(id: string, value: any, path?: string): void {
    let context = getContext(id)
    if (context) return context.set(value, path)

    context = LocalContext.create(id)
    context.set(value, path)

    localContexts.push(context)
  }

  function getAllAsDataContext(): DataContext[] {
    return localContexts.map(context => context.getAsDataContext())
  }

  function getContextAsDataContext(id: string): DataContext | undefined {
    const context = getContext(id)
    if (!context) return undefined
    return context.getAsDataContext()
  }

  function removeContext(id: string) {
    const index = localContexts.findIndex(context => context.getAsDataContext().id === id)
    if (index >= 0) localContexts.splice(index, 1)
  }

  function clearAll() {
    localContexts = []
  }

  return {
    getContext,
    setContext,
    getAllAsDataContext,
    getContextAsDataContext,
    removeContext,
    clearAll,
  }
}

export default {
  create: createLocalContextsManager,
}
