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

import logger from 'logger'
import Tree from 'beagle-tree'
import String from 'utils/string'
import BeagleError from 'error/BeagleError'
import { BeagleService } from 'service/beagle-service/types'
import { IdentifiableBeagleUIElement, BeagleUIElement, TreeUpdateMode } from 'beagle-tree/types'
import Renderer from './render'
import BeagleNavigator from './navigator'
import { BeagleNavigator as BeagleNavigatorType } from './types'
import { BeagleView, Listener, ErrorListener, LoadParams, Renderer as RendererType } from './types'

function createBeagleView(beagleService: BeagleService): BeagleView {
  let currentUITree: IdentifiableBeagleUIElement
  const listeners: Array<Listener> = []
  const errorListeners: Array<ErrorListener> = []
  let navigator: BeagleNavigatorType | undefined
  let renderer = {} as RendererType
  let unsubscribeFromGlobalContext = () => {}

  function subscribe(listener: Listener) {
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

  function setTree(newUITree: IdentifiableBeagleUIElement) {
    currentUITree = newUITree
  }

  function runListeners(viewTree: IdentifiableBeagleUIElement) {
    listeners.forEach(l => l(viewTree))
  }

  function runErrorListeners(errors: any) {
    errorListeners.forEach(l => l(errors))
  }

  async function fetch(
    params: LoadParams,
    elementId?: string,
    mode: TreeUpdateMode = 'replaceComponent',
  ) {
    const path = String.addPrefix(params.path, '/')
    const url = beagleService.urlBuilder.build(path)
    const originalTree = currentUITree
    const fallbackUIElement = params.fallback
    navigator = navigator || BeagleNavigator.create({ url: path })

    function onChangeTree(loadedTree: BeagleUIElement) {
      setTree(originalTree) // changes should be made based on the original tree
      renderer.doFullRender(loadedTree, elementId, mode)
    }

    try {
      await beagleService.viewClient.load({
        url,
        fallbackUIElement,
        onChangeTree,
        errorComponent: params.errorComponent,
        loadingComponent: params.loadingComponent,
        headers: params.headers,
        method: params.method,
        shouldShowError: params.shouldShowError,
        shouldShowLoading: params.shouldShowLoading,
        strategy: params.strategy,
        retry: () => fetch(params, elementId, mode),
      })
    } catch (errors) {
      // removes the loading component when an error component should not be rendered
      if (params.shouldShowLoading && !params.shouldShowError) setTree(originalTree)
      if (errorListeners.length === 0) logger.error(errors)
      runErrorListeners(errors)
    }
  }

  function getTree() {
    // to avoid errors, we should never give access to our own tree to third parties
    return Tree.clone(currentUITree)
  }

  function getBeagleNavigator() {
    if (!navigator) {
      throw new BeagleError('You need to fetch at least one view before using the navigator.')
    }
    return navigator
  }

  function destroy() {
    unsubscribeFromGlobalContext()
  }

  const beagleView: BeagleView = {
    subscribe,
    addErrorListener,
    fetch,
    getRenderer: () => renderer,
    getTree,
    getBeagleNavigator,
    getBeagleService: () => beagleService,
    destroy,
  }

  renderer = Renderer.create({
    beagleView,
    actionHandlers: beagleService.actionHandlers,
    childrenMetadata: beagleService.childrenMetadata,
    executionMode: 'development',
    lifecycleHooks: beagleService.lifecycleHooks,
    renderToScreen: runListeners,
    setTree,
    typesMetadata: {},
  })

  unsubscribeFromGlobalContext = beagleService.globalContext.subscribe(
    () => renderer.doFullRender(getTree()),
  )

  return beagleView
}

export default {
  create: createBeagleView,
}
