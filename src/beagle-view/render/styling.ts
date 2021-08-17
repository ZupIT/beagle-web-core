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

import StringUtils from 'utils/string'
import { BeagleUIElement } from 'beagle-tree/types'

type CSS = Record<string, any>

interface BeagleStyle {
  size?: Record<string, any>,
  position?: Record<string, any> | string,
  flex?: Record<string, any> | string,
  cornerRadius?: CornerRadiusDataFormat,
  margin?: Record<string, any> | string,
  padding?: Record<string, any> | string,
  positionType?: string,
  display?: string,
  backgroundColor?: string,
  borderWidth?: number,
  borderColor?: string,
}

interface CornerRadiusDataFormat {
  radius?: number,
  topLeft?: number,
  topRight?: number,
  bottomLeft?: number,
  bottomRight?: number,
  [key: string]: any,
}

interface HeightDataFormat {
  value: number,
  type: string,
}

interface EdgeDataFormat {
  value: number | string,
  type: string,
}

const BEAGLE_STYLE_KEYS = [
  'size',
  'position',
  'flex',
  'cornerRadius',
  'margin',
  'padding',
  'positionType',
  'display',
  'backgroundColor',
  'borderWidth',
  'borderColor',
]

const UNITY_TYPE: Record<string, string> = {
  'REAL': 'px',
  'PERCENT': '%',
  'AUTO': 'auto',
}

const SINGLE_ATTRIBUTES: Record<string, string> = {
  'positionType': 'position',
  'backgroundColor': 'backgroundColor',
  'display': 'display',
  'borderColor': 'borderColor',
}

const EDGE_SPECIAL_VALUES: Record<string, string[]> = {
  'all': ['right', 'left', 'top', 'bottom'],
  'horizontal': ['right', 'left'],
  'vertical': ['top', 'bottom'],
}

const FLEX_PROPERTIES_TO_RENAME: Record<string, string> = {
  'grow': 'flexGrow',
  'shrink': 'flexShrink',
  'basis': 'flexBasis',
}

const SPECIAL_VALUES: Record<string, string> = {
  'NO_WRAP': 'nowrap',
}

const EDGE_ORDER: Record<string, boolean> = {
  'all': false,
  'vertical': false,
  'horizontal': false,
  'top': false,
  'right': false,
  'left': false,
  'bottom': false,
}

const POSITION_ORDER: Record<string, boolean> = {
  'all': false,
  'top': false,
  'right': false,
  'left': false,
  'bottom': false,
  'vertical': false,
  'horizontal': false,
}

function handleAutoAsValue(value: string, parsedUnitType: string) {
  return parsedUnitType === UNITY_TYPE.AUTO ? UNITY_TYPE.AUTO : `${value}${parsedUnitType}`
}

function toLowerCase(value: any) {
  return typeof value === 'string' ? value.toLowerCase() : value
}

function replace(text: any, value: string, targetValue: string) {
  return typeof text === 'string' ? text.replace(value, targetValue) : text
}

function parseValuesWithUnit(unitType: string, value: number) {
  const parsedUnitType = UNITY_TYPE[unitType]
  if (value === undefined || value === null)
    return ''
  return handleAutoAsValue(value.toString(), parsedUnitType)
}

function handleAspectRatio(
  valueAspectRatio: number | null,
  heightData: HeightDataFormat,
): CSS {
  if (valueAspectRatio && heightData && heightData.value) {
    const value = heightData.value * valueAspectRatio
    const valueWithType = parseValuesWithUnit(heightData.type, value)
    return { width: valueWithType }
  }

  return {}
}

function formatSizeProperty(size: BeagleStyle['size']) {
  const css: CSS = {}
  if (!size || typeof size !== 'object') return css

  const keys = Object.keys(size)
  let heightData = {} as HeightDataFormat
  let valueAspectRatio = null

  keys.forEach((key) => {
    if (typeof size[key] === 'string') return
    if (key !== 'aspectRatio') {
      css[key] = parseValuesWithUnit(size[key].type, size[key].value)
      if (key === 'height') {
        heightData = size[key]
      }
    } else {
      valueAspectRatio = size[key]
    }
  })

  return { ...css, ...handleAspectRatio(valueAspectRatio, heightData) }
}

function handleSpecialPosition(key: string, value: string) {
  const parsedNames = EDGE_SPECIAL_VALUES[key]
  return parsedNames.reduce((css, name) => ({ ...css, [name]: value }), {})
}

function orderKeys(keys: string[], orderRule: Record<string, boolean>) {
  const objectWithOrderRule = { ...orderRule }
  keys.forEach((key) => objectWithOrderRule[key] = true)
  return Object.keys(objectWithOrderRule).filter((key) => objectWithOrderRule[key])
}

function formatPositionProperty(position: BeagleStyle['position']) {
  let css: CSS = {}
  if (!position) return css
  if (typeof position !== 'object') return { position }

  let keys = Object.keys(position)
  keys = orderKeys(keys, POSITION_ORDER)
  keys.forEach((key) => {
    if (typeof position[key] !== 'object') return
    const valueWithType = parseValuesWithUnit(position[key].type, position[key].value)
    if (Object.keys(EDGE_SPECIAL_VALUES).includes(key)) {
      css = { ...css, ...handleSpecialPosition(key, valueWithType) }
    } else {
      css[key] = valueWithType
    }
  })

  return css
}

