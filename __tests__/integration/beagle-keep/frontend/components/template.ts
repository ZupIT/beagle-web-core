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

import { map, isEqual } from 'lodash'
import { DataContext, BeagleUIElement } from 'beagle-tree/types'
import { Component, TemplateProps } from './types'
import { TemplateManager,TemplateManagerItem } from 'beagle-view/render/template-manager/types'

const Template: Component<TemplateProps> = ({
  id,
  key,
  dataSource,
  viewContentManager,
}) => {
  function onChange() {
    const element = viewContentManager.getElement()
    const templatesRaw = element.templates
    const hasChanged = (element && Array.isArray(dataSource) && !isEqual(map(element.children, 'key'), map(dataSource, key)))

    if (!hasChanged) return

    const contexts: DataContext[][] = dataSource.map(item => [{ id: 'item', value: item }])
    const componentManager = (component: BeagleUIElement, index: number) => ({ ...component, id: `template:${id}:${component.id}:${index}` })
    const manager: TemplateManager = {
      default: templatesRaw.find((t: TemplateManagerItem) => !t.case)?.view,
      templates: templatesRaw.filter((t: TemplateManagerItem) => t.case) || []
    }

    viewContentManager.getView().getRenderer().doTemplateRender(manager, id, contexts, 'index', componentManager)
  }

  /* the setTimeout here is to simulate angular and react lifecycles, "onInit", for instance. This
  lets the current render finish and makes the next one an actual new render. */
  setTimeout(onChange, 10)
}

export default Template
