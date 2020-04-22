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

import { BeagleMiddleware, BeagleUIElement, Style } from '../types'
import { capitalizeFirstLetter } from '../utils/string'

const UNITY_TYPE: Record<string, string> = {
  'REAL': 'px',
  'PERCENT': '%',
}

const EDGE_SPECIAL_VALUES: Array<string> = [
  'all',
  'horizontal',
  'vertical',
]

const PROPERTIES_TO_RENAME: Record<string, string> = {
  'positionType': 'position',
  'textColor': 'color',
  'grow': 'flexGrow',
  'shrink': 'flexShrink',
  'basis': 'flexBasis',
}

const SINGLE_PROPERTIES: Array<string> = [
  'backgroundColor',
  'direction',
  'display',
]

const COLOR_PROPERTIES: Array<string> = [
  'backgroundColor',
  'textColor',
]

const toLowerCase = (value: string | number) => {
  if (typeof value === 'number') return value
  return value.toLowerCase()
}

const formatValueWithUnitType =
  (uiTree: BeagleUIElement<any>, styleAttributes?: Style) => {
    if (styleAttributes) {
      const keys = Object.keys(styleAttributes)
      keys && keys.forEach((key) => {
        const parsedUnitType = UNITY_TYPE[styleAttributes[key].type]
        //@ts-ignore
        uiTree.styleProperties[key] = `${styleAttributes[key].value}${parsedUnitType}`
      })
    }
    return uiTree
  }

const handleColors = (prop: string, value: string | number): string | number => {
  if (!COLOR_PROPERTIES.includes(prop)) return value
  const splittedValue = value.toString().split('#')
  return splittedValue && splittedValue.length > 1 ? value : `#${value}`
}

const formatSingleAttributes = (uiTree: BeagleUIElement<any>, styleAttributes?: Style) => {
  if (styleAttributes) {
    const keys = Object.keys(styleAttributes)
    const styleAtt = keys.filter((prop) => SINGLE_PROPERTIES.includes(prop))
    styleAtt.forEach((prop) => {
      const value = handleColors(prop, styleAttributes[prop])
      //@ts-ignore
      uiTree.styleProperties[prop] = value
    })
  }
  return uiTree
}

const handleEdgeValues =
  (key: string, parsedUnitType: string, styleAttributes: Style) => {
    const value = `${styleAttributes[key].value}${parsedUnitType}`
    const edgeValues: Record<string, string> = { vertical: `${value} 0`, horizontal: `0 ${value}` }
    return edgeValues[key] || value
  }

const formatEdgeAttributes =
  (uiTree: BeagleUIElement<any>, edgeType: string, styleAttributes?: Style) => {
    if (styleAttributes) {
      const keys = Object.keys(styleAttributes)
      keys && keys.forEach((key) => {
        const parsedType = UNITY_TYPE[styleAttributes[key].type]
        const position = EDGE_SPECIAL_VALUES.includes(key) ?
          edgeType : `${edgeType}${capitalizeFirstLetter(key)}`


        const value = handleEdgeValues(key, parsedType, styleAttributes)
        //@ts-ignore
        uiTree.styleProperties[position] = value
      })
    }
    return uiTree
  }

const formatFlexAttributes = (uiTree: BeagleUIElement<any>, styleAttributes?: Style) => {
  if (styleAttributes && styleAttributes.flex) {
    let flexKeys = Object.keys(styleAttributes.flex)
    flexKeys = flexKeys.filter((prop) => PROPERTIES_TO_RENAME[prop] === undefined)
    flexKeys && flexKeys.forEach((key) => {

      //Remove when pattern ok
      if (typeof styleAttributes.flex[key] === 'object')
        return

      let parsedValue = typeof styleAttributes.flex[key] === 'string' ?
        styleAttributes.flex[key].replace('_', '-') : styleAttributes.flex[key]

      parsedValue = toLowerCase(parsedValue)
      //@ts-ignore
      uiTree.styleProperties[key] = parsedValue
    })
  }
  return uiTree
}

const formatAttributesToRename = (uiTree: BeagleUIElement<any>, styleAttributes?: Style) => {
  if (styleAttributes) {
    const keys = Object.keys(styleAttributes)
    const styleAtt = keys.filter((prop) => PROPERTIES_TO_RENAME[prop] !== undefined)
    if (styleAtt && styleAtt.length) {
      styleAtt.forEach((prop) => {
        let value
        if (typeof styleAttributes[prop] === 'object') {
          const parsedType = UNITY_TYPE[styleAttributes[prop].type]
          value = `${styleAttributes[prop].value}${parsedType}`
        } else {
          value = toLowerCase(styleAttributes[prop])
        }

        value = handleColors(prop, value)
        //@ts-ignore
        return uiTree.styleProperties[PROPERTIES_TO_RENAME[prop]] = value
      })
    }
  }
  return uiTree
}

const beagleStyleMiddleware: BeagleMiddleware<any> = (uiTree: BeagleUIElement<any>) => {
  if (uiTree.children) uiTree.children.forEach(beagleStyleMiddleware)

  if (!uiTree.styleProperties) uiTree.styleProperties = {}

  // should be style instead of flex
  if (uiTree.flex) {

    // should be style instead of flex
    const styleObj = uiTree.flex

    uiTree = formatValueWithUnitType(uiTree, styleObj.size)
    uiTree = formatValueWithUnitType(uiTree, styleObj.position)

    uiTree = formatEdgeAttributes(uiTree, 'margin', styleObj.margin)
    uiTree = formatEdgeAttributes(uiTree, 'padding', styleObj.padding)

    uiTree = formatFlexAttributes(uiTree, uiTree)
    uiTree = formatAttributesToRename(uiTree, styleObj)
  }
  uiTree = formatSingleAttributes(uiTree, uiTree)
  uiTree = formatAttributesToRename(uiTree, uiTree)

  //@ts-ignore
  if (!Object.keys(uiTree.styleProperties).length) delete uiTree.styleProperties

  return uiTree
}

export default beagleStyleMiddleware
