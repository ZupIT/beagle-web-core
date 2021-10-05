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

import Tree from 'beagle-tree'
import { Lifecycle } from 'service/beagle-service/types'
import { BeagleUIElement, IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { BeagleService } from 'service/beagle-service/types'
import { BeagleNavigator } from 'beagle-navigator/types'
import createService from '../frontend/service'
import { ConfigOptions } from '../frontend/config'
import { whenCalledTimes, getParameterByCalls } from '../../../utils/function'

export interface RenderingResult {
  beforeStart: BeagleUIElement[],
  beforeViewSnapshot: IdentifiableBeagleUIElement[],
  afterViewSnapshot: IdentifiableBeagleUIElement[],
  beforeRender: IdentifiableBeagleUIElement[],
  render: IdentifiableBeagleUIElement[],
}

export interface RenderOptions extends ConfigOptions {
  beforeViewCreation?: (service: BeagleService) => void,
}

/**
 * Creates a BeagleService and spawns a BeagleView with the given Route. This function returns a
 * promise that resolves to a map of array of trees. Each key in the map represents a step in the
 * rendering process and, since, multiple renders are done before the view is in its final state,
 * the value for each key is an array of trees, where the first position is the first render and the
 * last position is the last render.
 *
 * This is an async function, the returned promise is resolved as soon as the final render is done.
 * The parameter `numberOfRenders` is what defines the final render. If `numberOfRenders` is 2, for
 * example, the promise will be resolved after the seconde render.
 *
 * @param route the initial route of the BeagleView.
 * @param numberOfRenders the number of renders necessary to achieve the final render.
 * @param options optional. The configuration options for the BeagleService.
 * @returns a promise that resolves to the rendering result: a map where the key is a rendering step
 * and the value is an array of trees, one for render.
 */
export async function renderView(
  route: string,
  numberOfRenders: number,
  options: RenderOptions = {},
): Promise<RenderingResult> {
  const {
    beforeViewCreation,
    ...configOptions
  } = options

  const { service, createBeagleRemoteView } = createService(configOptions)
  if (beforeViewCreation) beforeViewCreation(service)
  const lifecycles = service.getConfig().lifecycles! as Record<Lifecycle, jest.Mock>
  const { current: { render, view } } = await createBeagleRemoteView({ route })

  await whenCalledTimes(render, numberOfRenders)

  return {
    beforeStart: getParameterByCalls(lifecycles.beforeStart),
    beforeViewSnapshot: getParameterByCalls(lifecycles.beforeViewSnapshot),
    afterViewSnapshot: getParameterByCalls(lifecycles.afterViewSnapshot),
    beforeRender: getParameterByCalls(lifecycles.beforeRender),
    render: getParameterByCalls(render),
  }
}

export function renderHomeView() {
  /* must wait for three renders. First: loading. Second: home with an empty repeater. Third:
  repeater with children. */
  return renderView('/home', 3)
}

export function renderTemplatedHomeView() {
  /* must wait for three renders. First: loading. Second: home with an empty repeater. Third:
  repeater with children. */
  return renderView('/templatedHome', 3)
}

export function renderLabelsView() {
  /* must wait for two renders. First: view "labels" with an empty repeater. Second: the same view,
  but the repeater has children. */
  return renderView('/labels', 2, { showLoading: false })
}

export function renderDetailsView(noteId?: number): Promise<RenderingResult> {
  const hasNoteId = noteId !== undefined

  /* must wait for two renders if on creation mode, or three, if on edit mode. First render: the
  details page with an empty form and a loading overlay. If on edit mode, the note details will be
  loaded from the server and rendered to the form; Final render: the loading overlay is removed. */
  const numberOfRenders = hasNoteId ? 3 : 2

  function beforeViewCreation(service: BeagleService) {
    if (hasNoteId) service.globalContext.set(noteId, 'selectedNote')
  }

  return renderView(
    '/details',
    numberOfRenders,
    { beforeViewCreation, showLoading: false },
  )
}

/**
 * Finds the first repeater in the given tree.
 *
 * @param tree the tree to search for the repeater
 * @returns the repeater or undefined if none is found
 */
export function getRepeater(tree: BeagleUIElement) {
  return Tree.findByType(tree, 'custom:repeater')[0]
}

/**
 * Finds the first repeater in the given tree and creates a copy of the tree where this repeater
 * has no children (children is undefined).
 *
 * @param view the view to clone and remove the repeater's children
 * @returns the copy of the view with an empty repeater
 */
export function getViewWithAnEmptyRepeater(view: BeagleUIElement) {
  const emptyRepeaterView = Tree.clone(view)
  const emptyRepeater = getRepeater(emptyRepeaterView)
  delete emptyRepeater.children
  return emptyRepeaterView
}

/**
 * Finds the first template manager in the given tree.
 *
 * @param tree the tree to search for the template manager
 * @returns the repeater or undefined if none is found
 */
 export function getTemplate(tree: BeagleUIElement) {
  return Tree.findByType(tree, 'custom:template')[0]
}

/**
 * Finds the first template manager in the given tree and creates a copy of the tree where this template manager
 * has no children (children is undefined).
 *
 * @param view the view to clone and remove the template manager's children
 * @returns the copy of the view with an empty template manager
 */
export function getViewWithAnEmptyTemplateManager(view: BeagleUIElement) {
  const emptyTemplateManagerView = Tree.clone(view)
  const emptyTemplateManager = getTemplate(emptyTemplateManagerView)
  delete emptyTemplateManager.children
  return emptyTemplateManagerView
}

export function whenNextNavigation(navigator: BeagleNavigator<any>) {
  return new Promise<void>((resolve) => {
    const remove = navigator.onChange(() => {
      remove()
      resolve()
    })
  })
}
