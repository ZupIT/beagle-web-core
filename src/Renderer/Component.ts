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

import { BeagleUIElement, ChildrenMetadata } from '../types'

const CHILDREN_PROPERTY_NAMES = ['child']
export const ID_PREFIX = '_beagle_'
let nextId = 1

/**
 * Guarantees that the children of the component will be called "children" and will be an array.
 * 
 * This function alters the parameter `component`.
 * 
 * @param component the component to have its children property formatted
 * @param childrenMetadata the children metadata of the component, it tells which property of the
 * component should act as its children
 */
function formatChildrenProperty(
  component: BeagleUIElement,
  childrenMetadata?: ChildrenMetadata,
) {
  const properties = childrenMetadata
    ? [childrenMetadata.property, ...CHILDREN_PROPERTY_NAMES]
    : CHILDREN_PROPERTY_NAMES

  properties.find((property) => {
    if (!component[property]) return false
    component.children = component[property]
    delete component[property]
    return true
  })

  if (component.children && !Array.isArray(component.children)) {
    component.children = [component.children]
  }
}

/**
 * Assigns an id to the component if it doesn't have an id yet. The id follows the format
 * `_beagle_%d`, where %d is in incremental integer, starting at 1.
 * 
 * This function alters the parameter `component`.
 * 
 * @param component the component to have its id assigned
 */
function assignId(component: BeagleUIElement) {
  component.id = component.id || `${ID_PREFIX}${nextId++}`
}

/**
 * Removes every property in `component` that has the value `null`. Ignores properties inside
 * `children`.
 * 
 * This function alters the parameter `component`.
 * 
 * @param component the component to have the null properties removed
 */
function eraseNullProperties(component: BeagleUIElement) {
  function eraseNulls(data: any) {
    if (!data || typeof data !== 'object') return

    if (Array.isArray(data)) {
      data.forEach(eraseNulls)
      return
    }

    const keys = Object.keys(data)
    keys.forEach((key) => {
      if (data[key] === null) delete data[key]
      else if (data !== component || key !== 'children') eraseNulls(data[key])
    })
  }

  eraseNulls(component)
}

export default {
  formatChildrenProperty,
  assignId,
  eraseNullProperties,
}
