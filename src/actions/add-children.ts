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

import { findById } from '../utils/tree-reading'
import { ActionHandler, AddChildrenAction } from './types'

const addChildren: ActionHandler<AddChildrenAction> = ({ action, beagleView }) => {
  const { componentId, value, mode = 'append' } = action
  const uiTree = beagleView.getTree()
  const component = findById(uiTree, componentId)

  if (!component) {
    console.warn(`No component with id ${componentId} has been found in the tree`)
    return
  }

  const currentChildren = component.children || []
  if (mode === 'append') component.children = [...currentChildren, ...value]
  if (mode === 'prepend') component.children = [...value, ...currentChildren]
  if (mode === 'replace') component.children = value

  beagleView.getRenderer().doFullRender(component, component.id)
}

export default addChildren
