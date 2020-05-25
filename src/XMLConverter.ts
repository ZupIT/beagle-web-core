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

import {
  BeagleConfig,
  BeagleUIElement,
  XmlOptions,
} from './types'

const formatXmlValue = (value: any): string => {
  if (typeof value === 'number') return `${value}`
  if (typeof value === 'string') {
    const formatedValue = value.replace(/'/g, "\\'")
    return `'${formatedValue}'`
  }
  if (typeof value !== 'object') return JSON.stringify(value)
  if (value instanceof Array) return `[${value.map(formatXmlValue)}]`
  const keys = Object.keys(value)
  const keyValuePairs = keys.map(key => `${key}:${formatXmlValue(value[key])}`)
  return `{${keyValuePairs.join(',')}}`
}

function createXMLConverter<Schema>(components: BeagleConfig<Schema>['components']) {
  const defaultXmlOptions: XmlOptions<Schema> = {
    formatTagName: name => name as string,
    shouldAddAttribute: () => true,
    formatAttributeName: name => name,
    formatAttributeValue: value => `"${formatXmlValue(value)}"`,
  }

  const convertBeagleUiTreeToXml = (
    uiTree: BeagleUIElement<Schema>,
    options?: Partial<XmlOptions<Schema>>,
  ): string => {
    const { _beagleComponent_, children, ...props } = uiTree

    if (!components[_beagleComponent_]) {
      console.error(
        `Error: server driven UI could not find component ${_beagleComponent_}. This component and its children won't be rendered.`
      )
      return ''
    }

    const opts = { ...defaultXmlOptions, ...options }
    const tagName = opts.formatTagName(_beagleComponent_)
    const id = props.id
    delete props.id

    const attrs: Array<string> = []
    Object.keys(props).forEach((name: string) => {
      if (opts.shouldAddAttribute(_beagleComponent_, name)){
        const formatedProp =
          `${opts.formatAttributeName(name)}=${opts.formatAttributeValue(props[name])}`
        attrs.push(formatedProp)
      }
    })

    const childrenXmlList = children
      ? children.map(child => convertBeagleUiTreeToXml(child, options))
      : []

    return `<${tagName} id=${id} ${attrs.join(' ')}>${childrenXmlList.join('')}</${tagName}>`
  }

  return {
    convertBeagleUiTreeToXml,
  }
}

export default createXMLConverter
