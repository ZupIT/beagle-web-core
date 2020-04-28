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

import { getContextHierarchy, getContextInHierarchy } from './context'
import { DataContext } from './types'

const bindingRegex = /(\\*)\$\{([^\}]+)\}/g
const fullBindingRegex = /^\$\{([^\}]+)\}$/

function getBindingValue(
  path: string,
  contextHierarchy: DataContext[],
) {
  if (!path.match(/^[\w\d_]+(\[\d+\])?(\.([\w\d_]+(\[\d+\])?))*$/))
    console.warn(
      `Invalid path "${path}". Please, make sure your variable names contain only letters, numbers and the symbol "_". To access substructures use "." and to access array indexes use "[index]".`
    )

  const pathMatch = path.match(/^([^\.]+)\.?(.*)/)
  if (!pathMatch || pathMatch.length < 1) return
  const contextId = pathMatch[1]
  const contextPath = pathMatch[2]
  const context = getContextInHierarchy(contextHierarchy, contextId)
  if (!context) return
  
  return contextPath ? _.get(context.value, contextPath) : context.value
}

function replaceBindingsInString(str: string, contextHierarchy: DataContext[]) {
  const fullMatch = str.match(fullBindingRegex)
  if (fullMatch) {
    const bindingValue = getBindingValue(fullMatch[1], contextHierarchy)
    return bindingValue === undefined ? str : bindingValue
  }

  return str.replace(bindingRegex, (bindingStr, slashes, path) => {
    const isBindingScaped = slashes.length % 2 === 1
    const scapedSlashes = slashes.replace(/\\\\/g, '\\')
    if (isBindingScaped) return `${scapedSlashes.replace(/\\$/, '')}\${${path}}`
    const bindingValue = getBindingValue(path, contextHierarchy)
    const asString = typeof bindingValue === 'object' ? JSON.stringify(bindingValue) : bindingValue
    return bindingValue === undefined ? bindingStr : `${scapedSlashes}${asString}`
  })
}

export function replaceBindings(
  data: any,
  contextHierarchy: DataContext[] = [],
): any {
  if (typeof data === 'string') return replaceBindingsInString(data, contextHierarchy)

  if (data instanceof Array) return data.map(item => replaceBindings(item, contextHierarchy))

  if (typeof data === 'object') {
    const hierarchy = getContextHierarchy(data, contextHierarchy)
    const ignore = ['id', '_beagleType_', '_context_']

    return Object.keys(data).reduce((result, key) => ({
      ...result,
      [key]: ignore.includes(key) ? data[key] : replaceBindings(data[key], hierarchy),
    }), {})
  }

  return data
}
