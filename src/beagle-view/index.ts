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
import Tree from 'beagle-tree'
import String from 'utils/string'
import StringUtils from 'utils/string'
import { BeagleService } from 'service/beagle-service/types'
import { IdentifiableBeagleUIElement, BeagleUIElement, TreeUpdateMode } from 'beagle-tree/types'
import Renderer from './render'
import { Renderer as RendererType } from './render/types'
import BeagleNavigator from './navigator'
import { LocalView, RemoteView } from './navigator/types'
import {
  BeagleView,
  Listener,
  ErrorListener,
  LoadParams,
  UpdateWithTreeParams,
  NetworkOptions,
  CreateBeagleView,
} from './types'

const DEFAULT_INITIALIZATION_EVENTS = ['onInit']

const createBeagleView: CreateBeagleView = (
  beagleService: BeagleService,
  networkOptionsOrInitialControllerId?: NetworkOptions | string,
  initialControllerId?: string,
): BeagleView => {
  let currentUITree: IdentifiableBeagleUIElement
  const listeners: Array<Listener> = []
  const errorListeners: Array<ErrorListener> = []
  const { navigationControllers } = beagleService.getConfig()
  // todo: remove legacy code for v2.0
  let networkOptions: NetworkOptions | undefined
  if (typeof networkOptionsOrInitialControllerId === 'string') {
    initialControllerId = networkOptionsOrInitialControllerId
  } else {
    networkOptions = networkOptionsOrInitialControllerId
  }
  // end of legacy code
  const initialNavigationHistory = [{ routes: [], controllerId: initialControllerId }]
  let renderer = {} as RendererType
  let unsubscribeFromGlobalContext = () => { }

  function getTree() {
    // to avoid errors, we should never give access to our own tree to third parties
    return Tree.clone(currentUITree)
  }

  function getViewState() {
    const tree = getTree()
    if (!tree) return
    const initializationEvents = (
      beagleService.getConfig().initializationEvents
      || DEFAULT_INITIALIZATION_EVENTS
    )
    Tree.forEach(tree, (component) => {
      initializationEvents.forEach(eventName => delete component[eventName])
    })

    return tree
  }

  let navigator = BeagleNavigator.create(
    navigationControllers,
    initialNavigationHistory,
    getViewState,
  )

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

  /* todo: beagleView.fetch has been deprecated. This  function is still needed for internal usage,
  but we can probably simplify it a lot once we no longer need to support beagleView.fetch
  (v2.0). */
  async function fetch(
    params: LoadParams,
    elementId?: string,
    mode: TreeUpdateMode = 'replaceComponent',
  ) {
    const path = String.addPrefix(params.path, '/')
    const url = beagleService.urlBuilder.build(path)
    const originalTree = currentUITree
    const fallbackUIElement = params.fallback

    // todo: legacy code. remove the following "if" in v2.0.
    // if this is equivalent to a first navigation, reflect it in the navigator
    if (navigator.isEmpty() && !elementId && mode === 'replaceComponent') {
      const initialNavigationHistory = [
        {
          routes: [{ url: path }],
          controllerId: initialControllerId,
        }]
      navigator = BeagleNavigator.create(
        navigationControllers,
        initialNavigationHistory,
        getViewState,
      )
      // eslint-disable-next-line
      setupNavigation()
    }

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
        body: params.body,
        shouldShowError: params.shouldShowError,
        shouldShowLoading: params.shouldShowLoading,
        strategy: params.strategy,
        retry: () => fetch(params, elementId, mode),
      })
    } catch (errors) {
      // removes the loading component when an error component should not be rendered
      if (params.shouldShowLoading && !params.shouldShowError) setTree(originalTree)
      if (errorListeners.length === 0) logger.error(...errors)
      runErrorListeners(errors)
    }
  }

  function destroy() {
    unsubscribeFromGlobalContext()
    navigator.destroy()
  }

  // todo: legacy code. Remove this function with v2.0.
  function updateWithFetch(
    params: LoadParams,
    elementId?: string,
    mode: 'replace' | 'append' | 'prepend' = 'replace',
  ) {
    const newMode = mode === 'replace' ? 'replaceComponent' : mode
    return fetch(params, elementId, newMode)
  }

  // todo: legacy code. Remove this function with v2.0.
  function updateWithTree({
    sourceTree,
    middlewares = [],
    mode = 'replace',
    shouldRunListeners = true,
    shouldRunMiddlewares = true,
    elementId,
  }: UpdateWithTreeParams<any>) {
    const warnings = [
      '"updateWithTree" has been deprecated and now exists only as a compatibility mode. This will be fully removed in v2.0. Please, consider updating your code.',
    ]
    const errors = []

    if (middlewares.length) {
      errors.push('The option "middlewares" in "updateWithTree" is no longer supported. Please contact the Beagle WEB team for further guidance.')
    }

    if (!shouldRunListeners) {
      errors.push('The option "shouldRunListeners" in "updateWithTree" is no longer supported. Please contact the Beagle WEB team for further guidance.')
    }

    const newMode = mode === 'replace' ? 'replaceComponent' : mode
    if (shouldRunMiddlewares) renderer.doFullRender(sourceTree, elementId, newMode)
    else {
      warnings.push('The option "shouldRunMiddlewares" in "updateWithTree" is no longer fully supported and might not have the desired effect. If the behavior you\'re getting differs from what you expected, please contact the Beagle WEB team.')
      renderer.doPartialRender(sourceTree as IdentifiableBeagleUIElement, elementId, newMode)
    }

    logger.warn(...warnings)
    if (errors.length) logger.error(...errors)
  }

  function getNetworkOptions() {
    return networkOptions && { ...networkOptions }
  }

  const beagleView: BeagleView = {
    subscribe,
    addErrorListener,
    getRenderer: () => renderer,
    getTree,
    getNavigator: () => navigator,
    getBeagleService: () => beagleService,
    destroy,
    // todo: legacy code. Remove the following 3 properties with v2.0.
    fetch: (...args) => {
      logger.warn('beagleView.fetch has been deprecated to avoid inconsistencies with the internal Beagle Navigator. It will be removed with version 2.0. If you want to change the current view according to a new url, consider using the navigator instead.')
      return fetch(...args)
    },
    updateWithFetch,
    updateWithTree,
    getNetworkOptions,
  }

  function createRenderer() {
    renderer = Renderer.create({
      beagleView,
      actionHandlers: beagleService.actionHandlers,
      operationHandlers: beagleService.operationHandlers,
      childrenMetadata: beagleService.childrenMetadata,
      executionMode: 'development',
      lifecycleHooks: beagleService.lifecycleHooks,
      renderToScreen: runListeners,
      setTree,
      typesMetadata: {},
      disableCssTransformation: !!beagleService.getConfig().disableCssTransformation,
    })
  }

  function setupNavigation() {
    navigator.subscribe(async (route, navigationController) => {
      const { urlBuilder, preFetcher, analyticsService } = beagleService
      const { screen } = route as LocalView
      const { url, fallback, shouldPrefetch, httpAdditionalData } = route as RemoteView
      let isDone = false

      if (screen) return renderer.doFullRender(screen)

      if (shouldPrefetch) {
        const path = StringUtils.addPrefix(url, '/')
        const preFetchedUrl = urlBuilder.build(path)
        try {
          const preFetchedView = await preFetcher.recover(preFetchedUrl)
          renderer.doFullRender(preFetchedView)
          isDone = true
        } catch { }
      }
      if (!isDone) {
        const httpData = httpAdditionalData || networkOptions
        await fetch({ path: url, fallback, ...httpData, ...navigationController })
      }

      const platform = beagleService.getConfig().platform

      analyticsService.createScreenRecord({
        route: route,
        currentTree: getTree(),
        platform: platform,
      })

    })
  }

  function setupGlobalContext() {
    unsubscribeFromGlobalContext = beagleService.globalContext.subscribe(
      () => renderer.doPartialRender(getTree()),
    )
  }

  createRenderer()
  setupNavigation()
  setupGlobalContext()

  return beagleView
}

export default {
  create: createBeagleView,
}
