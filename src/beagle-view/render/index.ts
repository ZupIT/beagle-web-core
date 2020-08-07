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
import { ActionHandler } from 'action/types'
import { BeagleUIElement, IdentifiableBeagleUIElement, TreeUpdateMode } from 'beagle-tree/types'
import { ExecutionMode, Lifecycle, LifecycleHookMap } from 'service/beagle-service/types'
import { BeagleView } from 'beagle-view/types'
import { ChildrenMetadataMap, ComponentTypeMetadata } from 'metadata/types'
import { Renderer } from '../types'
import Component from './component'
import Navigation from './navigation'
import Expression from './expression'
import Action from './action'
import Context from './context'
import Styling from './styling'
import TypeChecker from './type-checker'

interface Params {
  beagleView: BeagleView,
  setTree: (tree: any) => void,
  typesMetadata: Record<string, ComponentTypeMetadata>,
  renderToScreen: (tree: any) => void,
  lifecycleHooks: LifecycleHookMap,
  childrenMetadata: ChildrenMetadataMap,
  executionMode: ExecutionMode,
  actionHandlers: Record<string, ActionHandler>,
}

function createRenderer({
  beagleView,
  setTree,
  typesMetadata,
  renderToScreen,
  lifecycleHooks,
  childrenMetadata,
  executionMode,
  actionHandlers,
}: Params): Renderer {
  const { urlBuilder, viewClient, globalContext } = beagleView.getBeagleService()

  function runGlobalLifecycleHook(viewTree: any, lifecycle: Lifecycle) {
    if (Object.keys(viewTree).length === 0) return viewTree
    const hook = lifecycleHooks[lifecycle].global
    if (!hook) return viewTree
    const newTree = hook(viewTree)
    return newTree || viewTree
  }

  function runComponentLifecycleHook(component: any, lifecycle: Lifecycle) {
    const hook = lifecycleHooks[lifecycle].components[component._beagleComponent_]
    if (!hook) return component
    const newComponent = hook(component)
    return newComponent || component
  }

  function runLifecycle<T extends BeagleUIElement>(viewTree: T, lifecycle: Lifecycle) {
    viewTree = runGlobalLifecycleHook(viewTree, lifecycle)
    return Tree.replaceEach(viewTree, component => (
      runComponentLifecycleHook(component, lifecycle)
    ))
  }
  
  function preProcess(viewTree: BeagleUIElement) {
    Tree.forEach(viewTree, (component) => {
      Component.formatChildrenProperty(component, childrenMetadata[component._beagleComponent_])
      Component.assignId(component)
      Component.eraseNullProperties(component)
      Navigation.preFetchViews(component, urlBuilder, viewClient)
    })

    return viewTree as IdentifiableBeagleUIElement
  }
  
  function takeViewSnapshot(
    viewTree: IdentifiableBeagleUIElement,
    anchor: string,
    mode: TreeUpdateMode,
  ) {
    let currentTree = beagleView.getTree()
    if (!currentTree) return setTree(viewTree)
    anchor = anchor || currentTree.id

    if (mode === 'replaceComponent') {
      if (anchor === currentTree.id) currentTree = viewTree
      else Tree.replaceInTree(currentTree, viewTree, anchor)
    } else {
      Tree.insertIntoTree(currentTree, viewTree, anchor, mode)
    }
  
    setTree(currentTree)
  }
  
  function evaluateComponents(viewTree: IdentifiableBeagleUIElement) {
    const contextMap = Context.evaluate(viewTree, [globalContext.getAsDataContext()])
    return Tree.replaceEach(viewTree, (component) => {
      Action.deserialize({
        component,
        contextHierarchy: contextMap[component.id],
        actionHandlers,
        beagleView,
      })
      const resolved = Expression.resolveForComponent(component, contextMap[component.id])
      Styling.convert(resolved)

      return resolved
    })
  }

  function checkTypes(viewTree: IdentifiableBeagleUIElement) {
    if (executionMode !== 'development') return
    Tree.forEach(viewTree, component => (
      TypeChecker.check(component, typesMetadata[component.id], childrenMetadata[component.id])
    ))
  }

  /**
   * Does a partial render to the BeagleView. Compared to the full render, it will skip every step
   * until the view snapshot, i.e, it will start by taking the view snapshot and end doing a render
   * to the screen. Useful when updating a view that has already been rendered. If the `viewTree`
   * hasn't been rendered before, you should use `doFullRender` instead.
   * 
   * To see the full documentation of the renderization process, please follow this link:
   * https://github.com/ZupIT/beagle-web-core/blob/master/docs/renderization.md
   * 
   * @param viewTree the new tree to render, can be just a new branch to add to the current tree
   * @param anchor when `viewTree` is just a new branch to be added to the tree, `anchor` must be
   * specified, it is the id of the component to attach `viewTree` to.
   * @param mode when `viewTree` is just a new branch to be added to the tree, the mode must be
   * specified. It can be `append`, `prepend` or `replace`.
   */
  function doPartialRender(
    viewTree: IdentifiableBeagleUIElement<any>,
    anchor = '',
    mode: TreeUpdateMode = 'replaceComponent',
  ) {
    takeViewSnapshot(viewTree, anchor, mode)
    let view = beagleView.getTree() as IdentifiableBeagleUIElement

    /* Next we are going to reprocess the entire tree. We're doing this because we need to guarantee
    that every action or expression will be correctly parsed. But, considering the occasions we'll
    be updating just a part of the tree, can't we store the last processed tree and use it instead
    of processing everything again? Todo: study this performance enhancement. */

    view = runLifecycle(view, 'afterViewSnapshot')
    view = evaluateComponents(view)
    view = runLifecycle(view, 'beforeRender')
    checkTypes(view)

    renderToScreen(view)
  }
  
  /**
   * Does a full render to the BeagleView. A full render means that every renderization step will
   * be executed for the tree passed as parameter. If `viewTree` has been rendered at least once,
   * you should call `doPartialRender` instead.
   * 
   * To see the full documentation of the renderization process, please follow this link:
   * https://github.com/ZupIT/beagle-web-core/blob/master/docs/renderization.md
   * 
   * @param viewTree the new tree to render, can be just a new branch to add to the current tree
   * @param anchor when `viewTree` is just a new branch to be added to the tree, `anchor` must be
   * specified, it is the id of the component to attach `viewTree` to.
   * @param mode when `viewTree` is just a new branch to be added to the tree, the mode must be
   * specified. It can be `append`, `prepend` or `replace`.
   */
  function doFullRender(
    viewTree: BeagleUIElement<any>,
    anchor = '',
    mode: TreeUpdateMode = 'replaceComponent',
  ) {
    viewTree = runLifecycle(viewTree, 'beforeStart')
    let viewTreeWithIds = preProcess(viewTree)
    viewTreeWithIds = runLifecycle(viewTreeWithIds, 'beforeViewSnapshot')
    doPartialRender(viewTreeWithIds, anchor, mode)
  }

  return {
    doPartialRender,
    doFullRender,
  }
}

export default {
  create: createRenderer,
}
