import { BeagleUIElement, ChildrenMetadata } from '../types'

const CHILDREN_PROPERTY_NAMES = ['child']
export const ID_PREFIX = '_beagle_'
let nextId = 1

/**
 * Guarantees that the children of the component will be called "children" and will be an array.
 * 
 * This function alters the parameter `component`.
 * 
 * @param component the component to have its children property formatted
 * @param childrenMetadata the children metadata of the component, it tells which property of the
 * component should act as its children
 */
function formatChildrenProperty(
  component: BeagleUIElement,
  childrenMetadata?: ChildrenMetadata,
) {
  const properties = childrenMetadata
    ? [childrenMetadata.property, ...CHILDREN_PROPERTY_NAMES]
    : CHILDREN_PROPERTY_NAMES

  properties.find((property) => {
    if (!component[property]) return false
    component.children = component[property]
    delete component[property]
  })

  if (component.children && !Array.isArray(component.children)) {
    component.children = [component.children]
  }
}

/**
 * Assigns an id to the component if it doesn't have an id yet. The id follows the format
 * `_beagle_%d`, where %d is in incremental integer, starting at 1.
 * 
 * This function alters the parameter `component`.
 * 
 * @param component the component to have its id assigned
 */
function assignId(component: BeagleUIElement) {
  component.id = component.id || `${ID_PREFIX}${nextId++}`
}

export default {
  formatChildrenProperty,
  assignId,
}
