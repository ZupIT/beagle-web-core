import { BeagleUIElement, IdentifiableBeagleUIElement } from 'beagle-tree/types'

export interface TemplateManagerItem {
  case: string,
  view: BeagleUIElement,
}

export interface TemplateManager {
  default?: BeagleUIElement,
  templates: TemplateManagerItem[],
}

export type ComponentManager = (component: IdentifiableBeagleUIElement, index: number) => IdentifiableBeagleUIElement
