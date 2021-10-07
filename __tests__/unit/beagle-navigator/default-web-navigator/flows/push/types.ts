import { BeagleUIElement } from 'beagle-tree/types'
import { NavigationController } from 'beagle-navigator/types'

export interface PrepareParams {
  fetchResult?: BeagleUIElement,
  defaultController?: Partial<NavigationController>,
  fetchError?: Error,
}

export type PushOperation = 'pushView' | 'pushStack' | 'resetStack' | 'resetApplication'
