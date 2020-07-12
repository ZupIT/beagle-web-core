import get from 'lodash/get'
import { DataContext } from '../types'
import Context from './Context'

const expressionRegex = /(\\*)@\{([^\}]+)\}/g
const fullExpressionRegex = /^@\{([^\}]+)\}$/

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
 * Supposing the data is a complex object and we don't want to resolve expressions in certain parts
 * of the object, a third parameter can be passed (`ignore`). If the function `ignore` is specified,
 * it will be called for each part of the object before we try to resolve the expressions on it. If
 * `ignore` returns true, the expression resolution will be skipped.
 * 
 * This function doesn't alter its parameters, instead, the data with the expressions replaced will
 * be its return value.
 * 
 * @param data the data with the expressions to be replaced.
 * @param contextHierarchy the data source to search for the values of the expressions.
 * @param ignore optional. This function will be called for every property (or element) in `data`.
 * When it returns true, the property (or element) will be skipped.
 * @returns data with all its expressions replaced by their corresponding values.
 */
export function resolve<T extends any>(
  data: T,
  contextHierarchy: DataContext[],
  ignore?: (data: T) => boolean,
): T {
  if (ignore && ignore(data)) return data

  if (typeof data === 'string') return resolveExpressionsInString(data, contextHierarchy)

  if (Array.isArray(data)) {
    return data.map((item: any) => resolve(item, contextHierarchy)) as T
  }

  if (typeof data === 'object') {
    const map = data as Record<string, any>
    return Object.keys(map).reduce((result, key) => ({
      ...result,
      [key]: resolve(map[key], contextHierarchy),
    }), {}) as T
  }

  return data
}

export default {
  resolve,
}
