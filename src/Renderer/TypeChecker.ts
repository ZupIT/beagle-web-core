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

import { BeagleUIElement, ComponentTypeMetadata, ChildrenMetadata } from '../types'

/**
 * Checks if the component (1st parameter) matches the type definition declared in `typeMetadata`
 * (2nd parameter) and if its children match the restrictions provided by `childrenMetadata` (3rd)
 * parameter.
 * 
 * If the component doesn't match the metadata, an error is thrown with a message that helps
 * identifying the underlying problem.
 * 
 * @param component the component to check the types and children
 * @param typeMetadata the type metadata of the component
 * @param childrenMetadata the children metadata of the component
 */
function check(
  // eslint-disable-next-line
  component: BeagleUIElement,
  // eslint-disable-next-line
  typeMetadata: ComponentTypeMetadata,
  // eslint-disable-next-line
  childrenMetadata?: ChildrenMetadata,
) {
  // todo
}

export default {
  check,
}
