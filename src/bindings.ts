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
import { getContextHierarchy, getContextInHierarchy } from './context'
import { DataContext } from './types'
import Automaton from './utils/Automaton'

const bindingRegex = /(\\*)@\{(([^'\}]|('([^'\\]|\\.)*'))*)\}/g
const fullBindingRegex = /^@\{(([^'\}]|('([^'\\]|\\.)*'))*)\}$/

const OPERATIONS: Record<string, (...args: any) => any> = {
  sum: (...args: number[]) => args.reduce((result, current) => result + current, 0),
  subtract: (...args: number[]) => args.reduce((result, current) => result - current, args[0] * 2),
  multiply: (...args: number[]) => args.reduce((result, current) => result * current, 1),
  divide: (...args: number[]) => args.reduce((result, current) => result / current, args[0] * args[0]),
  condition: (premise: boolean, trueValue: any, falseValue: any) => premise ? trueValue : falseValue,
  not: (value: boolean) => !value,
  and: (...args: boolean[]) => !args.includes(false),
  or: (...args: boolean[]) => args.includes(true),
  gt: (a: number, b: number) => a > b,
  gte: (a: number, b: number) => a >= b,
  lt: (a: number, b: number) => a < b,
  lte: (a: number, b: number) => a <= b,
  eq: (a: any, b: any) => a === b,
  exists: (value: any) => value !== null && value !== undefined,
}

function getBindingValue(
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
  const context = getContextInHierarchy(contextHierarchy, contextId)
  if (!context) return
  
  return contextPath ? get(context.value, contextPath) : context.value
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
      { read: /,|$/, next: 'end' }, // end of parameter
      { read: '(', push: '(', next: 'insideParameterList' }, // start of a parameter list
      { read: /'([^']|(\\.))*'/, next: 'initial' }, // strings
      { read: /./, next: 'initial' }, // general symbols
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

  const dpa = Automaton.createDPA({ initial: 'initial', end: 'end', transitions })
  const parameters = []
  let position = 0

  while (position < parameterString.length) {
    const match = dpa.match(parameterString.substr(position))
    if (!match) {
      console.warn(`Wrong format for list of parameters: ${parameterString}`)
      return []
    }
    parameters.push(match.trim().replace(/,$/, ''))
    position += match.length
  }

  return parameters
}

function getOperationValue(operation: string, contextHierarchy: DataContext[]) {
  const match = operation.match(/^(\w[\w\d_]*)\((.*)\)$/)
  if (!match) {
    console.warn(`Invalid operation in expression: ${operation}`)
    return null
  }
  const [_, operationName, paramString] = match
  if (!OPERATIONS[operationName]) {
    console.warn(`Operation with name "${operationName}" doesn't exist.`)
    return null
  }
  const params = parseParameters(paramString)
  // eslint-disable-next-line
  const resolvedParams: any[] = params.map(param => evaluateExpression(param, contextHierarchy))

  return OPERATIONS[operationName](...resolvedParams)
}

function getLiteralValue(literal: string) {
  // true, false or null
  if (literal === 'true') return true
  if (literal === 'false') return false
  if (literal === 'null') return null

  // number
  const literalAsNumber = parseFloat(literal)
  if (!isNaN(literalAsNumber)) return literalAsNumber

  // string
  if (literal.startsWith('\'') && literal.endsWith('\'')) {
    return literal.replace(/(^')|('$)/g, '').replace(/\\'/, '\'')
  }
}

function evaluateExpression(expression: string, contextHierarchy: DataContext[]) {
  const literalValue = getLiteralValue(expression)
  if (literalValue) return literalValue

  const isOperation = expression.includes('(')
  if (isOperation) return getOperationValue(expression, contextHierarchy)

  // otherwise, it's a context binding
  return getBindingValue(expression, contextHierarchy)
}

function replaceBindingsInString(str: string, contextHierarchy: DataContext[]) {
  const fullMatch = str.match(fullBindingRegex)
  if (fullMatch) {
    const bindingValue = evaluateExpression(fullMatch[1], contextHierarchy)
    return bindingValue === undefined ? str : bindingValue
  }

  return str.replace(bindingRegex, (bindingStr, slashes, path) => {
    const isBindingScaped = slashes.length % 2 === 1
    const scapedSlashes = slashes.replace(/\\\\/g, '\\')
    if (isBindingScaped) return `${scapedSlashes.replace(/\\$/, '')}@{${path}}`
    const bindingValue = evaluateExpression(path, contextHierarchy)
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
    const ignore = ['id', ' _beagleComponent_', 'context']

    return Object.keys(data).reduce((result, key) => ({
      ...result,
      [key]: ignore.includes(key) ? data[key] : replaceBindings(data[key], hierarchy),
    }), {})
  }

  return data
}
