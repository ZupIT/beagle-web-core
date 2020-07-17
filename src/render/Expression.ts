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

import get from 'lodash/get'
import { BeagleAction } from '../actions/types'
import { DataContext, BeagleUIElement } from '../types'
import Context from './Context'

const expressionRegex = /(\\*)@\{([^\}]+)\}/g
const fullExpressionRegex = /^@\{([^\}]+)\}$/
const IGNORE_COMPONENT_KEYS = ['id', 'context', 'children', '_beagleComponent_']

function getExpressionValue(
  path: string,
  contextHierarchy: DataContext[],
) {
  if (!path.match(/^[\w\d_]+(\[\d+\])*(\.([\w\d_]+(\[\d+\])*))*$/))
    console.warn(
      `Invalid path "${path}". Please, make sure your variable names contain only letters, numbers and the symbol "_". To access substructures use "." and to access array indexes use "[index]".`
    )

  const pathMatch = path.match(/^([^\.\[\]]+)\.?(.*)/)
  if (!pathMatch || pathMatch.length < 1) return
  const contextId = pathMatch[1]
  const contextPath = pathMatch[2]
  const context = Context.find(contextHierarchy, contextId)
  if (!context) return
  
  return contextPath ? get(context.value, contextPath) : context.value
}

function resolveExpressionsInString(str: string, contextHierarchy: DataContext[]) {
  const fullMatch = str.match(fullExpressionRegex)
  if (fullMatch) {
    const bindingValue = getExpressionValue(fullMatch[1], contextHierarchy)
    return bindingValue === undefined ? str : bindingValue
  }

  return str.replace(expressionRegex, (bindingStr, slashes, path) => {
    const isBindingScaped = slashes.length % 2 === 1
    const scapedSlashes = slashes.replace(/\\\\/g, '\\')
    if (isBindingScaped) return `${scapedSlashes.replace(/\\$/, '')}@{${path}}`
    const bindingValue = getExpressionValue(path, contextHierarchy)
    const asString = typeof bindingValue === 'object' ? JSON.stringify(bindingValue) : bindingValue
    return bindingValue === undefined ? bindingStr : `${scapedSlashes}${asString}`
  })
}

/**
 * Replaces every reference to an expression in `data` (parameter) by its value in the
 * `contextHierarchy` (parameter). An expression is every non scaped string in the format
 * `@{expression}`. The context hierarchy is a stack of contexts where the top position has the top
 * priority, i.e. will be the first to be matched against the expression.
 * 
 * If an expression has no match, it will be kept unchanged.
 * 
 * If the third parameter (`shouldIgnore`) is passed, before evaluating a property of an object,
 * this function will be called with the value and key of the property. If
 * `shouldIgnore(value, key)` returns true, the entire property will be skipped and its expressions
 * won't be evaluated.
 * 
 * This function doesn't alter its parameters, instead, the data with the expressions replaced will
 * be its return value.
 * 
 * @param data the data with the expressions to be replaced.
 * @param contextHierarchy the data source to search for the values of the expressions.
 * @param shouldIgnore optional. Function to verify if a property of an object should be ignored
 * @returns data with all its expressions replaced by their corresponding values.
 */
export function resolve<T extends any>(
  data: T,
  contextHierarchy: DataContext[],
  shouldIgnore?: (value: any, key: string) => boolean,
): T {
  if (typeof data === 'string') return resolveExpressionsInString(data, contextHierarchy)

  if (Array.isArray(data)) {
    return data.map(item => resolve(item, contextHierarchy, shouldIgnore)) as T
  }

  if (typeof data === 'object') {
    const map = data as Record<string, any>
    return Object.keys(map).reduce((result, key) => {
      const value = map[key]
      return (shouldIgnore && shouldIgnore(value, key))
        ? { ...result, [key]: value }
        : { ...result, [key]: resolve(value, contextHierarchy, shouldIgnore) }
    }, {}) as T
  }

  return data
}

function isComponentOrComponentList(data: any) {
  return (
    data
    && typeof data === 'object'
    && (data._beagleComponent_ || (Array.isArray(data) && data[0] && data[0]._beagleComponent_))
  )
}

function isActionOrActionList(data: any) {
  return (
    data
    && typeof data === 'object'
    && (data._beagleAction_ || (Array.isArray(data) && data[0] && data[0]._beagleAction_))
  )
}

/**
 * Similar to `resolve`. It replaces every reference to an expression in `component` (parameter) by
 * its value in the `contextHierarchy` (parameter). The difference is that it takes into
 * consideration that it is a component and doesn't evaluate sub-components, actions or properties
 * that can't contain expressions (`id`, `context`, `children` and `_beagleComponent_`).
 * 
 * When resolving expressions in a component it is important to ignore actions because an action
 * should only be evaluated when it's executed, and not when it's rendered.
 * 
 * When resolving expressions in a component, it is important to ignore sub-components because
 * they haven't been rendered yet. Take for instance a component called list-view that has the
 * property "template", template is an array of components that doesn't render as soon as the view
 * is rendered, instead, it is used to create the component's children at runtime. We don't need to
 * resolve its expressions when rendering the list-view.
 * 
 * @param component the component with the expressions to be replaced
 * @param contextHierarchy the data source to search for the values of the expressions
 * @returns the component with all its expressions replaced by their corresponding values
 */
function resolveForComponent<T extends BeagleUIElement>(
  component: T,
  contextHierarchy: DataContext[],
) {
  const shouldIgnore = (value: any, key: string) => (
    isComponentOrComponentList(value)
    || isActionOrActionList(value)
    || IGNORE_COMPONENT_KEYS.includes(key)
  )

  return resolve(component, contextHierarchy, shouldIgnore)
}

/**
 * Similar to `resolve`. It replaces every reference to an expression in `action` (parameter) by
 * its value in the `contextHierarchy` (parameter). The difference is that it takes into
 * consideration that it is an action and doesn't evaluate sub-components or sub-actions.
 * 
 * When resolving expressions inside an action it is important to ignore sub-actions because an
 * action should only be evaluated when it's executed. Take the action "sendRequest" for instance,
 * we should not resolve the expressions in the sub-action "onSuccess", these should be resolved
 * only when "onSuccess" is actually executed, i.e. when the request completes successfully.
 * 
 * When resolving expressions inside an action, it is important to ignore components because they
 * haven't been rendered yet. Take for instance the action "addChildren", we don't need to evaluate
 * the expressions of the components in "value", they will be evaluated when they actually get
 * rendered.
 * 
 * @param action the action with the expressions to be replaced
 * @param contextHierarchy the data source to search for the values of the expressions
 * @returns the action with all its expressions replaced by their corresponding values
 */
function resolveForAction(action: BeagleAction, contextHierarchy: DataContext[]) {
  const shouldIgnore = (value: any) => (
    isComponentOrComponentList(value)
    || isActionOrActionList(value)
  )

  return resolve(action, contextHierarchy, shouldIgnore)
}

export default {
  resolve,
  resolveForComponent,
  resolveForAction,
}
