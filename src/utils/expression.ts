import Context from 'beagle-view/render/context'
import { BeagleView } from 'beagle-view/types'
import { getTreeContextHierarchy } from './context'

export const EXPRESSION_REGEX = /(\\*)@\{(([^'\}]|('([^'\\]|\\.)*'))*)\}/g
export const FULL_EXPRESSION_REGEX = /^@\{(([^'\}]|('([^'\\]|\\.)*'))*)\}$/

export type ContextExpressionEvalResult = {
  isContext: boolean,
  contextId?: string,
  contextPath?: string,
}

export function isContextExpression(expression: any, view: BeagleView): ContextExpressionEvalResult {
  if (expression && typeof expression === 'string') {
    const paths = expression.match(FULL_EXPRESSION_REGEX)?.at(1)?.split('.')
    const treeContextHierarchy = getTreeContextHierarchy(view)
    if (paths && paths.length && Context.find(treeContextHierarchy, paths[0])) {
      const contextId = paths[0]
      const contextPath = paths.length > 1 ? paths.slice(1).join('.') : ''
      return {
        isContext: true,
        contextId,
        contextPath,
      }
    }
  }

  return { isContext: false }
}
