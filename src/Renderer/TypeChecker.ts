import { BeagleUIElement, ComponentTypeMetadata, ChildrenMetadata } from '../types'

/**
 * Checks if the component (1st parameter) matches the type definition declared in `typeMetadata`
 * (2nd parameter) and if its children match the restrictions provided by `childrenMetadata` (3rd)
 * parameter.
 * 
 * If the component doesn't match the metadata, an error is thrown with a message that helps
 * identifying the underlying problem.
 * 
 * @param component the component to check the types and children
 * @param typeMetadata the type metadata of the component
 * @param childrenMetadata the children metadata of the component
 */
function check(
  component: BeagleUIElement,
  typeMetadata: ComponentTypeMetadata,
  childrenMetadata?: ChildrenMetadata,
) {
  // todo
}

export default {
  check,
}
