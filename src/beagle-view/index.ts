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

import pull from 'lodash/pull'
import Tree from 'beagle-tree'
import { BeagleService } from 'service/beagle-service/types'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { BeagleNavigator } from 'beagle-navigator/types'
import Renderer from './render'
import { Renderer as RendererType } from './render/types'
import { BeagleView, ChangeListener } from './types'
import { LocalContextsManager as LocalContextsManagerType } from './local-contexts/types'
import LocalContextsManager from './local-contexts/manager'

const createBeagleView = (
  beagleService: BeagleService,
  parentNavigator?: BeagleNavigator<any>,
): BeagleView => {
  let currentUITree: IdentifiableBeagleUIElement
  const changeListeners: ChangeListener[] = []
  const state: Record<string, any> = {}

  let renderer = {} as RendererType
  let localContextsManager = {} as LocalContextsManagerType
  let unsubscribeFromGlobalContext = () => {}

  function getTree() {
    // to avoid errors, we should never give access to our own tree to third parties
    return Tree.clone(currentUITree)
  }

  function onChange(listener: ChangeListener) {
    changeListeners.push(listener)
    return () => pull(changeListeners, listener)
  }

  function setTree(newUITree: IdentifiableBeagleUIElement) {
    currentUITree = newUITree
  }

  function runChangeListeners(viewTree: IdentifiableBeagleUIElement) {
    changeListeners.forEach(l => l(viewTree))
  }

  function destroy() {
    unsubscribeFromGlobalContext()
  }

  const beagleView: BeagleView = {
    onChange,
    getLocalContexts: () => localContextsManager,
    getRenderer: () => renderer,
    getTree,
    getNavigator: () => parentNavigator,
    getBeagleService: () => beagleService,
    destroy,
    getState: () => state,
  }

  function createRenderer() {
    renderer = Renderer.create({
      beagleView,
      actionHandlers: beagleService.actionHandlers,
      operationHandlers: beagleService.operationHandlers,
      childrenMetadata: beagleService.childrenMetadata,
      lifecycleHooks: beagleService.lifecycleHooks,
      renderToScreen: runChangeListeners,
      setTree,
      typesMetadata: {},
      disableCssTransformation: !!beagleService.getConfig().disableCssTransformation,
    })
  }

  function createLocalContext() {
    localContextsManager = LocalContextsManager.create()
  }

  function setupGlobalContexts() {
    unsubscribeFromGlobalContext = beagleService.globalContext.subscribe(() => renderer.doPartialRender(getTree()))
  }

  createLocalContext()
  createRenderer()
  setupGlobalContexts()

  return beagleView
}

export default {
  create: createBeagleView,
}
