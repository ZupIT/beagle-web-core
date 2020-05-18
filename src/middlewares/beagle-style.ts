/*
  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
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
import isObject from 'lodash/isObject'

const UNITY_TYPE: Record<string, string> = {
  'REAL': 'px',
  'PERCENT': '%',
  'AUTO': 'auto',
}

const EDGE_SPECIAL_VALUES: Record<string, string[]> = {
  'all': ['right', 'left', 'top', 'bottom'],
  'horizontal': ['right', 'left'],
  'vertical': ['top', 'bottom'],
  'start': ['left'],
  'end': ['right'],
}

const FLEX_PROPERTIES_TO_RENAME: Record<string, string> = {
  'grow': 'flexGrow',
  'shrink': 'flexShrink',
  'basis': 'flexBasis',
}

const toLowerCase = (value: string | number) => {
  if (typeof value === 'number') return value
  return value.toLowerCase()
}

const replace = (text: string | number, value: string, targetValue: string) => {
  if (typeof text === 'number') return text
  return text.replace(value, targetValue)
}

const handleAutoAsValue = (value: string, parsedUnitType: string) => {
  let valueWithType = ''
  if (parsedUnitType === UNITY_TYPE.AUTO) {
    valueWithType = UNITY_TYPE.AUTO
  } else {
    valueWithType = `${value}${parsedUnitType}`
  }
  return valueWithType
}

const getWebType = (type: string) => UNITY_TYPE[type]

const parseValuesWithUnit = (unitType: string, value: string) => {
  const parsedUnitType = getWebType(unitType)
  return handleAutoAsValue(value, parsedUnitType)
}

const formatSizeProperty =
  (uiTree: BeagleUIElement<any>, styleAttributes?: Style) => {
    if (styleAttributes) {
      const keys = Object.keys(styleAttributes)
      keys.forEach((key) => {
        const valueWithType = parseValuesWithUnit(styleAttributes[key].type, styleAttributes[key].value)
        uiTree.parsedStyle[key] = valueWithType
      })
    }
    return uiTree
  }

const handleSpecialPosition = (key: string,
  uiTree: BeagleUIElement, value: string) => {
  const parsedNames = EDGE_SPECIAL_VALUES[key]

  parsedNames.map((name) => uiTree.parsedStyle[name] = value)
  return uiTree
}

const formatPositionProperty =
  (uiTree: BeagleUIElement<any>, styleAttributes?: Style) => {
    if (styleAttributes) {
      const keys = Object.keys(styleAttributes)
      keys.forEach((key) => {
        const valueWithType = parseValuesWithUnit(styleAttributes[key].type, styleAttributes[key].value)
        if (Object.keys(EDGE_SPECIAL_VALUES).includes(key)) {
          uiTree = handleSpecialPosition(key, uiTree, valueWithType)
        } else {
          uiTree.parsedStyle[key] = valueWithType
        }
      })
    }
    return uiTree
  }

const renameFlexAttributes = (key: string) => FLEX_PROPERTIES_TO_RENAME[key] || key

const formatFlexAttributes = (uiTree: BeagleUIElement<any>, styleAttributes?: Style) => {
  if (styleAttributes) {
    const flexKeys = Object.keys(styleAttributes)
    flexKeys.forEach((key) => {
      const atributeName = renameFlexAttributes(key)
      let parsedValue
      if (isObject(styleAttributes[key])) {
        parsedValue = parseValuesWithUnit(styleAttributes[key].type, styleAttributes[key].value)
      }
      else {
        parsedValue = replace(styleAttributes[key], '_', '-')
        parsedValue = toLowerCase(parsedValue)
      }
      uiTree.parsedStyle[atributeName] = parsedValue
    })
  }
  return uiTree
}

const beagleStyleMiddleware: BeagleMiddleware<any> = (uiTree: BeagleUIElement<any>) => {
  if (uiTree.children) uiTree.children.forEach(beagleStyleMiddleware)

  if (!uiTree.parsedStyle) uiTree.parsedStyle = {}

  if (uiTree.style) {
    const styleObj = uiTree.style

    uiTree = formatSizeProperty(uiTree, styleObj.size)
    uiTree = formatPositionProperty(uiTree, styleObj.position)
    uiTree = formatFlexAttributes(uiTree, styleObj.flex)
    uiTree.style = uiTree.parsedStyle
  }
  delete uiTree.parsedStyle

  return uiTree
}

export default beagleStyleMiddleware
