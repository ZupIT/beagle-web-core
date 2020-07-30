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

import { clone } from './utils/tree-manipulation'
import { load as loadUITree } from './utils/tree-fetching'
import {
  BeagleUIElement,
  IdentifiableBeagleUIElement,
  Listener,
  ErrorListener,
  BeagleView,
  TreeUpdateMode,
  LoadParams,
  BeagleNavigator,
  Renderer,
  LifecycleHookMap,
  ChildrenMetadataMap,
} from './types'
import urlBuilder from './UrlBuilder'
import createBeagleNavigator from './BeagleNavigator'
import { addPrefix } from './utils/string'
import createRenderer from './Renderer'
import { ActionHandler } from './actions/types'
import globalContextApi from './GlobalContextAPI'

const createBeagleView = <Schema>(
  initialRoute: string,
  actionHandlers: Record<string, ActionHandler>,
  lifecycleHooks: LifecycleHookMap,
  childrenMetadata: ChildrenMetadataMap,
): BeagleView<Schema> => {
  let currentUITree: IdentifiableBeagleUIElement<Schema>
  const listeners: Array<Listener<Schema>> = []
  const errorListeners: Array<ErrorListener> = []
  const beagleNavigator: BeagleNavigator = createBeagleNavigator({ url: initialRoute })
  let renderer: Renderer = {} as Renderer

  function subscribe(listener: Listener<Schema>) {
    listeners.push(listener)

    return () => {
      const index = listeners.indexOf(listener)
      if (index !== -1) listeners.splice(index, 1)
    }
  }

  function addErrorListener(listener: ErrorListener) {
    errorListeners.push(listener)

    return () => {
      const index = errorListeners.indexOf(listener)
      if (index !== -1) errorListeners.splice(index, 1)
    }
  }

  function setTree(newUITree: IdentifiableBeagleUIElement<Schema>) {
    currentUITree = newUITree
  }

  function runListeners(viewTree: IdentifiableBeagleUIElement<Schema>) {
    listeners.forEach(l => l(viewTree))
  }

  function runErrorListeners(errors: any) {
    errorListeners.forEach(l => l(errors))
  }

  async function fetch(
    params: LoadParams<Schema>,
    elementId?: string,
    mode: TreeUpdateMode = 'replaceComponent',
  ) {
    const path = addPrefix(params.path, '/')
    const url = urlBuilder.build(path)
    const originalTree = currentUITree
    const fallbackUIElement = params.fallback

    function onChangeTree(loadedTree: BeagleUIElement<Schema>) {
      setTree(originalTree) // changes should be made based on the original tree
      renderer.doFullRender(loadedTree, elementId, mode)
    }

    try {
      await loadUITree({
        url,
        fallbackUIElement,
        onChangeTree,
        errorComponent: params.errorComponent,
        loadingComponent: params.loadingComponent,
        headers: params.headers,
        method: params.method,
        shouldShowError: params.shouldShowError,
        shouldShowLoading: params.shouldShowLoading,
        retry: () => fetch(params, elementId, mode),
      })
    } catch (errors) {
      // removes the loading component when an error component should not be rendered
      if (params.shouldShowLoading && !params.shouldShowError) setTree(originalTree)
      if (errorListeners.length === 0) console.error(errors)
      runErrorListeners(errors)
    }
  }

  function getTree() {
    // to avoid errors, we should never give access to our own tree to third parties
    return clone(currentUITree)
  }

  function getBeagleNavigator() {
    return beagleNavigator
  }

  const beagleView: BeagleView<Schema> = {
    subscribe,
    addErrorListener,
    fetch,
    getRenderer: () => renderer,
    getTree,
    getBeagleNavigator,
  }

  renderer = createRenderer({
    beagleView,
    actionHandlers,
    childrenMetadata,
    executionMode: 'development',
    lifecycleHooks,
    renderToScreen: runListeners,
    setTree,
    typesMetadata: {},
  })

  globalContextApi.subscribe(() => renderer.doFullRender(getTree()))

  return beagleView
}

export default createBeagleView
