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

import { map, isEqual } from 'lodash'
import Tree from 'beagle-tree'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { Component, RepeaterProps } from './types'


const Repeater: Component<RepeaterProps> = ({
  id,
  key,
  dataSource,
  template,
  viewContentManager,
  children,
}) => {
  function onChange() {
    const shouldIgnoreUpdate = (
      !Array.isArray(dataSource)
      || isEqual(map(children, 'key'), map(dataSource, key))
    )
    if (shouldIgnoreUpdate) return
    const element = viewContentManager.getElement()

    element.children = dataSource.map((item, index) => {
      const templateTree = Tree.clone(template)
      templateTree._implicitContexts_ = [
        { id: 'item', value: item },
        { id: 'index', value: index },
      ]
      templateTree.key = item[key]
      
      return templateTree as IdentifiableBeagleUIElement
    })

    viewContentManager.getView().getRenderer().doFullRender(element, id)
  }
  

  /* the setTimeout here is to simulate angular and react lifecycles, "onInit", for instance. This
  lets the current render finish and makes the next one an actual new render. */
  setTimeout(onChange, 10)
}

export default Repeater
