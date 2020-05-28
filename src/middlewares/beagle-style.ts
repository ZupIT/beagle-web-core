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

import isObject from 'lodash/isObject'
import isEmpty from 'lodash/isEmpty'
import { BeagleMiddleware, BeagleUIElement, Style } from '../types'
import { capitalizeFirstLetter } from '../utils/string'

interface HeightDataFormat {
  value: number,
  type: string,
}

interface EdgeDataFormat {
  value: number | string,
  type: string,
}

const UNITY_TYPE: Record<string, string> = {
  'REAL': 'px',
  'PERCENT': '%',
  'AUTO': 'auto',
}

const SINGLE_ATTRIBUTES: Record<string, string> = {
  'positionType': 'position',
  'backgroundColor': 'backgroundColor',
  'direction': 'direction',
  'display': 'display',
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

const SPECIAL_VALUES: Record<string, string> = {
  'NO_WRAP': 'nowrap',
}

const verifyContext = (value: string | number) => {
  if (value && typeof value === 'string') {
    const isContext = value.match(/^\${[a-z0-9A-Z_]*}$/)
    return isContext
  }
  else return false
}

const handleContext = (item: string | number | EdgeDataFormat, key: string,
  uiTree: BeagleUIElement<any>, outsideObjectKey?: string) => {
  let stringValue: string
  let stringType = ''
  let isItemObject = false
  if (isObject(item)) {
    isItemObject = true
    if (item && item.value && typeof item.value === 'number')
      stringValue = item.value.toString()
    else {
      // @ts-ignore
      stringValue = item.value || ''
    }

    if (item && item.type)
      stringType = item.type.toString()

  } else {
    // @ts-ignore
    stringValue = item && typeof item === 'number' ? item.toString() : item || ''
  }

  if (verifyContext(stringValue)) {
    if (outsideObjectKey) {
      if (!isObject(uiTree.parsedStyle[outsideObjectKey]))
        uiTree.parsedStyle[outsideObjectKey] = {}
      if (isItemObject) {
        uiTree.parsedStyle[outsideObjectKey][key] = {
          'value': stringValue,
          // @ts-ignore
          'type': item.type,
        }
      } else {
        uiTree.parsedStyle[outsideObjectKey][key] = stringValue
      }
    } else {
      if (isItemObject) {
        uiTree.parsedStyle[key] = {
          'value': stringValue,
          // @ts-ignore
          'type': item.type,
        }
      } else {
        uiTree.parsedStyle[key] = stringValue
      }
    }
    return true
  } else if (verifyContext(stringType)) {
    if (outsideObjectKey) {
      if (!isObject(uiTree.parsedStyle[outsideObjectKey]))
        uiTree.parsedStyle[outsideObjectKey] = {}
      uiTree.parsedStyle[outsideObjectKey][key] = {
        // @ts-ignore
        'value': item.value,
        'type': stringType,
      }
    } else {
      uiTree.parsedStyle[key] = {
        // @ts-ignore
        'value': item.value,
        'type': stringType,
      }

    }
    return true
  }
  return false
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

const parseValuesWithUnit = (unitType: string, value: number) => {
  const parsedUnitType = getWebType(unitType)
  if (value === undefined || value === null)
    return ''
  return handleAutoAsValue(value.toString(), parsedUnitType)
}

const handleAspectRatio = (valueAspectRatio: number | null, heightData: HeightDataFormat,
  uiTree: BeagleUIElement<any>) => {
  if (valueAspectRatio && heightData && heightData.value) {
    const value = heightData.value * valueAspectRatio
    const valueWithType = parseValuesWithUnit(heightData.type, value)
    uiTree.parsedStyle['width'] = valueWithType
  }
  return uiTree
}

const formatSizeProperty =
  (uiTree: BeagleUIElement<any>, styleAttributes?: Style) => {
    if (styleAttributes) {
      if (typeof styleAttributes === 'object') {
        const keys = Object.keys(styleAttributes)
        let heightData = {} as HeightDataFormat
        let valueAspectRatio = null
        keys.forEach((key) => {
          if (handleContext(styleAttributes[key], key, uiTree, 'size')) return
          if (key !== 'aspectRatio') {
            const valueWithType = parseValuesWithUnit(styleAttributes[key].type, styleAttributes[key].value)
            uiTree.parsedStyle[key] = valueWithType

            if (key === 'height') {
              heightData = styleAttributes[key]
            }
          } else {
            valueAspectRatio = styleAttributes[key]
          }
        })
        uiTree = handleAspectRatio(valueAspectRatio, heightData, uiTree)
      } else {
        handleContext(styleAttributes, 'size', uiTree)
      }
    }
    return uiTree
  }

const handleSpecialPosition = (key: string,
  uiTree: BeagleUIElement, value: string) => {
  const parsedNames = EDGE_SPECIAL_VALUES[key]

  parsedNames.forEach((name) => uiTree.parsedStyle[name] = value)
  return uiTree
}

const formatPositionProperty =
  (uiTree: BeagleUIElement<any>, styleAttributes?: Style) => {
    if (styleAttributes) {
      if (typeof styleAttributes === 'object') {
        const keys = Object.keys(styleAttributes)
        keys.forEach((key) => {
          if (handleContext(styleAttributes[key], key, uiTree, 'position')) return
          const valueWithType = parseValuesWithUnit(styleAttributes[key].type, styleAttributes[key].value)
          if (Object.keys(EDGE_SPECIAL_VALUES).includes(key)) {
            uiTree = handleSpecialPosition(key, uiTree, valueWithType)
          } else {
            uiTree.parsedStyle[key] = valueWithType
          }
        })
      } else {
        handleContext(styleAttributes, 'position', uiTree)
      }
    }
    return uiTree
  }

const renameFlexAttributes = (key: string) => FLEX_PROPERTIES_TO_RENAME[key] || key

const formatFlexAttributes = (uiTree: BeagleUIElement<any>, styleAttributes?: Style) => {
  if (styleAttributes) {
    if (typeof styleAttributes === 'object') {
      const flexKeys = Object.keys(styleAttributes)
      flexKeys.forEach((key) => {
        if (handleContext(styleAttributes[key], key, uiTree, 'flex')) return
        const atributeName = renameFlexAttributes(key)
        let parsedValue
        if (isObject(styleAttributes[key])) {
          parsedValue = parseValuesWithUnit(styleAttributes[key].type, styleAttributes[key].value)
        }
        else {
          const hasSpecialValues = SPECIAL_VALUES[styleAttributes[key]]
          parsedValue = hasSpecialValues ?
            hasSpecialValues : replace(styleAttributes[key], '_', '-')
          parsedValue = toLowerCase(parsedValue)
        }
        uiTree.parsedStyle[atributeName] = parsedValue
      })
    } else {
      handleContext(styleAttributes, 'flex', uiTree)
    }
  }
  return uiTree
}

const handleSpecialEdge = (key: string,
  uiTree: BeagleUIElement, value: string, prefixName: string) => {
  if (key === 'all') {
    uiTree.parsedStyle[prefixName] = value
  } else {
    const parsedNames = EDGE_SPECIAL_VALUES[key]
    parsedNames.forEach((name) => {
      const cssName = `${prefixName}${capitalizeFirstLetter(name)}`
      uiTree.parsedStyle[cssName] = value
    })
  }
  return uiTree
}

const formatEdgeAttributes =
  (uiTree: BeagleUIElement<any>, edgeType: string, styleAttributes?: Style) => {
    if (styleAttributes) {
      if (typeof styleAttributes === 'object') {
        const keys = Object.keys(styleAttributes)
        keys.forEach((key) => {
          if (handleContext(styleAttributes[key], key, uiTree, edgeType)) return
          const valueWithType = parseValuesWithUnit(styleAttributes[key].type, styleAttributes[key].value)
          if (Object.keys(EDGE_SPECIAL_VALUES).includes(key)) {
            uiTree = handleSpecialEdge(key, uiTree, valueWithType, edgeType)
          } else {
            const edgePosition = `${edgeType}${capitalizeFirstLetter(key)}`
            uiTree.parsedStyle[edgePosition] = valueWithType
          }
        })
      } else {
        handleContext(styleAttributes, edgeType, uiTree)
      }
    }
    return uiTree
  }

const singleAttributes = (uiTree: BeagleUIElement<any>, styleAttributes?: Style) => {
  if (styleAttributes) {
    const keys = Object.keys(styleAttributes)
    const styleAtt = keys.filter((prop) => Object.keys(SINGLE_ATTRIBUTES).includes(prop))
    styleAtt.forEach((prop) => {
      if (handleContext(styleAttributes[prop], prop, uiTree)) return
      const propName = SINGLE_ATTRIBUTES[prop]
      //@ts-ignore
      uiTree.style[propName] = toLowerCase(styleAttributes[prop])
      if (propName != prop) {
        //@ts-ignore
        delete uiTree.style[prop]
      }
    })
  }
  return uiTree
}

const beagleStyleMiddleware: BeagleMiddleware<any> = (uiTree: BeagleUIElement<any>) => {
  if (uiTree.children) uiTree.children.forEach(beagleStyleMiddleware)

  if (!uiTree.parsedStyle) uiTree.parsedStyle = {}

  if (uiTree.style && typeof uiTree.style === 'object') {
    const styleObj = uiTree.style

    uiTree = formatSizeProperty(uiTree, styleObj.size)
    uiTree = formatPositionProperty(uiTree, styleObj.position)
    uiTree = formatFlexAttributes(uiTree, styleObj.flex)
    uiTree = formatEdgeAttributes(uiTree, 'margin', styleObj.margin)
    uiTree = formatEdgeAttributes(uiTree, 'padding', styleObj.padding)
    if (!isEmpty(uiTree.parsedStyle))
      uiTree.style = uiTree.parsedStyle
    uiTree = singleAttributes(uiTree, styleObj)
  }
  delete uiTree.parsedStyle
  return uiTree
}

export default beagleStyleMiddleware
