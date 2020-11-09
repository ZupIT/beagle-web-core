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

import { findIndex } from 'lodash'

/**
  * Given an element of interface `Node` tracks recursively and
  * returns the xPath for that element
  * @param element the element for which to start the building of the xPath
  * @param accumulator the string that is incremented over each iteration, can be left out for the first call 
  * in case you do not need to add anything to the final xPath string
  */
function getPath(element: Node, accumulator?: string): any {
  if (!element || !element.parentNode) return
  if (!accumulator)
    accumulator = ''

  if (element.nodeName === 'BODY') {
    return 'BODY/' + accumulator
  }

  const siblings: ChildNode[] = Array.from(element.parentNode.childNodes)
  const elementIndex = findIndex(siblings, element)
  const currentNode = siblings[elementIndex]
  accumulator = `${currentNode.nodeName}${elementIndex > 0 ? `[${elementIndex}]` : ''}/${accumulator}`
  return currentNode.parentNode && getPath(currentNode.parentNode, accumulator)
}

/**
  * Returns the element of the given Beagle Id
  * @param elementId the beagle element id
  */
function getElement(elementId: string) {
  if (!document.querySelector) return
  return document.querySelector(`[data-beagle-id="${elementId}"]`)
}

/**
  * Returns the positions `{ x, y }` of the given Beagle element Id
  * @param elementId the beagle element id
  */
function getElementPosition(elementId: string) {
  const element = getElement(elementId)
  if (!element) return
  return {
    x: element.getBoundingClientRect().left,
    y: element.getBoundingClientRect().top,
  }
}

export { getPath, getElement, getElementPosition }
