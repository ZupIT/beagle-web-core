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

import pull from 'lodash/pull'
import Tree from 'beagle-tree'
import { BeagleService } from 'service/beagle-service/types'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { BeagleNavigator } from 'beagle-navigator/types'
import Renderer from './render'
import { Renderer as RendererType } from './render/types'
import { BeagleView, ChangeListener } from './types'

const createBeagleView = (
  beagleService: BeagleService,
  parentNavigator?: BeagleNavigator<any>,
): BeagleView => {
  let currentUITree: IdentifiableBeagleUIElement
  const changeListeners: ChangeListener[] = []

  let renderer = {} as RendererType
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
    getRenderer: () => renderer,
    getTree,
    getNavigator: () => parentNavigator,
    getBeagleService: () => beagleService,
    destroy,
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

  function setupGlobalContext() {
    unsubscribeFromGlobalContext = beagleService.globalContext.subscribe(
      () => renderer.doPartialRender(getTree()),
    )
  }

  createRenderer()
  setupGlobalContext()

  return beagleView
}

export default {
  create: createBeagleView,
}
