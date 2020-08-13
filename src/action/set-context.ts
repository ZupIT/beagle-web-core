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
import set from 'lodash/set'
import Context from 'beagle-view/render/context'
import { ActionHandler, SetContextAction } from './types'

const setContext: ActionHandler<SetContextAction> = ({ action, element, beagleView }) => {
  const { value, contextId, path } = action
  const { globalContext } = beagleView.getBeagleService()

  const uiTree = beagleView.getTree()
  const contextHierarchy = Context.evaluate(uiTree, [globalContext.getAsDataContext()])[element.id]
  const context = Context.find(contextHierarchy, contextId)

  if (context && context.id === 'global') {
    globalContext.set(value,  path)
    return
  }

  if (!context) {
    const specificContextMessage = (
      `Could not find context with id "${contextId}" for element of type "${element._beagleComponent_}" and id "${element.id}"`
    )
    const anyContextMessage = (
      `Could not find any context for element of type "${element._beagleComponent_}" and id "${element.id}"`
    )
    logger.warn(contextId ? specificContextMessage : anyContextMessage)
    return
  }

  if (!path) context.value = value
  else {
    context.value = context.value || {}
    set(context.value, path, value)
  }

  beagleView.getRenderer().doPartialRender(uiTree)
}

export default setContext
