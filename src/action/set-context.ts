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

import logger from 'logger'
import set from 'lodash/set'
import Context from 'beagle-view/render/context'
import { ImplicitDataContext } from 'beagle-tree/types'
import { ActionHandler, SetContextAction } from './types'

const setContext: ActionHandler<SetContextAction> = ({ action, element, beagleView }) => {
  const { value, contextId, path } = action
  const { globalContext } = beagleView.getBeagleService()
  const localContexts = beagleView.getLocalContexts().getAllAsDataContext()

  const uiTree = beagleView.getTree()
  const extraContexts = [globalContext.getAsDataContext(), ...localContexts]
  const contextHierarchy = Context.evaluate(uiTree, extraContexts, true)[element.id]

  if (!contextHierarchy) {
    return logger.warn(
      `The component of type "${element._beagleComponent_}" and id "${element.id}" is detached from the current tree and attempted to change the value of the context "${contextId}".`,
      'This behavior is not supported, please, hide the component instead of removing it if you still need it to perform an action in the tree.',
    )
  }

  const context = Context.find(contextHierarchy, contextId)
  if (context && context.id === 'global') {
    globalContext.set(value, path)
    return
  }
  if (contextId === 'navigationContext' || localContexts.some(lc => lc.id === contextId)) {
    beagleView.getLocalContexts().setContext(contextId!, value, path)
    return
  }

  if (!context) {
    const specificContextMessage = (`Could not find context with id "${contextId}" for element of type "${element._beagleComponent_}" and id "${element.id}"`)
    const anyContextMessage = (`Could not find any context for element of type "${element._beagleComponent_}" and id "${element.id}"`)
    logger.warn(contextId ? specificContextMessage : anyContextMessage)
    return
  }

  const implicitContext = context as ImplicitDataContext
  if (implicitContext.readonly) {
    logger.warn(`Could not set the implicit context with id "${contextId}", because it is readonly.`)
    return
  }

  if (!path) context.value = value
  else {
    context.value = context.value || {}
    set(context, `value.${path}`, value)
  }

  beagleView.getRenderer().doPartialRender(uiTree)

  if (implicitContext.onChange) implicitContext.onChange(context.value)
}

export default setContext