function formatFlexAttributes(flex: BeagleStyle['flex']) {
  const css: CSS = {}
  if (!flex) return css
  if (typeof flex !== 'object') return { flex }

  const keys = Object.keys(flex)
  keys.forEach((key) => {
    const attributeName = FLEX_PROPERTIES_TO_RENAME[key] || key
    let parsedValue
    if (flex[key] && typeof flex[key] === 'object') {
      parsedValue = parseValuesWithUnit(flex[key].type, flex[key].value)
    }
    else {
      const hasSpecialValues = SPECIAL_VALUES[flex[key]]
      parsedValue = hasSpecialValues ? hasSpecialValues : replace(flex[key], '_', '-')
      parsedValue = toLowerCase(parsedValue)
    }
    css[attributeName] = parsedValue
  })

  return css
}

function formatCornerRadiusAttributes(cornerRadius: BeagleStyle['cornerRadius']): CSS {
  if (!cornerRadius) return {}

  const cornerRadiusProps: string[] = ['radius', 'topRight', 'topLeft', 'bottomLeft', 'bottomRight']
  let cornerRadiusFormatted: CornerRadiusDataFormat = {}
  cornerRadiusProps.forEach((prop, index) => {
    cornerRadiusFormatted = {
      ...cornerRadiusFormatted,
      ...(Number.isFinite(cornerRadius[prop])
        ? {
          [index === 0 ? 'borderRadius' : `border${prop.charAt(0).toUpperCase() + prop.slice(1)}Radius`]: `${cornerRadius[prop] * 2}px`,
        }
        : {}),
    }
  })
  return cornerRadiusFormatted
}

function handleSpecialEdge(
  key: string,
  value: string,
  prefixName: string,
): CSS {
  if (key === 'all') return { [prefixName]: value }

  const parsedNames = EDGE_SPECIAL_VALUES[key]
  return parsedNames.reduce((css, name) => {
    const cssName = `${prefixName}${StringUtils.capitalizeFirstLetter(name)}`
    return { ...css, [cssName]: value }
  }, {})
}

function formatBorderStyle(style: BeagleStyle) {
  if (style.borderColor || style.borderWidth && !style.hasOwnProperty('borderStyle'))
    return { borderStyle: 'solid' }
}

function formatBorderWidthAttributes(style: BeagleStyle['borderWidth']) {
  if (style)
    return { borderWidth: `${style}px` }
}

function formatEdgeAttributes(style: BeagleStyle, edgeType: 'margin' | 'padding') {
  let css: CSS = {}
  const edge = style[edgeType]
  if (!edge) return css
  if (typeof edge !== 'object') return { [edgeType]: edge }

  let keys = Object.keys(edge)
  keys = orderKeys(keys, EDGE_ORDER)
  keys.forEach((key) => {
    if (!edge[key] || typeof edge[key] !== 'object') return
    const valueWithType = parseValuesWithUnit(edge[key].type, edge[key].value)
    if (Object.keys(EDGE_SPECIAL_VALUES).includes(key)) {
      css = { ...css, ...handleSpecialEdge(key, valueWithType, edgeType) }
    } else {
      const edgePosition = `${edgeType}${StringUtils.capitalizeFirstLetter(key)}`
      css[edgePosition] = valueWithType
    }
  })

  return css
}

function formatSingleAttributes(beagleStyle: BeagleStyle) {
  const keys = Object.keys(beagleStyle) as (keyof BeagleStyle)[]
  const singleAttributes = Object.keys(SINGLE_ATTRIBUTES)

  return keys.reduce((result, prop) => {
    if (!singleAttributes.includes(prop)) return result
    const propName = SINGLE_ATTRIBUTES[prop]
    return { ...result, [propName]: toLowerCase(beagleStyle[prop]) }
  }, {})
}

function formatNonBeagleProperties(beagleStyle: BeagleStyle) {
  const keys = Object.keys(beagleStyle) as (keyof BeagleStyle)[]
  return keys.reduce((result, key) => (
    BEAGLE_STYLE_KEYS.includes(key) ? result : { ...result, [key]: beagleStyle[key] }
  ), {})
}

function convertToCSS(style: BeagleStyle) {
  if (style.hasOwnProperty('position') && !style.hasOwnProperty('positionType')) {
    style.positionType = 'relative'
  }

  let css = formatSizeProperty(style.size)
  css = { ...css, ...formatBorderWidthAttributes(style.borderWidth) }
  css = { ...css, ...formatBorderStyle(style) }
  css = { ...css, ...formatPositionProperty(style.position) }
  css = { ...css, ...formatFlexAttributes(style.flex) }
  css = { ...css, ...formatCornerRadiusAttributes(style.cornerRadius) }
  css = { ...css, ...formatEdgeAttributes(style, 'margin') }
  css = { ...css, ...formatEdgeAttributes(style, 'padding') }
  css = { ...css, ...formatSingleAttributes(style) }
  css = { ...css, ...formatNonBeagleProperties(style) }
  return css
}

function convertStyleIdToClass(styleId: string) {
  return styleId.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\./g, '-').toLowerCase()
}

function convert(component: BeagleUIElement) {
  if (component.style && typeof component.style === 'object') {
    component.style = convertToCSS(component.style)
  }

  if (component.styleId) {
    component.styleId = convertStyleIdToClass(component.styleId)
  }
}

export default {
  convert,
}
