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

import { IdentifiableBeagleUIElement, BeagleUIElement } from 'beagle-tree/types'
import { TemplateManagerItem } from 'beagle-view/render/template-manager/types'
import { ViewContentManager } from 'service/view-content-manager/types'

export type Component<T> = (props: T & { viewContentManager: ViewContentManager }) => any

export interface RepeaterProps extends IdentifiableBeagleUIElement {
  key: string,
  dataSource: any[],
  template: BeagleUIElement,
}

export interface TemplateProps extends IdentifiableBeagleUIElement {
  key: string,
  dataSource: any[],
  templates: TemplateManagerItem[],
}

export interface ContainerProps extends IdentifiableBeagleUIElement {
  onInit: () => void,
}
