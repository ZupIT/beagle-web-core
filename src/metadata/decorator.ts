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

/* ATTENTION:
 * This file declares a series of functions and it is extremely important that they are declared
 * as common functions instead of arrow functions (lambda). Due to limitations of the Angular
 * compiler, if we have arrow functions here, the Angular code won't compile.
 */

import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { Lifecycle, LifecycleHook } from 'service/beagle-service/types'
import {
  ComponentWithMetadata,
  ChildrenMetadata,
} from './types'

function registerLifecycleToComponent(
  lifecycleName: Lifecycle,
  lifecycleHook: LifecycleHook,
  component: ComponentWithMetadata,
) {
  component.beagleMetadata = component.beagleMetadata || {}
  component.beagleMetadata.lifecycles = component.beagleMetadata.lifecycles || {}
  component.beagleMetadata.lifecycles[lifecycleName] = lifecycleHook
}

export function BeforeStart(hook: LifecycleHook) {
  return function(target: any) {
    registerLifecycleToComponent('beforeStart', hook, target)
  }
}

export function BeforeViewSnapshot(hook: LifecycleHook<IdentifiableBeagleUIElement>) {
  return function(target: any) {
    registerLifecycleToComponent('beforeViewSnapshot', hook, target)
  }
}

export function AfterViewSnapshot(hook: LifecycleHook<IdentifiableBeagleUIElement>) {
  return function(target: any) {
    registerLifecycleToComponent('afterViewSnapshot', hook, target)
  }
}

export function BeforeRender(hook: LifecycleHook<IdentifiableBeagleUIElement>) {
  return function(target: any) {
    registerLifecycleToComponent('beforeRender', hook, target)
  }
}

export function BeagleChildren(childrenMetadata: ChildrenMetadata) {
  return function (target: any) {
    const component = target as ComponentWithMetadata
    component.beagleMetadata = component.beagleMetadata || {}
    component.beagleMetadata.children = childrenMetadata
  }
}
