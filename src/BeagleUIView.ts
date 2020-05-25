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

import beagleIdMiddleware from './middlewares/beagleId'
import { clone, insertIntoTree, replaceInTree, addChild } from './utils/tree-manipulation'
import { load as loadUITree } from './utils/tree-fetching'
import {
  BeagleUIElement,
  IdentifiableBeagleUIElement,
  Listener,
  ErrorListener,
  BeagleView,
  UpdateWithTreeParams,
  BeagleMiddleware,
  TreeUpdateMode,
  LoadParams,
  BeagleConfig,
  BeagleNavigator,
} from './types'
import createURLBuilder from './utils/url-builder'
import createBeagleNavigator from './BeagleNavigator'
import beagleHttpClient from './BeagleHttpClient'
import beagleTabViewMiddleware from './middlewares/tab-view-component'
import convertChildToChildren from './middlewares/convert-child-to-children'
import beagleStyleMiddleware from './middlewares/beagle-style'
import beagleStyleClassMiddleware from './middlewares/beagle-style-class'

const createBeagleView = <Schema>({
  baseUrl,
  middlewares = [],
  fetchData,
}: BeagleConfig<Schema>, initialRoute: string): BeagleView<Schema> => {
  let currentUITree: IdentifiableBeagleUIElement<Schema>
  const listeners: Array<Listener<Schema>> = []
  const errorListeners: Array<ErrorListener> = []
  const urlFormatter = createURLBuilder(baseUrl)
  const beagleNavigator: BeagleNavigator = createBeagleNavigator({ url: initialRoute })
  beagleHttpClient.setFetchFunction(fetchData || fetch)

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

  function setTree(newUITree: IdentifiableBeagleUIElement<Schema>, shouldRunListeners = true) {
    currentUITree = newUITree
    // to avoid errors, we should never give access to our own tree to third parties
    const treeCopy = clone(currentUITree)
    if (shouldRunListeners) listeners.forEach(listener => listener(treeCopy))
  }

  function runMiddlewares(
    uiTree: BeagleUIElement<any>,
    middlewares: Array<BeagleMiddleware<any>>,
  ): BeagleUIElement<Schema> {
    return middlewares.reduce((result, middleware) => middleware(result), uiTree)
  }

  function runUserMiddlewares(
    uiTree: BeagleUIElement<any>,
    localMiddlewares: Array<BeagleMiddleware<any>>,
  ): BeagleUIElement<Schema> {
    return runMiddlewares(uiTree, [...middlewares, ...localMiddlewares])
  }

  function runSystemMiddlewares(uiTree: BeagleUIElement<any>) {

    return runMiddlewares(
      uiTree,
      [beagleTabViewMiddleware,
        beagleIdMiddleware,
        beagleStyleMiddleware,
        beagleStyleClassMiddleware,
        convertChildToChildren]
    ) as IdentifiableBeagleUIElement<Schema>
  }

  function updateRoot(
    sourceTreeAfterApplyingMiddlewares: IdentifiableBeagleUIElement<Schema>,
    mode: TreeUpdateMode,
    shouldRunListeners: boolean,
  ) {
    if (mode === 'replace') {
      setTree(sourceTreeAfterApplyingMiddlewares, shouldRunListeners)
      return
    }

    const targetTree = clone(currentUITree)
    addChild(targetTree, sourceTreeAfterApplyingMiddlewares, mode)
    setTree(targetTree, shouldRunListeners)
  }

  function updateElement(
    sourceTreeAfterApplyingMiddlewares: IdentifiableBeagleUIElement<Schema>,
    elementId: string,
    mode: TreeUpdateMode,
    shouldRunListeners: boolean,
  ) {
    const targetTree = clone(currentUITree)

    if (mode === 'replace') {
      replaceInTree(targetTree, sourceTreeAfterApplyingMiddlewares, elementId)
    } else {
      insertIntoTree(targetTree, sourceTreeAfterApplyingMiddlewares, elementId, mode)
    }

    setTree(targetTree, shouldRunListeners)
  }

  function updateWithTree({
    sourceTree,
    middlewares: localMiddlewares = [],
    elementId,
    mode = 'replace',
    shouldRunMiddlewares = true,
    shouldRunListeners = true,
  }: UpdateWithTreeParams<Schema>) {
    const sourceTreeAfterApplyingUserMiddlewares = shouldRunMiddlewares
      ? runUserMiddlewares(sourceTree, localMiddlewares)
      : sourceTree

    const sourceTreeAfterApplyingAllMiddlewares = runSystemMiddlewares(
      sourceTreeAfterApplyingUserMiddlewares,
    )

    if (!elementId) updateRoot(sourceTreeAfterApplyingAllMiddlewares, mode, shouldRunListeners)
    else updateElement(sourceTreeAfterApplyingAllMiddlewares, elementId, mode, shouldRunListeners)
  }

  async function updateWithFetch(
    params: LoadParams<Schema>,
    elementId?: string,
    mode: TreeUpdateMode = 'replace',
  ) {
    const url = urlFormatter.build(params.path, params.baseUrl)
    const fallbackUIElement = params.fallback
    const originalTree = currentUITree

    function onChangeTree(loadedTree: BeagleUIElement<Schema>) {
      setTree(originalTree, false) // changes should be made based on the original tree
      updateWithTree({
        sourceTree: loadedTree,
        elementId,
        mode,
        middlewares: params.middlewares,
      })
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
      })
    } catch (errors) {
      // removes the loading component when an error component should no be rendered
      if (params.shouldShowLoading && !params.shouldShowError) setTree(originalTree)
      errorListeners.forEach(listener => listener(errors))
    }
  }

  function getTree() {
    // to avoid errors, we should never give access to our own tree to third parties
    return clone(currentUITree)
  }

  function getBeagleNavigator() {
    return beagleNavigator
  }

  function getUrlBuilder() {
    return urlFormatter
  }

  return {
    subscribe,
    addErrorListener,
    updateWithFetch,
    updateWithTree,
    getTree,
    getBeagleNavigator,
    getUrlBuilder,
  }
}

export default createBeagleView
