/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

// todo: legacy code. Remove with v2.0.

import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { LoadParams, BeagleView, UpdateWithTreeParams } from 'beagle-view/types'
import { ViewContentManager } from 'service/view-content-manager/types'

/**
 * @deprecated since v1.2. Will de deleted in v2.0. Use `ViewContentManager` instead.
 */
export interface BeagleContext<T = any> {
  replace: (params: LoadParams<T>) => Promise<void>,
  append: (params: LoadParams<T>) => Promise<void>,
  prepend: (params: LoadParams<T>) => Promise<void>,
  updateWithTree: (params: Omit<UpdateWithTreeParams<T>, 'elementId'>) => void,
  getElementId: () => string,
  getElement: () => IdentifiableBeagleUIElement<T> | null,
  getView: () => BeagleView<T>,
}

export function createBeagleContextFromViewContentManager(
  manager: ViewContentManager,
): BeagleContext {
  return {
    replace: manager.replaceComponent,
    append: manager.append,
    prepend: manager.prepend,
    getElementId: manager.getElementId,
    getElement: manager.getElement,
    getView: manager.getView,
    updateWithTree: params => manager.getView().updateWithTree({
      ...params,
      elementId: manager.getElementId(),
    }),
  }
}
