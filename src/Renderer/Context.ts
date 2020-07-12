import { IdentifiableBeagleUIElement, DataContext } from '../types'

/**
 * Parses a tree looking for the context hierarchy of each component. The context hierarchy of a
 * component is a stack of contexts. The top position of the stack will be the closest context
 * to the component, while the bottom will be the farthest.
 * 
 * @param viewTree the tree to parse the contexts from
 * @returns a map where the key corresponds to the component id and the value to the context
 * hierarchy of the component.
 */
function evaluate(viewTree: IdentifiableBeagleUIElement): Record<string, DataContext[]> {
  const contextMap: Record<string, DataContext[]> = {}

  function evaluateContextHierarchy(
    component: IdentifiableBeagleUIElement,
    contextHierarchy: DataContext[],
  ) {
    const hierarchy = component.context
      ? [...contextHierarchy, component.context]
      : contextHierarchy

    contextMap[component.id] = hierarchy
    if (!component.children) return
    component.children.forEach(child => evaluateContextHierarchy(child, hierarchy))
  }

  evaluateContextHierarchy(viewTree, [])

  return contextMap
}

/**
 * Finds a context in a context hierarchy. A context hierarchy is the stack of contexts available
 * to a component or action.
 * 
 * If there's no context with `id === contextId`, undefined is returned.
 * 
 * @param contextHierarchy stack of contexts available, top value has the greatest priority
 * @param contextId the id of the context to find. If not specified, the context in the top of the
 * stack is returned
 */
function find(contextHierarchy: DataContext[], contextId?: string) {
  return contextId
    ? contextHierarchy.find(({ id }) => id === contextId)
    : contextHierarchy[0]
}

export default {
  evaluate,
  find,
}
