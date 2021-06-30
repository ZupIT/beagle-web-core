import { BeagleUIElement, IdentifiableBeagleUIElement } from 'beagle-tree/types'

export interface TemplateManagerItem {
  case: string | boolean,
  view: BeagleUIElement,
}

export interface TemplateManager {
  default?: BeagleUIElement,
  templates: TemplateManagerItem[],
}

export type ComponentManager = (component: IdentifiableBeagleUIElement, index: number) => Record<string, any>
