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

import { BeagleNavigator } from 'beagle-navigator/types'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import BeagleError from 'error/BeagleError'
import { BeagleService } from 'service/beagle-service/types'
import { Renderer } from './render/types'

export type ChangeListener = (tree: IdentifiableBeagleUIElement) => void

export type ErrorListener = (errors: Array<BeagleError>) => void

export interface BeagleView {
  /**
   * Subscribes to every change to the beagle tree.
   *
   * @param listener the function to run every time the tree changes. Must receive a tree as
   * parameter.
   * @returns a function to remove the listener (unsubscribe)
   */
  onChange: (listener: ChangeListener) => (() => void),
  /**
   * Gets the renderer of the current BeagleView. Can be used to control the rendering directly.
   *
   * @returns the renderer
   */
  getRenderer: () => Renderer,
  /**
   * Gets a copy of the currently rendered tree.
   *
   * @returns a copy of the current tree
   */
  getTree: () => IdentifiableBeagleUIElement,
  /**
   * Gets the navigator of the Beagle View.
   *
   * @returns the navigator
   */
  getNavigator: () => BeagleNavigator<any> | undefined,
  /**
   * Gets the BeagleService that created this BeagleView.
   *
   * @returns the BeagleService
   */
  getBeagleService: () => BeagleService,
  /**
   * Destroys the current view. Should be used when the BeagleView won't be used anymore. Avoids
   * memory leaks and calls to objects that don't exist any longer.
   */
  destroy: () => void,
}
