/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import logger from 'logger'
import get from 'lodash/get'
import { BeagleAction } from 'action/types'
import { DataContext, BeagleUIElement } from 'beagle-tree/types'
import Automaton from 'utils/automaton'
import { EXPRESSION_REGEX, FULL_EXPRESSION_REGEX } from 'utils/expression'
import BeagleNotFoundError from 'error/BeagleNotFoundError'
import BeagleParseError from 'error/BeagleParseError'
import { Operation } from 'service/beagle-service/types'
import Context from './context'

const IGNORE_COMPONENT_KEYS = ['id', 'context', 'children', '_beagleComponent_']

function getContextBindingValue(
  path: string,
  contextHierarchy: DataContext[],
) {
  if (!path.match(/^[\w\d_]+(\[\d+\])*(\.([\w\d_]+(\[\d+\])*))*$/)) {
    throw new BeagleParseError(
      `invalid path "${path}". Please, make sure your variable names contain only letters, numbers and the symbol "_". To access substructures use "." and to access array indexes use "[index]".`
    )
  }

  const pathMatch = path.match(/^([^\.\[\]]+)\.?(.*)/)
  if (!pathMatch || pathMatch.length < 1) return
  const contextId = pathMatch[1]
  const contextPath = pathMatch[2]
  const context = Context.find(contextHierarchy, contextId)
  if (!context) throw new BeagleNotFoundError(`Couldn't find context with id "${contextId}"`)

  return contextPath ? get(context.value, contextPath, null) : context.value
}

/**
 * The parameters of an operation can only be represented by a context free grammar, i.e. we can't
 * recognize each parameter with a simple regular expression. We need a deterministic pushdown
 * automaton (DPA) to do this. This function is the automaton to solve this problem, it recognizes
 * each parameter in the operation and return an array of parameters as its result.
 *
 * @param input the input to the automaton
 * @returns an array of parameters
 */
function parseParameters(parameterString: string) {
  const transitions = {
    initial: [
      { read: /,|$/, next: 'final' }, // end of parameter
      { read: '(', push: '(', next: 'insideParameterList' }, // start of a parameter list
      { read: /'([^']|(\\.))*'/, next: 'initial' }, // strings
      { read: /[^\)]/, next: 'initial' }, // general symbols
    ],
    insideParameterList: [
      { read: '(', push: '(', next: 'insideParameterList' }, // start of another parameter list
      { read: ')', pop: '(', next: 'isParameterListOver' }, // end of a parameter list, check if still inside a parameter list
      { read: /'([^']|(\\.))*'/, next: 'insideParameterList' }, // strings
      { read: /./, next: 'insideParameterList' }, // general symbols
    ],
    isParameterListOver: [
      { pop: Automaton.empty, next: 'initial' }, // end of parameter list, go back to initial state
      { next: 'insideParameterList' }, // still inside a parameter list, go back to state "insideParameterList"
    ],
  }

  const dpa = Automaton.createDPA({ initial: 'initial', final: 'final', transitions })
  const parameters = []
  let position = 0

  while (position < parameterString.length) {
    const match = dpa.match(parameterString.substr(position))
    if (!match) throw new BeagleParseError(`wrong format for parameters: ${parameterString}`)
    parameters.push(match.replace(/,$/, '').trim())
    position += match.length
  }

  return parameters
}

function getOperationValue(operation: string, contextHierarchy: DataContext[], operationHandlers: Record<string, Operation>) {
  const match = operation.match(/^(\w+)\((.*)\)$/)
  if (!match) {
    throw new BeagleParseError(`invalid operation in expression: ${operation}`)
  }

  const operationName = match[1] as keyof typeof operationHandlers
  const paramString = match[2]
  if (!operationHandlers[operationName]) {
    throw new BeagleNotFoundError(`operation with name "${operationName}" doesn't exist.`)
  }
  const params = parseParameters(paramString)
  // eslint-disable-next-line
  const resolvedParams: any[] = params.map(param => evaluateExpression(param, contextHierarchy, operationHandlers))

  const fn = operationHandlers[operationName] as Operation
  return fn(...resolvedParams)
}

function getLiteralValue(literal: string) {
  // true, false or null
  if (literal === 'true') return true
  if (literal === 'false') return false
  if (literal === 'null') return null

  // number
  if (literal.match(/^\d+(\.\d+)?$/)) return parseFloat(literal)

  // string
  if (literal.startsWith('\'') && literal.endsWith('\'')) {
    return literal.replace(/(^')|('$)/g, '').replace(/\\'/g, '\'')
  }
}

function evaluateExpression(expression: string, contextHierarchy: DataContext[], operationHandlers: Record<string, Operation>) {
  const literalValue = getLiteralValue(expression)
  if (literalValue !== undefined) return literalValue

  const isOperation = expression.includes('(')
  if (isOperation) return getOperationValue(expression, contextHierarchy, operationHandlers)

  // otherwise, it's a context binding
  return getContextBindingValue(expression, contextHierarchy)
}

function resolveExpressionsInString(str: string, contextHierarchy: DataContext[], operationHandlers: Record<string, Operation>) {
  const fullMatch = str.match(FULL_EXPRESSION_REGEX)
  if (fullMatch) {
    try {
      const bindingValue = evaluateExpression(fullMatch[1], contextHierarchy, operationHandlers)
      return bindingValue === undefined ? str : bindingValue
    } catch (error) {
      logger.warn(error)
      return null
    }
  }
  return str.replace(EXPRESSION_REGEX, (bindingStr, slashes, path) => {
    const isBindingScaped = slashes.length % 2 === 1
    const scapedSlashes = slashes.replace(/\\\\/g, '\\')
    if (isBindingScaped) return `${scapedSlashes.replace(/\\$/, '')}@{${path}}`
    let bindingValue: string | undefined
    try {
      bindingValue = evaluateExpression(path, contextHierarchy, operationHandlers)
    } catch (error) {
      logger.warn(error)
    }
    const asString = (bindingValue && typeof bindingValue === 'object') ? JSON.stringify(bindingValue) : bindingValue
    return (bindingValue === undefined || bindingValue === null) ? scapedSlashes : `${scapedSlashes}${asString}`
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
  operationHandlers: Record<string, Operation>,
  shouldIgnore?: (value: any, key: string) => boolean,
): T {
  if (typeof data === 'string') return resolveExpressionsInString(data, contextHierarchy, operationHandlers)

  if (Array.isArray(data)) {
    return data.map((item: any) => resolve(item, contextHierarchy, operationHandlers, shouldIgnore)) as T
  }

  if (data && typeof data === 'object') {
    const map = data as Record<string, any>
    return Object.keys(map).reduce((result, key) => {
      const value = map[key]
      return (shouldIgnore && shouldIgnore(value, key))
        ? { ...result, [key]: value }
        : { ...result, [key]: resolve(value, contextHierarchy, operationHandlers, shouldIgnore) }
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
  operationHandlers: Record<string, Operation>
) {
  const shouldIgnore = (value: any, key: string) => (
    isComponentOrComponentList(value)
    || isActionOrActionList(value)
    || IGNORE_COMPONENT_KEYS.includes(key)
  )
  return resolve(component, contextHierarchy, operationHandlers, shouldIgnore)
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
function resolveForAction(action: BeagleAction, contextHierarchy: DataContext[], operationHandlers: Record<string, Operation>) {
  const shouldIgnore = (value: any) => (
    isComponentOrComponentList(value)
    || isActionOrActionList(value)
  )

  return resolve(action, contextHierarchy, operationHandlers, shouldIgnore)
}

export default {
  resolve,
  resolveForComponent,
  resolveForAction,
}
