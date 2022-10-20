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

import Tree from 'beagle-tree'
import logger from 'logger'
import { ActionHandler } from 'action/types'
import { BeagleUIElement, DataContext, IdentifiableBeagleUIElement, ImplicitDataContext, TreeInsertionMode, TreeUpdateMode } from 'beagle-tree/types'
import { ExecutionMode, Lifecycle, LifecycleHookMap, Operation } from 'service/beagle-service/types'
import { BeagleView } from 'beagle-view/types'
import { ChildrenMetadataMap, ComponentTypeMetadata } from 'metadata/types'
import { ComponentManager, TemplateManager } from 'beagle-view/render/template-manager/types'
import { getEvaluatedTemplate } from 'beagle-view/render/template-manager'
import BeagleParseError from 'error/BeagleParseError'
import { getTreeContextHierarchy } from 'utils/context'
import { Renderer } from './types'
import Component from './component'
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
  executionMode?: ExecutionMode,
  actionHandlers: Record<string, ActionHandler>,
  operationHandlers: Record<string, Operation>,
  disableCssTransformation: boolean,
}

function createRenderer({
  beagleView,
  setTree,
  typesMetadata,
  renderToScreen,
  lifecycleHooks,
  childrenMetadata,
  // this is not currently being used. It's ok to set it to whatever value
  executionMode = 'production',
  actionHandlers,
  operationHandlers,
  disableCssTransformation,
}: Params): Renderer {
  const { globalContext } = beagleView.getBeagleService()

  function runGlobalLifecycleHook(viewTree: any = {}, lifecycle: Lifecycle) {
    if (Object.keys(viewTree).length === 0) return viewTree
    const hook = lifecycleHooks[lifecycle].global
    if (!hook) return viewTree
    const newTree = hook(viewTree)
    return newTree || viewTree
  }

  function isMalFormedComponent(component: any) {
    return !component || !component._beagleComponent_
  }

  function runComponentLifecycleHook(component: any, lifecycle: Lifecycle) {
    if (isMalFormedComponent(component)) {
      const componentStr = JSON.stringify(component, null, 2) || typeof component
      throw new BeagleParseError(`You have a malformed component, please check the view json. Detected at lifecycle "${lifecycle}". Component value:\n${componentStr}`)
    }
    const hook = lifecycleHooks[lifecycle].components[component._beagleComponent_.toLowerCase()]
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
    const localContexts = beagleView.getLocalContexts().getAllAsDataContext()
    const contextMap = Context.evaluate(viewTree, [globalContext.getAsDataContext(), ...localContexts])
    return Tree.replaceEach(viewTree, (component) => {
      Action.deserialize({
        component,
        contextHierarchy: contextMap[component.id],
        actionHandlers,
        operationHandlers,
        beagleView,
      })
      const resolved = Expression.resolveForComponent(component, contextMap[component.id], operationHandlers)
      if (!disableCssTransformation) Styling.convert(resolved)

      return resolved
    })
  }

  function checkTypes(viewTree: IdentifiableBeagleUIElement) {
    if (executionMode !== 'development') return
    Tree.forEach(viewTree, component => (
      TypeChecker.check(component, typesMetadata[component.id], childrenMetadata[component.id])
    ))
  }

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

  function doTemplateRender(
    templateManager: TemplateManager,
    anchor: string,
    contexts: ImplicitDataContext[][],
    indexContextId = 'index',
    componentManager?: ComponentManager,
    mode: TreeInsertionMode = 'replace',
  ) {
    if (!Array.isArray(contexts)) return
    if (!templateManager.default && (!templateManager.templates || templateManager.templates.length === 0)) {
      return logger.error(`Beagle can't do the template rendering at the node ${anchor} because it couldn't find any template to use. Please provide at least one template to the templateManager parameter.`)
    }
    if (!anchor) return logger.error('Beagle can\'t do the template rendering because no anchor has been provided. Beagle needs to know where to place the new nodes within the current tree.')

    const uiTree = beagleView.getTree()
    const anchorElement = Tree.findById(uiTree, anchor)

    if (!anchorElement) return logger.error(`Beagle can't do the template rendering because it couldn't the node identified by the provided anchor: ${anchor}.`)

    const treeContextHierarchy = getTreeContextHierarchy(beagleView)
    const contextTemplates: IdentifiableBeagleUIElement[] = []
    const insertion = {
      prepend: (children: IdentifiableBeagleUIElement[]) => [...children?.reverse() || [], ...anchorElement.children || []],
      append: (children: IdentifiableBeagleUIElement[]) => [...anchorElement.children || [], ...children || []],
      replace: (children: IdentifiableBeagleUIElement[]) => children || [],
    }

    contexts.forEach((dependentContexts, index) => {
      const contextHierarchy = [...dependentContexts, ...treeContextHierarchy]
      const template = getEvaluatedTemplate(templateManager, contextHierarchy, operationHandlers)
      if (template) {
        let templateTree = Tree.clone(template)
        templateTree = {
          ...templateTree,
          ...((componentManager && componentManager(templateTree, index)) || {}),
          _implicitContexts_: [{ id: indexContextId, value: index, readonly: true }, ...dependentContexts],
        }
        contextTemplates.push(preProcess(templateTree))
      }
    })

    anchorElement.children = insertion[mode] ? insertion[mode](contextTemplates) : insertion.replace(contextTemplates)
    doFullRender(anchorElement, anchor)
  }

  return {
    doPartialRender,
    doFullRender,
    doTemplateRender,
  }
}

export default {
  create: createRenderer,
}
