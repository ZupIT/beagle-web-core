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

import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { BeagleView, LoadParams } from 'beagle-view/types'

export interface ViewContentManager {
  replaceComponent: (params: LoadParams) => Promise<void>,
  replace: (params: LoadParams) => Promise<void>,
  append: (params: LoadParams) => Promise<void>,
  prepend: (params: LoadParams) => Promise<void>,
  getElementId: () => string,
  getElement: () => IdentifiableBeagleUIElement,
  getView: () => BeagleView,
}

export interface ViewContentManagerMap {
  get: (viewId: string, elementId: string) => ViewContentManager,
  register: (viewId: string, view: any) => void,
  unregister: (viewId: string) => void,
  isRegistered: (viewId: string) => boolean,
}
