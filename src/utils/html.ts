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

import findIndex from 'lodash/findIndex'

/**
  * Calculates the xPath for the given HTML element
  * @param element the element for which to start the building of the xPath
  * @returns the xPath of the given element
  */
function getPath(element: Node): any {

  function getPathRecursively(element: Node, accumulator: string): string | undefined | null {
    if (!element.parentNode) return
    if (element.nodeName === 'BODY') {
      return 'BODY/' + accumulator
    }

    const siblings: ChildNode[] = Array.from(element.parentNode.childNodes)
    const elementIndex = findIndex(siblings, element)
    const currentNode = siblings[elementIndex]
    accumulator = `${currentNode.nodeName}${elementIndex > 0 ? `[${elementIndex}]` : ''}/${accumulator}`
    return currentNode.parentNode && getPathRecursively(currentNode.parentNode, accumulator)

  }

  return getPathRecursively(element, '')
}

/**
  * Get the element of the given Beagle Id,
  * if the environment is other than Web this function returns undefined
  * @param elementId the beagle element id
  * @returns the element of the given Id
  */
function getElementByBeagleId(elementId: string) {
  if (!document || !document.querySelector) return
  return document.querySelector(`[data-beagle-id="${elementId}"]`)
}

/**
  * Finds the position of the given `Element`
  * @param elementId the beagle element id
  * @returns Returns the position of the element `{ x, y }`
  */
function getElementPosition(element: Element) {
  if (!element) return
  return {
    x: element.getBoundingClientRect().left,
    y: element.getBoundingClientRect().top,
  }
}

const exportFunctions = {
  getPath,
  getElementByBeagleId,
  getElementPosition,
}

export default exportFunctions
